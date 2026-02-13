import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JOB_SUBMIT_URL } from '@/core/config/url';
import { submitJob } from './jobSubmitService';
import { fetchWithAuth } from '@/shared/utils/api';

vi.mock('@/shared/utils/api', () => ({
  fetchWithAuth: vi.fn(),
}));

describe('jobSubmitService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('posts job submissions to the configured submit URL with JSON payload', async () => {
    const mockFetch = fetchWithAuth as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({});

    await submitJob({ project_id: 'proj-1', config_file_id: 'cf-1', submit_type: 'job' });

    expect(fetchWithAuth).toHaveBeenCalledWith(JOB_SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: 'proj-1', config_file_id: 'cf-1', submit_type: 'job' }),
    });
  });
});
