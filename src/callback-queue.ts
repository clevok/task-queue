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
    private MAX_LINE: number;

    /** 执行超时时间,指执行后的超时时间 */
    private ABORT_TIME: number;
    
    /** 缓存队列 */
    private cache: IOption[] = [];

    /**
     * 任务池
     * @param {number} [MAX_LINE=Infinity] 设置缓存任务条数,默认无穷大
     * @param {number} [ABORT_TIME=15000] 设置执行超时时间,默认15秒
     */
    constructor (MAX_LINE: number = Infinity, ABORT_TIME: number = 15000) {
        super();
        this.MAX_LINE = MAX_LINE;
        this.ABORT_TIME = ABORT_TIME;
    }

    /**
     * 绑定 跑道, 监听跑道的task需求
     * @param eventLoop 事件循环对象
     */
    addEventListener (eventLoop: EventLoop) {

        /** 
         * 消费者, 传来需求
         */
        eventLoop.on('task', () => {
            if (!eventLoop.hasTask()) return;
            let handle = this.get();
            handle && eventLoop.push(handle);
        });
    }

    /**
     * 添加任务
     */
    push (handle: IOption | IFinishCallback): void {

        /** 当超过队列的时候, 将移除第一个 */
        if (this.cache.length >= this.MAX_LINE) {
            this.cache.shift();
        }

        if (typeof handle === 'function') {
            handle = {
                success: handle
            }
        }
        if (!handle.abortTime) {
            handle.abortTime = this.ABORT_TIME;
        }
        this.cache.push(handle);
        this.emit('push');
    }

    /**
     * 拉取任务
     */
    get () {
        if (this.cache.length) {
            return this.cache.shift();
        }
        return null;
    }
}