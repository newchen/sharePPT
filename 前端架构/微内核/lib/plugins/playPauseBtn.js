import Player from '../core/player.js'
import { createDom } from '../utils/utils.js'

// 播放/暂停 按钮插件
function playBtn() {
  let player = this;
  let dom = createDom('button', { html: '播放' })

  dom.addEventListener('click', () => {
    if (player.paused) {
      player.play()
    } else{
      player.pause()
    }
  })

  player.on('play', () => {
    dom.innerHTML = '暂停'
  })
  player.on('pause', () => {
    dom.innerHTML = '播放'
  })

  document.body.appendChild(dom)
}

// 注册插件
Player.install('playBtn', playBtn)