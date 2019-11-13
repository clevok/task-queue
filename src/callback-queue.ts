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
    
    /** 缓存队列 */
    private cache: IOption[] = [];

    /**
     * 任务池
     * @param {number} [MAX_LINE=Infinity] - 设置缓存任务条数,默认无穷大,超过后将移除最前面的
     */
    constructor (MAX_LINE: number = Infinity) {
        super();
        this.MAX_LINE = MAX_LINE;
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
        eventLoop._addEventListener(this);
        return this;
    }

    /**
     * 添加任务, 已经执行的无法手动抛弃
     * @return {{abort:Function}} 移除刚刚添加进去的
     */
    push (handle: IOption | IFinishCallback) {

        /** 当超过队列的时候, 将移除第一个 */
        if (this.cache.length >= this.MAX_LINE) {
            this.cache.shift();
        }
        
        if (typeof handle === 'function') {
            handle = {
                success: handle
            }
        }
        this.cache.push(handle);
        this.emit('push');

        return {
            /** 抛出,当还在队列中其效 */
            abort: () => {
                let _handle = handle as IOption;
                let index = this.cache.indexOf(_handle);
                if (index !== -1) {
                    this.cache.splice(index, 1);
                    _handle.abort && _handle.abort('manual');
                }
            }
        }
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