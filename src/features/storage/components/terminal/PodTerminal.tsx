import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { BASE_URL } from '@/core/config/url';
import '@xterm/xterm/css/xterm.css';
import { useTranslation } from '@nthucscc/utils';

interface TerminalMessage {
  type: 'stdin' | 'stdout' | 'resize';
  data?: string;
  cols?: number;
  rows?: number;
}

interface TerminalProps {
  namespace: string;
  pod: string;
  container: string;
  command?: string;
  tty?: boolean;
  onClosed?: () => void;
}

const TerminalPage: React.FC<TerminalProps> = ({
  namespace,
  pod,
  container,
  command = 'bash',
  tty = true,
  onClosed,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Refs
  const term = useRef<Terminal | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const webglAddon = useRef<WebglAddon | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const { t } = useTranslation();

  const writeStatus = (message: string, color: 'green' | 'red' | 'yellow') => {
    if (!term.current) return;
    const colors = {
      green: '\x1b[1;32m',
      red: '\x1b[1;31m',
      yellow: '\x1b[1;33m',
    };
    const reset = '\x1b[0m';
    term.current.writeln(`${colors[color]}➜ ${message}${reset}`);
  };

  useEffect(() => {
    if (!terminalRef.current) return;
    // Avoid creating websocket when required params are missing — prevents transient error messages
    if (!namespace || !pod || !container) {
      writeStatus(`${t('terminal.connecting') || 'Waiting for terminal target...'}`, 'yellow');
      return;
    }

    // 1. Initialize Terminal
    const terminalInstance = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      lineHeight: 1.2,
      letterSpacing: 1,
      fontFamily: '"MesloLGS NF", "FiraCode-Retina", "Fira Code", monospace',
      fontWeight: '500',
      allowTransparency: false,
      theme: {
        background: '#101828', // Matches RGB(16, 24, 40)
        foreground: '#EAECF0',
        cursor: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
        black: '#101828',
        red: '#ef5350',
        green: '#4caf50',
        yellow: '#ffeb3b',
        blue: '#42a5f5',
        magenta: '#ab47bc',
        cyan: '#26c6da',
        white: '#ffffff',
        brightBlack: '#707070',
        brightRed: '#ff5370',
        brightGreen: '#c3e88d',
        brightYellow: '#ffcb6b',
        brightBlue: '#82aaff',
        brightMagenta: '#c792ea',
        brightCyan: '#89ddff',
        brightWhite: '#ffffff',
      },
    });
    term.current = terminalInstance;

    // 2. Load Addons
    const fitInstance = new FitAddon();
    fitAddon.current = fitInstance;
    terminalInstance.loadAddon(fitInstance);

    try {
      const webglInstance = new WebglAddon();
      webglInstance.onContextLoss(() => webglInstance.dispose());
      webglAddon.current = webglInstance;
      terminalInstance.loadAddon(webglInstance);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('WebGL addon failed to load', e);
      }
    }

    // 3. Mount
    terminalInstance.open(terminalRef.current);
    writeStatus(`${t('terminal.connecting') || 'Connecting...'}`, 'yellow');

    // 4. WebSocket
    const wsUrl = `ws://${BASE_URL}/ws/exec?namespace=${encodeURIComponent(
      namespace,
    )}&pod=${encodeURIComponent(pod)}&container=${encodeURIComponent(
      container,
    )}&command=${encodeURIComponent(command)}&tty=${tty}`;

    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = async () => {
      writeStatus(`${t('terminal.connected') || 'Connected.'}`, 'green');

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      if (term.current) {
        fitInstance.fit();
        socket.current?.send(
          JSON.stringify({
            type: 'resize',
            cols: terminalInstance.cols,
            rows: terminalInstance.rows,
          }),
        );
        terminalInstance.focus();
      }
    };

    socket.current.onmessage = (event) => {
      try {
        const msg: TerminalMessage = JSON.parse(event.data);
        if (msg.type === 'stdout' && msg.data) {
          term.current?.write(msg.data);
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('WS Parse Error', e);
        }
      }
    };

    socket.current.onerror = () => {
      writeStatus(`${t('terminal.websocketError') || 'Connection Error'}`, 'red');
    };

    socket.current.onclose = (event) => {
      // `setOption` may not be present in some xterm type definitions — use a safe cast
      try {
        (
          term.current as unknown as { setOption?: (name: string, value: unknown) => void }
        ).setOption?.('cursorBlink', false);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('Failed to set terminal option', err);
        }
      }

      if (event.wasClean || event.code === 1000) {
        writeStatus(`${t('terminal.disconnected') || 'Session ended.'}`, 'green');

        if (onClosed) {
          setTimeout(() => {
            onClosed();
          }, 800);
        }
      } else {
        writeStatus(
          `${t('terminal.disconnectedError') || 'Connection dropped unexpected.'}`,
          'red',
        );
      }
    };

    terminalInstance.onData((data) => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: 'stdin', data }));
      }
    });

    terminalInstance.onResize(({ cols, rows }) => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: 'resize', cols, rows }));
      }
    });

    // 5. ResizeObserver
    resizeObserver.current = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (term.current && fitAddon.current) {
          try {
            fitAddon.current.fit();
          } catch (err) {
            if (import.meta.env.DEV) {
              console.warn('fit failed', err);
            }
          }
        }
      });
    });

    if (terminalRef.current) {
      resizeObserver.current.observe(terminalRef.current);
    }

    return () => {
      resizeObserver.current?.disconnect();
      if (socket.current) {
        socket.current.onclose = null;
        socket.current.onerror = null;
        socket.current.onmessage = null;
        socket.current.onopen = null;

        socket.current.close();
        socket.current = null;
      }
      try {
        webglAddon.current?.dispose();
        webglAddon.current = null;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('webgl dispose failed', err);
        }
      }
      try {
        term.current?.dispose();
        term.current = null;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('terminal dispose failed', err);
        }
      }
    };
  }, [namespace, pod, container, command, tty, t, onClosed]);

  return (
    <div
      className="
        terminal-wrapper
        w-full
        h-[80vh]
        shadow-2xl
        rounded-lg
        border border-gray-700
        relative
        overflow-hidden
      "
      style={{
        backgroundColor: '#101828',
      }}
    >
      <div className="w-full h-full p-4 box-border">
        <div ref={terminalRef} className="w-full h-full" style={{ overflow: 'hidden' }} />
      </div>
    </div>
  );
};

export default TerminalPage;
