interface IEventHandle {
    
    /** 是否已调用 */
    called: boolean,
    
    /** 是否只调用一次 */
    once: boolean,

    /** 指向方法 */
    handler: Function,
}
interface IEvtObjs {
    [propName: string]: IEventHandle[]
}

export class Message {
    
    /** 缓存对象 */
    private _evtObjs: IEvtObjs;
    
    /** 时间通知 */
    constructor () {
        this._evtObjs = Object.create(null);
    }
    
    /**
     * 监听
     * @param evtType 名称
     * @param handler 执行体
     * @param _once 是否只相应一次
     */
    on (evtType: string, handler: Function, once:boolean = false) {
        if (!this._evtObjs[evtType]) {
            this._evtObjs[evtType] = [];
        }
        this._evtObjs[evtType].push({
            handler,
            once,
            called: false
        });
        return () => {
            this.off(evtType, handler);
        };
    }

    /**
     * 移除
     * @param evtType 名称
     * @param handler 执行体
     */
    off (evtType?: string, handler?: Function) {
        var types;
        if (evtType) {
            types = [evtType];
        } else {
            types = Object.keys(this._evtObjs);
        }
        types.forEach((type) => {
            if (!handler) {
                // remove all
                this._evtObjs[type] = [];
            } else {
                var handlers = this._evtObjs[type] || [];
                var nextHandlers: IEventHandle[] = [];

                handlers.forEach((evtObj) => {
                    if (evtObj.handler !== handler) {
                        nextHandlers.push(evtObj);
                    }
                });
                this._evtObjs[type] = nextHandlers;
            }
        });

        return this;
    }

    /**
     * 响应
     * @param evtType 
     */
    emit (evtType: string, ...args: any[]) {
        
        var handlers = this._evtObjs[evtType] || [];
        handlers.forEach((evtObj) => {
            this.call(evtObj, args);
        });
    }

    /**
     * 响应第一个
     * @param evtType 
     * @param args 
     */
    emitFirst (evtType: string, ...args: any[]) {
        var handlers = this._evtObjs[evtType] || [];
        this.call(handlers[0], args);
    }

    call (evtObj: IEventHandle, args: any[]) {
        if (!evtObj) return;
        if (evtObj.once && evtObj.called) return;
        evtObj.called = true;
        try {
            evtObj.handler && evtObj.handler.apply(null, args);
        } catch(e) {
            console.error(e.stack || e.message || e);
        }
    }

}

export default new Message();