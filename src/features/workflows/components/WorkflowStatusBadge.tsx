import React from 'react';

const statusStyles: Record<string, string> = {
  Succeeded: 'bg-emerald-500/15 text-emerald-700 border-emerald-400/40',
  Running: 'bg-blue-500/15 text-blue-700 border-blue-400/40',
  Pending: 'bg-amber-500/20 text-amber-700 border-amber-400/40',
  Failed: 'bg-rose-500/15 text-rose-700 border-rose-400/40',
  Error: 'bg-rose-500/15 text-rose-700 border-rose-400/40',
  Suspended: 'bg-zinc-500/15 text-zinc-700 border-zinc-400/40',
};

const fallback = 'bg-slate-500/15 text-slate-700 border-slate-400/40';

interface WorkflowStatusBadgeProps {
  status?: string;
  size?: 'sm' | 'md';
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ status, size = 'md' }) => {
  const label = status || 'Unknown';
  const style = statusStyles[label] || fallback;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style} ${sizeClass} font-semibold tracking-wide uppercase`}
    >
      {label}
    </span>
  );
};

export default WorkflowStatusBadge;
