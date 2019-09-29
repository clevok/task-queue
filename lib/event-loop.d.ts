/**
 * 事件循环 主线程
 */
import { Message } from '@clevok/message';
import { IOption } from './lib/interface';
import CallbackQueue from './callback-queue';
/**
 * 事件处理中心
 * 对外事件 task 我需要资源
 */
export default class EventLoop extends Message {
    /** 最大跑道, 允许同时执行多少个任务 */
    private MAX_LINE;
    /** 执行超时时间 */
    private ABORT_TIME;
    /** 执行中的队列 */
    private RUN_LINE;
    /**
     * 事件处理中心
     * @param {number} [MAX_LINE=1] 设置最大同时执行多少个任务,默认1
     * @param {number} [ABORT_TIME=15000] 设置执行超时时间,默认15秒
     */
    constructor(MAX_LINE?: number, ABORT_TIME?: number);
    /**
     * 绑定生产者来资源的事件
     * 要求生产者发出put事件, 表示有新资源
     *
     * @param {object} event 生产者
     */
    addEventListener(callbackQueue: CallbackQueue): void;
    /**
     * 塞入事件
     * @param handle
     */
    push(handle: IOption): void;
    /**
     * 完成事件
     */
    finish(): void;
    /**
     * 抛弃事件
     */
    abort(): void;
    /**
     * 主动触发该事件, 如果队列需要任务的话, 会触发 task 事件
     */
    task(): void;
    /**
     * 是否可写入
     */
    hasTask(): boolean;
}
