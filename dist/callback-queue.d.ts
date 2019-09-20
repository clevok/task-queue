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
    /** 执行超时时间,指执行后的超时时间 */
    private ABORT_TIME;
    /** 缓存队列 */
    private cache;
    /**
     * 任务池
     * @param {number} [MAX_LINE=Infinity] 设置缓存任务条数,默认无穷大
     * @param {number} [ABORT_TIME=15000] 设置执行超时时间,默认15秒
     */
    constructor(MAX_LINE?: number, ABORT_TIME?: number);
    /**
     * 绑定 跑道, 监听跑道的task需求
     * @param eventLoop 事件循环对象
     */
    addEventListener(eventLoop: EventLoop): void;
    /**
     * 添加任务
     */
    push(handle: IOption | IFinishCallback): void;
    /**
     * 拉取任务
     */
    get(): IOption | null | undefined;
}
