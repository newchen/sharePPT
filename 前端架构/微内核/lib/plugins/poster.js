import Player from '../core/player.js'
import { createDom } from '../utils/utils.js'

// 播放器封面插件
function poster() {
  let player = this;
  let poster = createDom('div', { className: 'tf-poster'});
  let root = player.root

  if (player.config.poster) {
    poster.style.backgroundImage = `url(${player.config.poster})`
    root.appendChild(poster)
  }

  // 监听播放事件，播放时隐藏封面图
  function playFunc () {
    poster.style.display = 'none'
  }
  player.on('play', playFunc)

  // 监听销毁事件，执行清理操作
  function destroyFunc () {
    player.off('play', playFunc)
    player.off('destroy', destroyFunc)
  }
  player.once('destroy', destroyFunc) // 监听销毁事件
}

// 注册插件
Player.install('poster', poster)


