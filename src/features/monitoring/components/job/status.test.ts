import { describe, expect, it } from 'vitest';
import { getJobStatusMeta } from './status';

describe('getJobStatusMeta', () => {
  it('normalizes lowercase statuses', () => {
    const meta = getJobStatusMeta('running');
    expect(meta.label).toBe('Running');
    expect(meta.className).toContain('yellow');
  });

  it('handles backend queued/scheduling statuses', () => {
    expect(getJobStatusMeta('queued').label).toBe('Queued');
    expect(getJobStatusMeta('scheduling').label).toBe('Scheduling');
  });

  it('falls back to unknown label', () => {
    const meta = getJobStatusMeta('mystery');
    expect(meta.label).toBe('mystery');
    expect(meta.className).toContain('gray');
  });
});
