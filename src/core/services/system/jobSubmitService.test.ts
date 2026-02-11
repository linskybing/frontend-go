import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JOBS_URL } from '@/core/config/url';
import { submitJob } from './jobSubmitService';
import { fetchWithAuth } from '@/shared/utils/api';

vi.mock('@/shared/utils/api', () => ({
  fetchWithAuth: vi.fn(),
}));

describe('jobSubmitService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('posts job submissions to the configured URL with JSON payload', async () => {
    const mockFetch = fetchWithAuth as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({});

    await submitJob({ name: 'demo', image: 'img', namespace: 'ns', priority: 'low' });

    expect(fetchWithAuth).toHaveBeenCalledWith(JOBS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'demo', image: 'img', namespace: 'ns', priority: 'low' }),
    });
  });
});
