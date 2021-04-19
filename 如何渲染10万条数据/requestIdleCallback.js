/**
 * requestIdleCallback 分时函数
 * 
 * @param {Array} arr 数据
 * @param {Function} every  每次的回调
 * @param {Function} complete 结束时的回调
 */
function timeChunk(arr, every, complete) {
  let index = 0;
  let len = arr.length;

  function performWork(deadline) {
    while (index < len && deadline.timeRemaining() > 1) {
      every(arr[index], index, arr)
      index++
    }

    if(index >= len) return complete(arr);

    requestIdleCallback(performWork) // 重新申请
  };

  return () => requestIdleCallback(performWork);
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