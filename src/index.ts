import CallbackQueue from './callback-queue';
import EventLoop from './event-loop';

export default class Index {

    /** 任务池 */
    static CallbackQueue = CallbackQueue;
    
    /** 事件处理中心 */
    static EventLoop = EventLoop;
}

export const Queue = CallbackQueue;
export const Loop = EventLoop;