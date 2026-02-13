import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow } from '@/core/services/system/workflowService';

const statusColors: Record<string, string> = {
  Succeeded: '#10b981',
  Running: '#3b82f6',
  Pending: '#f59e0b',
  Failed: '#f43f5e',
  Error: '#f43f5e',
  Suspended: '#64748b',
  Skipped: '#94a3b8',
};

const NodeCard = ({ data }: NodeProps) => {
  const status = data?.status || 'Unknown';
  const color = statusColors[status] || '#64748b';

  return (
    <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
          {data?.type || 'Step'}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-bold text-slate-600 uppercase">{status}</span>
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{data?.label}</div>
      {data?.message && (
        <div className="mt-1 text-[11px] text-slate-500 line-clamp-2">{data.message}</div>
      )}
    </div>
  );
};

const nodeTypes = { card: NodeCard };

const buildStatusGraph = (workflow: Workflow) => {
  const nodesMap = workflow.status?.nodes || {};
  const entries = Object.entries(nodesMap);
  if (entries.length === 0) return null;

  const nodes: Node[] = entries.map(([key, node], index) => ({
    id: node.id || key,
    type: 'card',
    position: { x: (index % 4) * 260, y: Math.floor(index / 4) * 160 },
    data: {
      label: node.displayName || node.name || key,
      status: node.phase,
      type: node.type,
      message: node.message,
    },
  }));

  const edgeSet = new Set<string>();
  const edges: Edge[] = [];

  entries.forEach(([key, node]) => {
    const sourceId = node.id || key;
    const targets = node.children || node.outboundNodes || [];
    targets.forEach((target) => {
      const id = `${sourceId}__${target}`;
      if (edgeSet.has(id)) return;
      edgeSet.add(id);
      edges.push({ id, source: sourceId, target, animated: node.phase === 'Running' });
    });
  });

  return { nodes, edges };
};

const buildSpecGraph = (workflow: Workflow) => {
  const entrypoint = workflow.spec?.entrypoint;
  const templates = workflow.spec?.templates || [];
  if (!entrypoint || templates.length === 0) return null;

  const entry = templates.find((t) => t.name === entrypoint);
  const tasks = entry?.dag?.tasks || [];
  if (tasks.length === 0) return null;

  const levelMap: Record<string, number> = {};
  const visit = (name: string, trail = new Set<string>()) => {
    if (levelMap[name] !== undefined) return levelMap[name];
    if (trail.has(name)) return 0;
    trail.add(name);
    const task = tasks.find((t) => t.name === name);
    const deps = task?.dependencies || [];
    if (deps.length === 0) {
      levelMap[name] = 0;
      return 0;
    }
    const level = Math.max(...deps.map((dep) => visit(dep, new Set(trail)))) + 1;
    levelMap[name] = level;
    return level;
  };

  tasks.forEach((task) => visit(task.name));

  const columns: Record<number, string[]> = {};
  tasks.forEach((task) => {
    const level = levelMap[task.name] ?? 0;
    if (!columns[level]) columns[level] = [];
    columns[level].push(task.name);
  });

  const nodes: Node[] = tasks.map((task) => {
    const level = levelMap[task.name] ?? 0;
    const row = columns[level].indexOf(task.name);
    return {
      id: task.name,
      type: 'card',
      position: { x: level * 260, y: row * 160 },
      data: {
        label: task.name,
        status: 'Pending',
        type: 'DAG',
      },
    };
  });

  const edges: Edge[] = [];
  tasks.forEach((task) => {
    (task.dependencies || []).forEach((dep) => {
      edges.push({ id: `${dep}__${task.name}`, source: dep, target: task.name });
    });
  });

  return { nodes, edges };
};

interface WorkflowGraphProps {
  workflow: Workflow | null;
}

const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ workflow }) => {
  const graph = useMemo(() => {
    if (!workflow) return null;
    return buildStatusGraph(workflow) || buildSpecGraph(workflow);
  }, [workflow]);

  if (!graph) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
        No workflow graph data available yet. Waiting for Argo status nodes.
      </div>
    );
  }

  return (
    <div className="h-[480px] w-full rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        fitView
        nodesConnectable={false}
        nodesDraggable
        zoomOnScroll
      >
        <Background color="#e2e8f0" gap={24} />
        <MiniMap
          nodeStrokeColor={(n) => statusColors[(n.data as any)?.status] || '#64748b'}
          nodeColor={(n) => statusColors[(n.data as any)?.status] || '#cbd5f5'}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default WorkflowGraph;
