interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accentColor?: string;
}

export default function StatCard({ icon, label, value, accentColor }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-slate-900">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentColor || 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400'}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}
