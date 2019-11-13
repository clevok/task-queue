"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事件循环 主线程
 */
var message_1 = require("@clevok/message");
/**
 * 任务池
 * 对外事件push 有新资源
 */
var CallbackQueue = /** @class */ (function (_super) {
    __extends(CallbackQueue, _super);
    /**
     * 任务池
     * @param {number} [MAX_LINE=Infinity] - 设置缓存任务条数,默认无穷大,超过后将移除最前面的
     */
    function CallbackQueue(MAX_LINE) {
        if (MAX_LINE === void 0) { MAX_LINE = Infinity; }
        var _this = _super.call(this) || this;
        /** 缓存队列 */
        _this.cache = [];
        _this.MAX_LINE = MAX_LINE;
        return _this;
    }
    /**
     * 绑定 跑道, 监听跑道的task需求
     * @param eventLoop 事件循环对象
     */
    CallbackQueue.prototype.addEventListener = function (eventLoop) {
        var _this = this;
        /**
         * 消费者, 传来需求
         */
        eventLoop.on('task', function () {
            if (!eventLoop.hasTask())
                return;
            var handle = _this.get();
            handle && eventLoop.push(handle);
        });
        eventLoop._addEventListener(this);
        return this;
    };
    /**
     * 添加任务, 已经执行的无法手动抛弃
     * @return {{abort:Function}} 移除刚刚添加进去的
     */
    CallbackQueue.prototype.push = function (handle) {
        var _this = this;
        /** 当超过队列的时候, 将移除第一个 */
        if (this.cache.length >= this.MAX_LINE) {
            this.cache.shift();
        }
        if (typeof handle === 'function') {
            handle = {
                success: handle
            };
        }
        this.cache.push(handle);
        this.emit('push');
        return {
            /** 抛出,当还在队列中其效 */
            abort: function () {
                var _handle = handle;
                var index = _this.cache.indexOf(_handle);
                if (index !== -1) {
                    _this.cache.splice(index, 1);
                    _handle.abort && _handle.abort('manual');
                }
            }
        };
    };
    /**
     * 拉取任务
     */
    CallbackQueue.prototype.get = function () {
        if (this.cache.length) {
            return this.cache.shift();
        }
        return null;
    };
    return CallbackQueue;
}(message_1.Message));
exports.default = CallbackQueue;
