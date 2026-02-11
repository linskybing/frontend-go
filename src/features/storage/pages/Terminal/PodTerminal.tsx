import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useTranslation } from '@nthucscc/utils';

const getWsUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const host = isLocal ? `${hostname}:30080` : window.location.host;
    return `${protocol}//${host}`;
  }
  return 'ws://localhost:30080';
};

// Define the message structure for communication with the backend.
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
}

const TerminalPage: React.FC<TerminalProps> = ({
  namespace,
  pod,
  container,
  command = 'bash',
  tty = true,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const fitAddon = useRef(new FitAddon());

  const { t } = useTranslation();

  useEffect(() => {
    // t is used inside websocket event handlers below
    if (!terminalRef.current) return;
    // Avoid creating websocket when required params are missing — prevents transient error messages
    if (!namespace || !pod || !container) {
      term.current?.writeln(
        `\x1b[1;33m➜ ${t('terminal.connecting') || 'Waiting for terminal target...'}\x1b[0m`,
      );
      return;
    }
    // 1. Initialize the Terminal with a modern, dark theme.
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      letterSpacing: 0.5,
      lineHeight: 1.3,
      fontFamily: '"FiraCode Nerd Font", Consolas, "Courier New", monospace',
      theme: {
        background: 'transparent',
        foreground: '#d4d4d4',
        cursor: '#a9b7c6',
        selectionBackground: '#525252',
        black: '#000000',
        red: '#ef5350',
        green: '#c3e88d',
        yellow: '#ffcb6b',
        blue: '#82aaff',
        magenta: '#c792ea',
        cyan: '#89ddff',
        white: '#ffffff',
        brightBlack: '#546e7a',
        brightRed: '#ff5370',
        brightGreen: '#c3e88d',
        brightYellow: '#ffcb6b',
        brightBlue: '#82aaff',
        brightMagenta: '#c792ea',
        brightCyan: '#89ddff',
        brightWhite: '#ffffff',
      },
    });

    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);

    // 2. Establish the WebSocket Connection.
    const WS_BASE = getWsUrl();
    const wsUrl = `${WS_BASE}/ws/exec?namespace=${encodeURIComponent(
      namespace,
    )}&pod=${encodeURIComponent(pod)}&container=${encodeURIComponent(
      container,
    )}&command=${encodeURIComponent(command)}&tty=${tty}`;

    socket.current = new WebSocket(wsUrl);

    // 3. Handle WebSocket Events.
    socket.current.onopen = () => {
      term.current?.writeln(`\x1b[38;5;154m[${t('terminal.connected')}]\x1b[0m`);

      fitAddon.current.fit();

      const initialSize = {
        type: 'resize',
        cols: term.current?.cols,
        rows: term.current?.rows,
      };
      socket.current?.send(JSON.stringify(initialSize));
    };

    socket.current.onmessage = (event) => {
      try {
        const msg: TerminalMessage = JSON.parse(event.data);
        if (msg.type === 'stdout' && msg.data) {
          term.current?.write(msg.data);
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('Failed to parse websocket message', e);
        }
      }
    };

    socket.current.onerror = () => {
      term.current?.writeln(`\x1b[31m[${t('terminal.websocketError')}]\x1b[0m`);
    };

    socket.current.onclose = () => {
      term.current?.writeln(`\n\x1b[38;5;220m[${t('terminal.disconnected')}]\x1b[0m`);
    };

    // 4. Handle xterm.js Events.
    term.current.onData((data) => {
      const stdinMessage: TerminalMessage = { type: 'stdin', data };
      socket.current?.send(JSON.stringify(stdinMessage));
    });

    term.current.onResize(({ cols, rows }) => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        const resizeMessage: TerminalMessage = { type: 'resize', cols, rows };
        socket.current.send(JSON.stringify(resizeMessage));
      }
    });

    // 5. Handle Browser Window Resize.
    const handleResize = () => {
      fitAddon.current.fit();
    };
    window.addEventListener('resize', handleResize);

    // 6. Cleanup function to prevent memory leaks.
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.current?.close();
      term.current?.dispose();
    };
  }, [namespace, pod, container, command, tty, t]);

  return (
    <div
      ref={terminalRef}
      className="
        w-full 
        h-[80vh] 
        p-4 
        bg-gray-800 
        shadow-2xl 
        rounded-lg 
        border border-gray-700
      "
    />
  );
};

export default TerminalPage;
