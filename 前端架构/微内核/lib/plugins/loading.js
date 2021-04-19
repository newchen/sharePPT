import Player from '../core/player.js'
import { createDom } from '../utils/utils.js'

let loading = function () {
  let player = this; 
  let container = createDom('div', { className: 'tfplayer-loading', html: '加载中...' })

  player.on('start', () => {
    container.remove()
  })
  player.root.appendChild(container)
}

Player.install('loading', loading)