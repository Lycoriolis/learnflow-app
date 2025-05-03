import type { ServiceResponse } from '../types/service';
import { ServiceError } from '../types/shared';

export class BaseService {
  protected async handleRequest<T>(
    requestFn: () => Promise<T>
  ): Promise<ServiceResponse<T>> {
    try {
      const data = await requestFn();
      return { data, error: null };
    } catch (error) {
      console.error('Service error:', error);
      const errorResponse = this.handleError(error);
      return { data: null as unknown as T, error: errorResponse.error };
    }
  }

  protected handleError(error: unknown): ServiceResponse<null> {
    if (error instanceof ServiceError) {
      return { data: null, error };
    }
    
    if (error instanceof Error) {
      return { 
        data: null, 
        error: new ServiceError(error.message, 'INTERNAL_ERROR', 500) 
      };
    }
    
    return { 
      data: null, 
      error: new ServiceError('An unknown error occurred', 'UNKNOWN_ERROR', 500) 
    };
  }

  protected validateId(id: string): void {
    if (!id) {
      throw new ServiceError('ID is required', 'INVALID_ID', 400);
    }
  }

  protected validateInput(value: string, fieldName: string): void {
    if (!value) {
      throw new ServiceError(`${fieldName} is required`, 'INVALID_INPUT', 400);
    }
  }
}

export { ServiceError };