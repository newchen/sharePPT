/**
 * setTimeout 分时函数
 * 
 * @param {Array} arr 数据
 * @param {Function} fn  逻辑函数
 * @param {Function} complete 结束时的回调
 * @param {Number} count 一次的数量, 默认50
 * @param {Number} timeout 分批执行的间隔, 默认0
 */
function timeChunk(arr, fn, complete, count = 50, timeout = 0) {
  let index = 0;
  let len = arr.length;

  var chunk = function() {
    var ar = arr.slice(index, count + index);
    fn(ar, index, count)

    if (index + count >= len) {
      complete(arr)
    } else {
      index = index + count;
      setTimeout(chunk, timeout);
    }
  };

  return chunk;
}

// --------------------------------------
var ul = document.querySelector('#container');
var count = 100000
var data = Array.from({length: count}).map((v, i) => i)

function exec() {
  var start = performance.now()

  timeChunk(data, (arr, index, count) => {
    for (var i = 0; i < count; i++) {
      var element = document.createElement('li');
      element.appendChild(document.createTextNode('' + (index + i)));
      ul.appendChild(element);
    }
  }, () => {
    setTimeout(() => {
      console.log('渲染结束耗时: ',  performance.now() - start);
    })
  })()
  
}

console.log('start')
exec()