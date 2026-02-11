export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface ApiErrorResponse {
  message?: string;
  statusCode?: number;
  details?: unknown;
}

// Keep a small compatible ErrorResponse shape used throughout the UI
export interface ErrorResponse {
  error: string;
}

export type MessageResponse = { message: string };
