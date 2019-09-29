export declare type IFinishCallback = (finish: Function) => void;
export interface IOption {
    /** 执行超时回调函数 */
    abort?: Function;
    /** 执行超时事件 */
    abortTime?: number;
    /** 接口调用成功的回调函数 */
    success: IFinishCallback;
}
