import type { ServiceResponse as SharedServiceResponse } from './shared';

export type ServiceResponse<T> = SharedServiceResponse<T>;

export interface ServiceSuccess<T> {
  success: true;
  data: T;
  error: null;
}

export interface ServiceFailure {
  success: false;
  data: null;
  error: Error;
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
} 