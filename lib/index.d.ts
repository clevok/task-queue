import CallbackQueue from './callback-queue';
import EventLoop from './event-loop';
export default class Index {
    /** 任务池 */
    static CallbackQueue: typeof CallbackQueue;
    /** 事件处理中心 */
    static EventLoop: typeof EventLoop;
}
export declare const Queue: typeof CallbackQueue;
export declare const Loop: typeof EventLoop;
