(function (window, undefined) {
  var jQuery = (function() {
    var jQuery = function (selector, context) {
      //就算在外部new jQuery，仍然返回的是jQuery.fn.init对象
      return new jQuery.fn.init(selector, context);
    }

    jQuery.fn = jQuery.prototype = {
      constructor: jQuery,
      selector: '',
      /*
        简单模拟
        假设selector传入'div'且页面有3个div元素, 
        会返回: {0: div, 1: div, 3: div, ..., length: 3, selector: 'div'}
      */
      init: function (selector, context) { 
        this.selector = selector

        let arr = [...document.querySelectorAll(selector)]
        arr.forEach((el, i) => this[i] = el)
        this.length = arr.length

        return this
      },
      //... //其它属性或方法
    };

    /*jQuery.fn的作用：
      作为jQuery.prototype和jQuery.fn.init.prototype的别名，
      jQuery.fn名称相比较jQuery.prototype和jQuery.fn.init.prototype更简短一些，
      三者都不对外暴露，因为它们都表示同一个对象的引用，而该对象涉及底层机制，
      但jQuery.fn.extend和jQuery.extend方法对外暴露
    */
    jQuery.fn.init.prototype = jQuery.fn;

    /**
      jquery的发展有很大因素是因为它非常易于扩展,究其原因就得益于extend函数
      该函数是一个扩展函数…说是一个扩展函数,其实就是一个浅拷贝和深拷贝的函数而已.
    */
    jQuery.extend = jQuery.fn.extend = function (...rest) {
      //扩展机制代码简单模拟
      if (rest.length === 1) {
        return Object.assign(this, rest[0])
      }

      return rest.reduce((pre, next) => ({ ...pre, ...next}), {})
    };

    jQuery.fn.extend({ //扩展jQuery.fn.init对象的方法，$(selector).css();
      css: function (attr, val) {
        for(var i = 0; i < this.length; i++) {
          if(val == undefined) {
            if(typeof attr === 'object'){
              for(var key in attr){
                this.css(key, attr[key]);
              }
            } else if(typeof attr === 'string') {
              return getComputedStyle(this[i])[attr];
            }
          } else {
            this[i].style[attr] = val;
          }
        }
      }
      // ...
    });

    jQuery.extend({ // 扩展jQuery的静态方法,jQuery.ajax();
      ajax: function (o) {
        console.log('ajax')
      },
      // ...
    });

    return jQuery;
  })()

  window.jQuery = window.$ = jQuery
})(this)