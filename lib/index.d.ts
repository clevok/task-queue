import CallbackQueue from './callback-queue';
import EventLoop from './event-loop';
export declare const Queue: typeof CallbackQueue;
export declare const Loop: typeof EventLoop;
declare const _default: CallbackQueue;
/**
 * 默认对外导出一个没有上限的任务池,每次执行一个,超时事件15秒
 */
export default _default;
