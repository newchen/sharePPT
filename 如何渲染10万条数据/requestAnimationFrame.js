/**
 * requestAnimationFrame 分时函数
 * 
 * @param {Array} arr 数据
 * @param {Function} every  每次的回调
 * @param {Function} complete 结束时的回调
 */
function timeChunk(arr, every, complete) {
  let index = 0;
  let len = arr.length;

  return function next() {
    const start = performance.now()
    
    do {
      every(arr[index], index, arr)
      index++;
    } while(index < len && performance.now() - start < 25)

    if(index >= len) return complete(arr);
    requestAnimationFrame(next);
  };
}

// --------------------------------------
var ul = document.querySelector('#container');
var count = 100000
var data = Array.from({length: count}).map((v, i) => i)

function exec() {
  var start = performance.now()

  timeChunk(data, item => {
    var element = document.createElement('li');
    element.appendChild(document.createTextNode('' + item));
    ul.appendChild(element);
  }, () => {
    setTimeout(() => {
      console.log('渲染结束耗时: ',  performance.now() - start);
    })
  })()
}

console.log('start')
exec()