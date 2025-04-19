import { Command } from './command.ts';

/**
 * @public
 */
export interface CallServiceCommand extends Command {
  /**
   * Type of command on the Websocket API
   */
  type: 'call_service';

  /**
   * Service domain (e.g. 'light')
   */
  domain: string;

  /**
   * Service action (e.g. 'turn_on')
   */
  service: string;

  /**
   * Optional service data
   *
   * @example
   * service_data: \{
   *  color_name: "beige",
   *  brightness: "101"
   * \}
   */
  service_data?: Record<string, unknown>;

  /**
   * What entity is the service targeting
   */
  target?: {
    entity_id?: string | string[];
    area_id?: string | string[];
    device_id?: string | string[];
  };

  /**
   * Not optional for service actions that return response data
   */
  return_response?: boolean;
}
