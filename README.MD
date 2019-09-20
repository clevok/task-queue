## 任务队列
不同于消息队列
用于实现类似js单线程业务
通过finish来四方线程

可以通过
```js

const eventLoop = new EventLoop(1);
export const callbackQueue = new CallbackQueue(15);

callbackQueue.addEventListener(eventLoop);
eventLoop.addEventListener(callbackQueue);

const eventLoop2 = new EventLoop(1, 1);

eventLoop2.addEventListener(callbackQueue);
callbackQueue.addEventListener(eventLoop2);

```

其中一个eventLoop2是1秒过期, 对了， callbackQueue 工具你绑定的先后来选择进入容器
多消费者, 多生产者的概念在这里没有实际的用处, 因为用法的原因 


可以顶一个两个 callbackQueue 设置不同的超时时间, 绑定一个相同的容器