/**
 * 事件循环 主线程
 */
import { Message } from '@clevok/message';
import { IOption, IFinishCallback } from './lib/interface';
import EventLoop from './event-loop';
/**
 * 任务池
 * 对外事件push 有新资源
 */
export default class CallbackQueue extends Message {
    /** 最大队列, 表示无穷队列 */
    private MAX_LINE;
    /** 缓存队列 */
    private cache;
    /**
     * 任务池
     * @param {number} [MAX_LINE=Infinity] - 设置缓存任务条数,默认无穷大,超过后将移除最前面的
     */
    constructor(MAX_LINE?: number);
    /**
     * 绑定 跑道, 监听跑道的task需求
     * @param eventLoop 事件循环对象
     */
    addEventListener(eventLoop: EventLoop): this;
    /**
     * 添加任务, 已经执行的无法手动抛弃
     * @return {{abort:Function}} 移除刚刚添加进去的
     */
    push(handle: IOption | IFinishCallback): {
        /** 抛出,当还在队列中其效 */
        abort: () => void;
    };
    /**
     * 拉取任务
     */
    get(): IOption | null | undefined;
}
