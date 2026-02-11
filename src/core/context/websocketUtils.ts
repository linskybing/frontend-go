import type { ResourceMessage } from './ws-types';

export function isDeletionEvent(msg: ResourceMessage): boolean {
  if (msg.type === 'DELETED') return true;
  if (msg.metadata?.deletionTimestamp) return true;
  return false;
}

export default { isDeletionEvent };
