import Player from "../lib/index.js"
import './process.js' // 假设这是自定义插件

let player = new Player({
  id: '#video',
  src: './test.mp4',
  videoInit: false,
  poster: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1032090787,3027113824&fm=26&gp=0.jpg'
})

// 体现出loading插件的效果
setTimeout(() => {
  player.start()
}, 1000);

