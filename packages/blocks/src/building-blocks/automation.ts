import {
  Executor,
  BlockExecutionMode,
  RunQueue,
  Block,
} from '../core/index.ts';

import {
  GetSequenceInput,
  GetSequenceOutput,
  BlockRetainType,
  ValidInputOutputSequence,
} from './valid-input-output-sequence.ts';

import {
  IEventBus,
  BlockOutput,
  ILegoClient,
  ExecutionMode,
  ITrigger,
} from '../types/index.ts';

import { ExecutionAbortedError } from '../errors/index.ts';
import { md5 } from '../utils/index.ts';

export class Automation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const A extends readonly any[],
  I = GetSequenceInput<A>,
  O = GetSequenceOutput<A>,
> extends Block<I, O> {
  public readonly name: string;

  private runQueue = new RunQueue();

  public constructor(
    public config: {
      name: string;
      id?: string;
      then: BlockRetainType<A> & A & ValidInputOutputSequence<I, O, A>;
      when?: ITrigger | ITrigger[];
      mode?: ExecutionMode;
    },
  ) {
    super(config.id ?? md5(config.name), [...config.then]);
    this.name = this.config.name;
  }

  public override typeString = 'automation';

  public override async run(
    client: ILegoClient,
    input?: I,
    events?: IEventBus,
    triggerId?: string,
  ): Promise<BlockOutput<O>> {
    if (!events) {
      throw new Error('You must supply an event bus');
    }

    if (!triggerId) {
      throw new Error('You must supply a trigger id');
    }

    try {
      const executor = new Executor<I, O>(
        [...this.config.then],
        client,
        events,
        triggerId,
        input,
        BlockExecutionMode.Sequence,
        this,
      );

      const mode = this.config.mode ?? ExecutionMode.Restart;
      switch (mode) {
        case ExecutionMode.Restart:
          this.runQueue.abortAll();
          this.runQueue.enqueue(executor);
          break;

        case ExecutionMode.Queue:
          this.runQueue.enqueue(executor);
          break;

        case ExecutionMode.Parallel:
          await executor.run();
          break;
      }
      const intResult = await executor.finished();
      const [result] = intResult;

      if (!result) {
        throw new Error(
          "Sequence exector resolved but didn't return anything. This is probably a programming error",
        );
      }
      return result;
    } catch (error) {
      if (error instanceof ExecutionAbortedError) {
        return { continue: false };
      }
      throw error;
    }
  }
}

/**
 * @public
 *
 * An automation represents a sequence of actions that can either be executed in sequence
 * or in parallel. When passed into
 */
export const automation = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const A extends readonly any[],
  I = GetSequenceInput<A>,
  O = GetSequenceOutput<A>,
>(config: {
  name: string;
  id?: string;
  then: BlockRetainType<A> & A & ValidInputOutputSequence<I, O, A>;
  when?: ITrigger | ITrigger[];
  mode?: ExecutionMode;
}): Block<I, O> => {
  return new Automation<A, I, O>(config);
};
