import { INSTANCE_BY_ID_URL } from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { fetchWithAuth } from '@/shared/utils/api';

export const instantiate = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
      method: 'POST',
    });
    return response as MessageResponse;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to instantiate.');
  }
};

export const destruct = async (id: string): Promise<void> => {
  try {
    await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to destruct.');
  }
};
