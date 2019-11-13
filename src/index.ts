import CallbackQueue from './callback-queue';
import EventLoop from './event-loop';

export const Queue = CallbackQueue;
export const Loop = EventLoop;

/**
 * 默认对外导出一个没有上限的任务池,每次执行一个,超时事件15秒
 */
export default new Queue().addEventListener(new Loop());