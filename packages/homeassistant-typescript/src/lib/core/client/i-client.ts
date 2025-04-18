import {
  Config,
  Event,
  Panel,
  State,
  CalendarDetails,
  ServiceDomainDetails,
  LogBookEntry,
  EventDetails,
  HassArea,
  HassEntity,
  HassDevice,
  Service,
} from '../../types/index.ts';

import { GetHistoryParams } from './get-history-params.ts';
import { GetLogbookParams } from './get-logbook-params.ts';

import {
  CallServiceCommand,
  TriggerEventMessage,
  SubscribeToTriggerMessage,
} from '../websocket-client/index.ts';

/**
 * The Home Assistant client API. Once initialised, the client will make requests via
 * **either** the websocket or HTTP API where appropriate
 *
 * @public
 */
export interface IClient {
  /**
   * Returns an array of state changes from the past
   */
  getHistory(params: GetHistoryParams): Promise<State[][]>;

  /**
   * Gets a list of areas registered with home assistant
   */
  getAreas(): Promise<HassArea[]>;

  /**
   * Gets a list of entries from the Home Assistant logbook
   *
   * @param params - params to filter the results
   */
  getLogbook(params?: GetLogbookParams): Promise<LogBookEntry[]>;

  /**
   * Get a list of all entities currently registered by home assistant
   */
  getEntities(): Promise<HassEntity[]>;

  /**
   * Get a list of all devices currently registered by home assistant
   */
  getDevices(): Promise<HassDevice[]>;

  /**
   * Get a list of the current states of all entities
   */
  getStates(): Promise<State[]>;

  /**
   * Get the current state of a specific entity
   *
   * @param entityId - The entity id in the form <domain>.<id>
   */
  getState(entityId: string): Promise<State>;

  /**
   * Call a service action
   *
   * See {@link https://developers.home-assistant.io/docs/api/websocket/#calling-a-service-action}
   *
   * @param params - parameters to send with the service command
   */
  callService(
    params: Omit<CallServiceCommand, 'id' | 'type'>,
  ): Promise<State[]>;

  /**
   * Get the current Home Assistant configuration
   */
  getConfig(): Promise<Config>;

  /**
   * Get details of all the services currently registered in home assistant, grouped by domain
   */
  getServices(): Promise<Record<string, Service>>;

  /**
   * Get a list of
   */
  getServiceDomains(): Promise<ServiceDomainDetails[]>;

  getPanels(): Promise<Record<string, Panel>>;

  getCalendars(): Promise<CalendarDetails>;

  getEvents(): Promise<EventDetails[]>;

  getErrorLog(): Promise<string>;

  /**
   * Subscribe to a trigger. See https://developers.home-assistant.io/docs/api/websocket/#subscribe-to-trigger
   */
  registerTrigger(
    trigger: SubscribeToTriggerMessage['trigger'],
    callback: (event: unknown) => void | Promise<void>,
  ): Promise<void>;

  subscribeToEvents(
    callback: (message: Event | TriggerEventMessage['event']) => void,
  ): Promise<void>;

  subscribeToEvents(
    type: string,
    callback: (message: Event | TriggerEventMessage['event']) => void,
  ): Promise<void>;

  close(): Promise<void>;
}
