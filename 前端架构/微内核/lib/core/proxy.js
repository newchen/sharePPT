import EventEmitter from '../utils/events.js'
import { createDom } from '../utils/utils.js'

export default class Proxy extends EventEmitter {
  constructor (options) {
    super()

    // video标签属性
    this.videoConfig = {
      width: 600,
      height: 337.5,
      autoplay: false,
      controls: false,
      loop: false,
      muted: false,
      ...options
    }

    // 生成video标签
    this.video = createDom('video', { attrs: this.videoConfig })

    /* 
      video事件
      this.ev = [
        { play: 'onPlay' },
        { playing: 'onPlaying' },
        { pause: 'onPause' },
        ...
      }]
    */
    this.ev = ['play', 'playing', 'pause', 'ended', 'error', 'seeking', 'seeked',
      'timeupdate', 'waiting', 'canplay', 'canplaythrough', 'durationchange', 'volumechange', 'loadeddata'
    ].map((item) => {
      return {
        [item]: `on${item.charAt(0).toUpperCase()}${item.slice(1)}`
      }
    })

    // 注册video自带事件, 并对外提供口子
    this.ev.forEach(item => {
      let name = Object.keys(item)[0] // play, pause ...

      this.video.addEventListener(name, () => {
        this.emit(name, this)
      })
    })
  }
  // 对外提供video自带的方法
  play () {
    this.video.play()
  }
  pause () {
    this.video.pause()
  }
  // ...
  
  //对外提供video自带的属性
  get paused () {
    return this.video.paused
  }
  get currentTime() {
    return this.video.currentTime
  }
  get duration() {
    return this.video.duration
  }
  get ended() {
    return this.video.ended
  }
  set autoplay (isTrue) {
    this.video.autoplay = isTrue
  }
  get autoplay () {
    return this.video.autoplay
  }
  get src () {
    return this.video.src
  }
  set src (src) { // 这里并不会直接调用, 而是player使用, 所以也可以使用this.root
    let self = this
    this.emit('srcChange', this)

    this.video.pause()
    this.video.src = src
  }
  // ...
}