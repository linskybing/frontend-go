import { ChevronDownIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type Props = {
  index: number;
  name: string;
  isExpanded: boolean;
  onNameChange: (name: string) => void;
  onDuplicate: () => void;
  onToggleExpand: () => void;
  onRemove: () => void;
};

export default function ContainerHeader({
  index,
  name,
  isExpanded,
  onNameChange,
  onDuplicate,
  onToggleExpand,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-t-md border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
          {index + 1}
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-transparent text-sm font-bold text-gray-800 focus:outline-none focus:underline dark:text-white"
          placeholder="Container Name"
        />
      </div>
      <div className="flex gap-1">
        <button
          onClick={onDuplicate}
          title="Duplicate Container"
          className="p-1 text-gray-400 hover:text-indigo-600"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
        </button>
        <button onClick={onToggleExpand} className="p-1 text-gray-400 hover:text-gray-600">
          <ChevronDownIcon
            className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        <button
          onClick={onRemove}
          title="Remove Container"
          className="p-1 text-gray-400 hover:text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
