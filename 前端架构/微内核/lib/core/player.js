import Proxy from './proxy.js'

export default class Player extends Proxy {
  constructor(options) {
    super(options)
    // 合并配置
    this.config = {
      ignores: [], // 需要忽略哪些插件
      videoInit: true, // 是否立即初始化
      ...options
    }
    // 取得根元素
    this.root = document.querySelector(this.config.id)
    if (!this.root) {
      let el = this.config.el
      if (el && el.nodeType === 1) {
        this.root = el
      } else {
        this.emit('error', new Error('容器id不能为空'))
        return false
      }
    }
    // 在插件执行之前调用
    if(this.config.execBeforePluginsCall) {
      this.config.execBeforePluginsCall.forEach(item => {
        item.call(this, this)
      })
    }
    // 调用插件
    this.pluginsCall()

    // 是否初始化
    if (this.config.videoInit) {
      this.start()
    }

    // 触发自定义ready事件
    setTimeout(() => {
      this.emit('ready')
    }, 0)
  }

  start(src = this.config.src) {
    this.emit('start')

    let root = this.root

    if (!src || src === '') {
      this.emit('urlNull')
    }

    if (typeof(src) === 'string') {
      this.video.src = src
    }

    root.insertBefore(this.video, root.firstChild)
    // 触发自定义complete事件
    setTimeout(() => {
      this.emit('complete')
    }, 1)
  }

  destroy() {
    let parentNode = this.root.parentNode

    // fix video destroy https://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element
    this.video.removeAttribute('src') // empty source
    this.video.load()

    parentNode.removeChild(this.root) // 移除dom元素
    this.emit('destroy') // 触发自定义销毁事件
  }
  
  // 调用插件
  pluginsCall () {
    if (Player.plugins) {
      let ignores = this.config.ignores
      Object.keys(Player.plugins).forEach(name => {
        let descriptor = Player.plugins[name]
        if (!ignores.some(item => name === item)) {
          descriptor.call(this, this)
        }
      })
    }
  }
  // 注册插件
  static install (name, descriptor) {
    if (!Player.plugins) {
      Player.plugins = {}
    }
    Player.plugins[name] = descriptor
  }
}
