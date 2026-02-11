import { JOB_LOGS_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

export const getJobLog = async (jobId: string): Promise<string> => {
  const response = await fetchWithAuth(JOB_LOGS_URL(jobId));
  const payload = (response as { data?: unknown }).data ?? response;

  if (Array.isArray((payload as { logs?: unknown })?.logs)) {
    return ((payload as { logs: string[] }).logs as string[]).join('\n');
  }

  if (Array.isArray(payload)) {
    return (payload as Array<{ Content?: string; content?: string }>)
      .map((log) => log.Content ?? log.content ?? '')
      .filter(Boolean)
      .join('\n');
  }

  if (typeof (payload as { log?: unknown })?.log === 'string') {
    return (payload as { log: string }).log as string;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  return '';
};
