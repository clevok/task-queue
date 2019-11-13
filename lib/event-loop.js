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
 * 事件处理中心
 * 对外事件 task 我需要资源
 */
var EventLoop = /** @class */ (function (_super) {
    __extends(EventLoop, _super);
    /**
     * 事件处理中心
     * @param {number} [MAX_LINE=1] 设置最大同时执行多少个任务,默认1
     * @param {number} [ABORT_TIME=15000] 设置执行超时时间,默认15秒
     */
    function EventLoop(MAX_LINE, ABORT_TIME) {
        if (MAX_LINE === void 0) { MAX_LINE = 1; }
        if (ABORT_TIME === void 0) { ABORT_TIME = 15000; }
        var _this = _super.call(this) || this;
        /** 执行中的队列 */
        _this.RUN_LINE = 0;
        _this.MAX_LINE = MAX_LINE;
        _this.ABORT_TIME = ABORT_TIME;
        return _this;
    }
    /**
     * 此方法由callback-queue自动绑定调用,开发者请勿调用
     * 绑定生产者来资源的事件
     * 要求生产者发出put事件, 表示有新资源
     * @param {object} event 生产者
     */
    EventLoop.prototype._addEventListener = function (callbackQueue) {
        var _this = this;
        /**
         * 生产者push事件, 表示生产者来东西了
         */
        callbackQueue.on('push', function () {
            if (!_this.hasTask())
                return;
            var handle = callbackQueue.get();
            handle && _this.push(handle);
        });
    };
    /**
     * 塞入事件
     * @param handle
     */
    EventLoop.prototype.push = function (handle) {
        var _this = this;
        ++this.RUN_LINE;
        var isFinshed = false;
        var timeout = 0;
        handle.success(function () {
            !isFinshed && _this.finish();
            isFinshed = true;
            timeout && clearTimeout(timeout);
        });
        timeout = setTimeout(function () {
            handle.abort && handle.abort('auto');
            !isFinshed && _this.abort();
            isFinshed = true;
            timeout = 0;
        }, handle.abortTime || this.ABORT_TIME);
    };
    /**
     * 完成事件
     */
    EventLoop.prototype.finish = function () {
        this.RUN_LINE > 0 && --this.RUN_LINE;
        this.task();
    };
    /**
     * 抛弃事件
     */
    EventLoop.prototype.abort = function () {
        this.RUN_LINE > 0 && --this.RUN_LINE;
        this.task();
    };
    /**
     * 主动触发该事件, 如果队列需要任务的话, 会触发 task 事件
     */
    EventLoop.prototype.task = function () {
        if (this.RUN_LINE < this.MAX_LINE) {
            this.emit('task');
        }
    };
    /**
     * 是否可写入
     */
    EventLoop.prototype.hasTask = function () {
        return this.RUN_LINE < this.MAX_LINE;
    };
    return EventLoop;
}(message_1.Message));
exports.default = EventLoop;
