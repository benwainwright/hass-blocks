import { mock } from 'vitest-mock-extended';
import { when } from 'vitest-when';
import { v4 } from 'uuid';

import type { IHass } from '@types';
import type { EventBus, Block } from '@core';

import { BlockExecutionMode, Executor } from './executor.ts';

vi.mock('uuid');

afterEach(() => {
  vi.resetAllMocks();
});

describe('executor', () => {
  it('emits all the correct messages when blocks are executed', async () => {
    const actionOne = mock<Block<string, string>>({
      name: 'foo',
      typeString: 'action',
      toJson: () => ({ type: 'action', id: 'foo', name: 'foo' }),
    });
    const actionTwo = mock<Block<string, string>>({
      name: 'bar',
      typeString: 'action',
      toJson: () => ({ type: 'action', id: 'bar', name: 'bar' }),
    });
    const actionThree = mock<Block<string, string>>({
      name: 'baz',
      typeString: 'action',
      toJson: () => ({ type: 'action', id: 'baz', name: 'baz' }),
    });

    const mockClient = mock<IHass>();
    const events = mock<EventBus>();
    const triggerId = 'trigger-id';
    const input = 'foo';

    when(actionOne.run)
      .calledWith(mockClient, input, events, triggerId)
      .thenResolve({
        continue: true,
        outputType: 'block',
        output: 'bar',
      });

    when(actionTwo.run)
      .calledWith(mockClient, 'bar', events, triggerId)
      .thenResolve({
        continue: true,
        outputType: 'block',
        output: 'baz',
      });

    when(actionThree.run)
      .calledWith(mockClient, 'baz', events, triggerId)
      .thenResolve({
        continue: true,
        outputType: 'block',
        output: 'bif',
      });

    const actions = [actionOne, actionTwo, actionThree] as const;

    type V4StringFn = (
      options?: Parameters<typeof v4>[0],
      buf?: undefined,
      offset?: number,
    ) => string;
    const v4Mocked = v4 as unknown as V4StringFn;

    vi.mocked(v4Mocked)

      .mockReturnValueOnce('one')
      .mockReturnValueOnce('two')
      .mockReturnValueOnce('three');

    const executor = new Executor(
      [...actions],
      mockClient,
      events,
      triggerId,
      input,
      BlockExecutionMode.Sequence,
    );

    void executor.run();

    const calls = events.emit.mock.calls;

    expect(calls[0]).toEqual([
      'block-pending',
      {
        executeId: 'one',
        triggerId,
        type: 'action',
        name: 'foo',
        block: { type: 'action', id: 'foo', name: 'foo' },
        triggeredBy: undefined,
        parent: undefined,
      },
    ]);

    expect(calls[2]).toEqual([
      'block-pending',
      {
        executeId: 'two',
        triggerId,
        type: 'action',
        name: 'bar',
        block: { type: 'action', id: 'bar', name: 'bar' },
        triggeredBy: undefined,
        parent: undefined,
      },
    ]);

    expect(calls[4]).toEqual([
      'block-pending',
      {
        executeId: 'three',
        triggerId,
        type: 'action',
        name: 'baz',
        block: { type: 'action', id: 'baz', name: 'baz' },
        triggeredBy: undefined,
        parent: undefined,
      },
    ]);

    await executor.finished();

    expect(calls[6]).toEqual([
      'block-started',
      {
        executeId: 'one',
        triggerId,
        type: 'action',
        name: 'foo',
        block: { type: 'action', id: 'foo', name: 'foo' },
        triggeredBy: undefined,
        parent: undefined,
      },
    ]);

    expect(calls[8]).toEqual([
      'block-finished',
      {
        executeId: 'one',
        triggerId,
        type: 'action',
        name: 'foo',
        block: { type: 'action', id: 'foo', name: 'foo' },
        triggeredBy: undefined,
        parent: undefined,
        continue: true,
        outputType: 'block',
        output: {
          continue: true,
          outputType: 'block',
          output: 'bar',
        },
      },
    ]);

    expect(calls[10]).toEqual([
      'block-started',
      {
        executeId: 'two',
        triggerId,
        type: 'action',
        name: 'bar',
        block: { type: 'action', id: 'bar', name: 'bar' },
        triggeredBy: undefined,
        parent: undefined,
      },
    ]);

    expect(calls[12]).toEqual([
      'block-finished',
      {
        executeId: 'two',
        triggerId,
        type: 'action',
        name: 'bar',
        block: { type: 'action', id: 'bar', name: 'bar' },
        triggeredBy: undefined,
        parent: undefined,
        continue: true,
        outputType: 'block',
        output: {
          continue: true,
          outputType: 'block',
          output: 'baz',
        },
      },
    ]);

    expect(calls[14]).toEqual([
      'block-started',
      {
        executeId: 'three',
        triggerId,
        type: 'action',
        name: 'baz',
        block: { type: 'action', id: 'baz', name: 'baz' },
        triggeredBy: undefined,
        parent: undefined,
      },
    ]);

    expect(calls[16]).toEqual([
      'block-finished',
      {
        executeId: 'three',
        triggerId,
        type: 'action',
        name: 'baz',
        block: { type: 'action', id: 'baz', name: 'baz' },
        triggeredBy: undefined,
        parent: undefined,
        continue: true,
        outputType: 'block',
        output: {
          continue: true,
          outputType: 'block',
          output: 'bif',
        },
      },
    ]);
  });

  it('runs all the blocks and feeds inputs through to outputs', async () => {
    const actionOne = mock<Block<string, string>>();
    const actionTwo = mock<Block<string, string>>();
    const actionThree = mock<Block<string, string>>();

    const mockClient = mock<IHass>();
    const events = mock<EventBus>();
    const triggerId = 'trigger-id';
    const input = 'foo';

    when(actionOne.run)
      .calledWith(mockClient, input, events, triggerId)
      .thenResolve({
        continue: true,
        outputType: 'block',
        output: 'bar',
      });

    when(actionTwo.run)
      .calledWith(mockClient, 'bar', events, triggerId)
      .thenResolve({
        continue: true,
        outputType: 'block',
        output: 'baz',
      });

    when(actionThree.run)
      .calledWith(mockClient, 'baz', events, triggerId)
      .thenResolve({
        continue: true,
        outputType: 'block',
        output: 'bif',
      });

    const actions = [actionOne, actionTwo, actionThree] as const;

    const executor = new Executor(
      [...actions],
      mockClient,
      events,
      triggerId,
      input,
      BlockExecutionMode.Sequence,
    );

    void executor.run();

    const [result] = await executor.finished();

    expect(result?.continue).toEqual(true);
    if (result?.continue) {
      expect(result.outputType).toEqual('block');
      expect(result.continue).toEqual(true);
      expect(result.success).toEqual(true);
      expect(result.output).toEqual('bif');
    }
  });
});
