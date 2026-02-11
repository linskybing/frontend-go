import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JOBS_URL, JOB_BY_ID_URL, JOB_LOGS_URL } from '@/core/config/url';
import { getJob, getJobLogs, getJobs } from './jobService';
import { fetchWithAuth } from '@/shared/utils/api';

vi.mock('@/shared/utils/api', () => ({
  fetchWithAuth: vi.fn(),
}));

describe('jobService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches jobs from configured URL and unwraps data arrays', async () => {
    const mockFetch = fetchWithAuth as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({ data: [{ ID: 1, Name: 'demo' }] });
    const jobs = await getJobs();
    expect(fetchWithAuth).toHaveBeenCalledWith(JOBS_URL);
    expect(jobs).toEqual([{ ID: 1, Name: 'demo' }]);
  });

  it('fetches a single job from configured URL', async () => {
    const mockFetch = fetchWithAuth as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({ data: { ID: 2, Name: 'single' } });
    const job = await getJob(2);
    expect(fetchWithAuth).toHaveBeenCalledWith(JOB_BY_ID_URL(2));
    expect(job).toEqual({ ID: 2, Name: 'single' });
  });

  it('normalizes log responses into string arrays', async () => {
    const mockFetch = fetchWithAuth as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({ data: [{ Content: 'line1' }, { content: 'line2' }] });
    const logs = await getJobLogs(3);
    expect(fetchWithAuth).toHaveBeenCalledWith(JOB_LOGS_URL(3));
    expect(logs).toEqual(['line1', 'line2']);
  });
});
