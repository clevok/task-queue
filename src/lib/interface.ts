export type IFinishCallback = (
    /**您需主动调用finish方法以表示该任务结束 */
    finish: Function
) => void;

export interface IOption {
    /** 
     * 执行超时回调函数
     * @param {manual|auto} type - 抛出类型, manual用户主动抛出, auto超时自动抛出
     */
    abort?: (type: 'manual' | 'auto') => any

    /** 执行超时事件 */
    abortTime?: number
    
    /** 接口调用成功的回调函数 */
    success: IFinishCallback

}