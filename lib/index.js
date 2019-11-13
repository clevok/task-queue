"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var callback_queue_1 = require("./callback-queue");
var event_loop_1 = require("./event-loop");
exports.Queue = callback_queue_1.default;
exports.Loop = event_loop_1.default;
/**
 * 默认对外导出一个没有上限的任务池,每次执行一个,超时事件15秒
 */
exports.default = new exports.Queue().addEventListener(new exports.Loop());
