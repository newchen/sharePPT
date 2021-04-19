var ul = document.querySelector('#container');

var worker = new Worker('./work.js')

worker.addEventListener('message', (e) => {
  ul.innerHTML = e.data
  console.log('JS执行时间: ', new Date() - start);

  setTimeout(function() {
    console.log('渲染结束耗时: ', new Date() - start);
  })
})

var start = new Date();
worker.postMessage(100000)