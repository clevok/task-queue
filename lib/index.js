"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var callback_queue_1 = require("./callback-queue");
var event_loop_1 = require("./event-loop");
var Index = /** @class */ (function () {
    function Index() {
    }
    /** 任务池 */
    Index.CallbackQueue = callback_queue_1.default;
    /** 事件处理中心 */
    Index.EventLoop = event_loop_1.default;
    return Index;
}());
exports.default = Index;
exports.Queue = callback_queue_1.default;
exports.Loop = event_loop_1.default;
