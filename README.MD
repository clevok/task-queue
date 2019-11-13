## 任务队列
让任务排队执行


### 快速使用
```js
// 默认对外导出一个没有上限的任务池,每次执行一个,超时事件15秒
import TaskQueue from '@clevok/task-queue';
TaskQueue.push((finsh) => {
    console.log('执行1');
    setTimeout(finsh, 500);
})
TaskQueue.push((finsh) => {
    console.log('执行2');
    finsh();
});

// 案例2
import {Queue, Loop} from '@clevok/task-queue';
const callbackQueue = new Queue().addEventListener(new Loop(999, 15000));
callbackQueue.push((finsh)=> 
{})
```


### 概念
对外导出两个模块 `EventLoop`, `CallbackQueue`
`EventLoop`是处理事先的模块,相当于消费者
`CallbackQueue`则是运输工

所有的方法提交给运输工人,由运输工人交给不同的消费者


### 运输工人

- 可以设置我能存储多少个任务

```js
// 当超过15个后我将抛弃最前面的(还是抛弃最后的好点?)默认无穷大
const callbackQueue = new Queue(15);
```

### 消费者
吃任务的人,可以设置最多能同时处理几个,以及处理最大事件,超过后将会自动抛弃,回调abort事件
```js
// 注意咯,是毫秒, 下面表示同时处理2个, 处理超时事件是13秒
const eventLoop = new Loop(2, 13000);
// 别忘了在运输工那边注册下
callbackQueue.addEventListener(eventLoop);

```

### 接下来让 运输工 接客了
```js
callbackQueue.push((finsh) => {
    // 执行到我了
    setTimeout(finsh, 1000);
})
callbackQueue.push({
    abort() {
        // 我被取消了
    },
    success(finsh) {
        // 执行到我了
        finsh();
    },
    // 单独执行超时事件
    abortTime: 15000
})

```

### 运输工和消费者任意搭配
多个运输工可以公用一个消费者, 不同的运输共控制了不同的能缓存的最大事件 (消费者每次会先问最先和他绑定的运输工问他有任务吗)
一个运输工可以和多个消费者搭配, 不同的消费者控制了不同的缓存事件 (运输工也会最优待最先来的);

### 不完善的地方
暂不支持告诉运输工把这个任务给哪个消费者
运输工和消费者多个搭配, 目前是每次都先询问最先绑定的人, 之后可以`雨露均沾`
暂时没有写中间我不要了,临时剔除我的某个任务