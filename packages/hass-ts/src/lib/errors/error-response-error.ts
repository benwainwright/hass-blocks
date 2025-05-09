import { HassTsError } from './hass-ts-error.ts';

export class ErrorResponseError extends HassTsError {
  constructor(
    public readonly code: string,
    public readonly originalMessage: string,
    message: string,
  ) {
    super(message);
  }
}
