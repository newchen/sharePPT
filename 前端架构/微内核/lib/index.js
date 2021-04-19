// 源码: https://github.com/bytedance/xgplayer

import Player from './core/player.js'
import * as utils from './utils/utils.js'

// 插件
import './plugins/playPauseBtn.js'
import './plugins/poster.js'
import './plugins/loading.js'

Player.utils = utils
export default Player