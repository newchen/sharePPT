export default class EventEmitter {
  constructor() {
    this.events = { any: [] } 
  }
  // 添加监听
  on(type = 'any', fn) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(fn); // 将订阅方法保存在数组里
  }
  // 移除监听
  off(type = 'any', fn) {
    if (!fn) {
      this.events[type] = null
      this.onceEvents[type] = null
    }
    this.events[type] =
      this.events[type].filter(item => item !== fn)  // 将退订的方法从数组中移除 
  }
  // 触发监听
  emit(type = 'any', ...args) {
    let events = this.events[type]

    if (events) {
      events.forEach(item => item(...args)) // 根据不同的类型调用相应的方法
      this.events[type] = events.filter(item => item.__once !== true) // 过滤掉只执行一次的
    }
  }
  // 能同时注册多次, 但是执行一次后失效
  once(type, fn) {
    fn.__once = true // 添加标识
    this.on(type, fn);
  }
};