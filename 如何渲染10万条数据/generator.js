/**
 * Generator 分时函数
 * @param {function *} gen 
 */
function timeChunk(gen) {
  if (typeof gen === 'function') gen = gen()
  if (!gen || typeof gen.next !== 'function') return

  return function next() {
    const start = performance.now()
    let res = null

    do {
      res = gen.next()
    } while(!res.done && performance.now() - start < 25);

    if (res.done) return
    requestAnimationFrame(next);
  }
}

// --------------------------------------
var ul = document.querySelector('#container');
var count = 100000
var data = Array.from({length: count}).map((v, i) => i)

function exec() {
  timeChunk(function* () {
    var start = performance.now()

    for(let item of data) {
      var element = document.createElement('li');
      element.appendChild(document.createTextNode('' + item));
      ul.appendChild(element);
      yield
    }

    setTimeout(() => {
      console.log('渲染结束耗时: ',  performance.now() - start);
    })
  })()
}

console.log('start')
exec()