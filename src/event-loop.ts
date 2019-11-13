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
    private MAX_LINE: number;

    /** 执行超时时间 */
    private ABORT_TIME: number;
    
    /** 执行中的队列 */
    private RUN_LINE: number = 0;

    /**
     * 事件处理中心
     * @param {number} [MAX_LINE=1] 设置最大同时执行多少个任务,默认1
     * @param {number} [ABORT_TIME=15000] 设置执行超时时间,默认15秒
     */
    constructor (MAX_LINE: number = 1, ABORT_TIME: number = 15000) {
        super();
        this.MAX_LINE = MAX_LINE;
        this.ABORT_TIME = ABORT_TIME;
    }

    /**
     * 此方法由callback-queue自动绑定调用,开发者请勿调用
     * 绑定生产者来资源的事件
     * 要求生产者发出put事件, 表示有新资源
     * @param {object} event 生产者
     */
    _addEventListener (callbackQueue: CallbackQueue) {

        /** 
         * 生产者push事件, 表示生产者来东西了
         */
        callbackQueue.on('push', () => {
            if (!this.hasTask()) return;
            let handle = callbackQueue.get();
            handle && this.push(handle);
        });
    }

    /**
     * 塞入事件
     * @param handle 
     */
    push (handle: IOption) {
        ++this.RUN_LINE;

        let isFinshed = false;
        let timeout = 0;

        handle.success(() => {
            !isFinshed && this.finish();
            
            isFinshed = true;
            timeout && clearTimeout(timeout);
        });

        timeout = setTimeout(() => {
            handle.abort && handle.abort('auto');
            !isFinshed && this.abort();

            isFinshed = true;
            timeout = 0;
        }, handle.abortTime || this.ABORT_TIME);
    }

    /**
     * 完成事件
     */
    finish () {
        this.RUN_LINE > 0 && --this.RUN_LINE;
        this.task();
    }

    /**
     * 抛弃事件
     */
    abort () {
        this.RUN_LINE > 0 && --this.RUN_LINE;
        this.task();
    }

    /**
     * 主动触发该事件, 如果队列需要任务的话, 会触发 task 事件
     */
    task () {
        if (this.RUN_LINE < this.MAX_LINE) {
            this.emit('task');
        }
    }

    /**
     * 是否可写入
     */
    hasTask () {
        return this.RUN_LINE < this.MAX_LINE;
    }
}