## API Report File for "@hass-blocks/blocks"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { CallServiceCommand } from '@hass-blocks/homeassistant-typescript';
import { Event as Event_2 } from '@hass-blocks/homeassistant-typescript';
import { HassConfig } from '@hass-blocks/homeassistant-typescript';
import { State } from '@hass-blocks/homeassistant-typescript';

// @public
export const action: <I = void, O = void>(config: ActionArgs<I, O>) => Block<I, O>;

// @public
export interface ActionArgs<I = void, O = void> extends BaseBlockConfig {
    callback: ((client: IBlocksClient, input: I) => O) | ((client: IBlocksClient, input: I) => Promise<O>);
}

// @public
export const assertion: <I = void, O = void>(config: AssertionConfig<I, O>) => Block<I, O>;

// @public
export const automation: <const A extends readonly any[], I = GetSequenceInput<A>, O = GetSequenceOutput<A>>(config: {
    name: string;
    id?: string;
    then: BlockRetainType<A> & A & ValidInputOutputSequence<I, O, A>;
    when?: ITrigger | ITrigger[];
    mode?: ExecutionMode;
}) => Block<I, O>;

// @public
export interface BaseBlockConfig {
    readonly id?: string;
    readonly name: string;
}

// @public (undocumented)
export interface BlocksConnection {
    // (undocumented)
    registry: IBlocksRegistry;
}

// @public (undocumented)
export interface CallServiceParams {
    // (undocumented)
    data?: Record<string, unknown>;
    // (undocumented)
    domain: string;
    // (undocumented)
    service: string;
    // (undocumented)
    target?: {
        entity_id?: string | string[];
        area_id?: string | string[];
        device_id?: string | string[];
    };
}

// @public (undocumented)
export const concurrently: <A extends readonly Block<unknown, unknown>[], I = void, O = void>(actions: A) => Block<I, O>;

// @public (undocumented)
export type HassBlocksEvent = AutomationRegistered | GeneralFailure | StateChanged | BlockFailed | BlockFinished | BlockPending | BlockStarted | SequenceAborted;

// @public (undocumented)
export interface IBlock<I = void, O = void> {
    // (undocumented)
    id: string;
    // (undocumented)
    inputType: I | undefined;
    // (undocumented)
    name: string;
    // (undocumented)
    outputType: O | undefined;
    // (undocumented)
    run: (client: IBlocksClient, input: I, events?: IEventBus, triggerId?: string) => Promise<BlockOutput<O>> | BlockOutput<O>;
    // (undocumented)
    toJson(): SerialisedBlock;
    // (undocumented)
    typeString: string;
    // (undocumented)
    validate: (client: IBlocksClient) => Promise<void>;
}

// @public (undocumented)
export interface IBlocksClient {
    // (undocumented)
    callService: (params: CallServiceParams) => Promise<State[]>;
    // (undocumented)
    getAutomations: () => IBlock<unknown, unknown>[];
    // (undocumented)
    getEntity: (id: string) => HassEntity;
    // (undocumented)
    getState: (id: string) => string;
    // (undocumented)
    loadStates: () => Promise<void>;
    // (undocumented)
    registerTrigger: (trigger: Record<string, unknown>, callback: (event: unknown) => void | Promise<void>) => Promise<void>;
}

// @public (undocumented)
export interface IBlocksPlugin {
    // (undocumented)
    load: (args: PluginArgs) => Promise<void>;
    // (undocumented)
    readonly name: string;
}

// @public (undocumented)
export interface IEventBus {
    // (undocumented)
    emit: (event: HassBlocksEvent) => void;
    // (undocumented)
    subscribe: (callback: (event: HassBlocksEvent & {
        id: string;
        timestamp: string;
    }) => void) => void;
}

// @public
export const initialiseBlocks: (args?: BlocksConfig) => Promise<BlocksConnection>;

// @public (undocumented)
export const sequence: <const A extends readonly any[], I = GetSequenceInput<A>, O = GetSequenceOutput<A>>(actions: BlockRetainType<A> & A & ValidInputOutputSequence<I, O, A>, mode?: ExecutionMode) => Block<I, O>;

// @public (undocumented)
export const serviceCall: (serviceConfig: {
    name: string;
    params: Omit<CallServiceCommand, "id" | "type">;
}) => Block;

// @public (undocumented)
export const trigger: (config: TriggerProps) => ITrigger;

// @public (undocumented)
export const when: <TO = void, EO = void, PO = void, I = void>(config: IfThenElseConditionConfig<TO, EO, PO, I>) => Block<I, TO | EO>;

// (No @packageDocumentation comment for this package)

```
