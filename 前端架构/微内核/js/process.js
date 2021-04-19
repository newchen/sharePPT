import Player from '../lib/index.js'

// 播放进度插件
function process() {
  let player = this
  let process = 0
  let innerHTML = `当前进度: ${process}`
  let dom = Player.utils.createDom('div', { html: innerHTML })

  player.on('timeupdate', function() {
    // currentTime：设置或返回音频/视频中的当前播放位置（以秒计）
    // duration：返回当前音频/视频的长度（以秒计）
    let scale = player.currentTime / player.duration;//百分比
    process = isNaN(scale) ? 0 : (scale * 100).toFixed(2) + '%'
    dom.innerHTML = `当前进度: ${process}`

    if (player.ended) {//视频播放是否已经结束
      dom.innerHTML = '播放结束'
    }
  });

  document.body.appendChild(dom)
}

// 注册插件
Player.install('process', process)