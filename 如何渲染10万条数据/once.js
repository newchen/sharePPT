//************** 一次性渲染 ************** 

var ul = document.querySelector('#container');

// 使用不同方式创建

// 1. 创建空元素, ps: 对比使用空元素和带文本节点的元素，性能相差有多少
var createEmptyElements = function(count, callback) {
  var start = new Date();
  
  for (var i = 0; i < count; i++) {
    var element = document.createElement('li');
    ul.appendChild(element);
  }
  
  let d1 = new Date() - start
  console.log('JS执行时间: ', d1)

  setTimeout(function() {
    let d2 = new Date() - start
    console.log('渲染结束耗时: ', d2);
    callback && callback(d1, d2)
  }, 0);
};

// 2. 创建带文本元素
var createElements = function(count, callback) {
  var start = new Date();
  
  for (var i = 0; i < count; i++) {
    var element = document.createElement('li');
    element.appendChild(document.createTextNode('' + i));
    ul.appendChild(element);
  }

  let d1 = new Date() - start
  console.log('JS执行时间: ', d1)

  setTimeout(function() {
    let d2 = new Date() - start
    console.log('渲染结束耗时: ', d2);
    callback && callback(d1, d2)
  }, 0);
};

// 3. 使用 DocumentFragment
var createElementsWithFragment = function(count, callback) {
  var start = new Date();
  var fragment = document.createDocumentFragment();
  
  for (var i = 0; i < count; i++) {
    var element = document.createElement('li');
    element.appendChild(document.createTextNode('' + i));
    fragment.appendChild(element);
  }
  
  ul.appendChild(fragment);

  let d1 = new Date() - start
  console.log('JS执行时间: ', d1)

  setTimeout(function() {
    let d2 = new Date() - start
    console.log('渲染结束耗时: ', d2);
    callback && callback(d1, d2)
  }, 0);
};

// 4. 使用 innerHTML
var createElementsWithHTML = function(count, callback) {
  var start = new Date();
  var html = '';
  
  for (var i = 0; i < count; i++) {
    html += '<li>' + i + '</li>'
  }
  
  ul.innerHTML = html;

  let d1 = new Date() - start
  console.log('JS执行时间: ', d1)

  setTimeout(function() {
    let d2 = new Date() - start
    console.log('渲染结束耗时: ', d2);
    callback && callback(d1, d2)
  }, 0);
};

// -----------------------------------------------
var count = 100000
var times = 10

// 循环多次, 取平均值
var loop = function(fn, times) {
  var total1 = 0;
  var total2 = 0;
  var t = times

  fn(count, function temp(d1, d2) {
    times--;
    total1 += d1
    total2 += d2

    if (times > 0) {
      ul.innerHTML = '';

      setTimeout(() => {
        fn(count, temp)
      })
    } else {
      console.log(`**JS执行平均耗时**: ${total1 / t}`)
      console.log(`**渲染平均耗时**: ${total2 / t}`)
    }
  })
}

// createEmptyElements(count) 
createElements(count) 
// createElementsWithFragment(count)
// createElementsWithHTML(count)

// **JS执行平均耗时**: 110.1 
// **渲染平均耗时**: 2433.5
// loop(createEmptyElements, times) 

// **JS执行平均耗时**: 301.1
// **渲染平均耗时**: 4640.9
// loop(createElements, times) 

// **JS执行平均耗时**: 341.9
// **渲染平均耗时**: 4217
// loop(createElementsWithFragment, times)

// **JS执行平均耗时**: 275.9
// **渲染平均耗时**: 4391.6
// loop(createElementsWithHTML, times) 

