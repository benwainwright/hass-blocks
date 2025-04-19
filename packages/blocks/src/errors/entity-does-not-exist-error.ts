import { HassLegoError } from './hass-lego-error.ts';

/**
 * @public
 */
export class EntityDoesNotExistError extends HassLegoError {
  public constructor(id: string) {
    super(`Entity '${id}' does not exist`);
  }
}
