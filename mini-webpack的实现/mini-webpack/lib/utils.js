const path = require('path')
const fs = require('fs');

// 确保文件夹存在
function mkdirSync(url, cb) {
  url = url.replace(/\\/g, '/')
  var arr = url.split("/");
  var mode = 0755;
  cb = cb || function(){};

  if(arr[0] === ".") {//处理 ./aaa
      arr.shift();
  }

  if(arr[0] == "..") {//处理 ../ddd/d
      arr.splice(0, 2, arr[0] + "/" + arr[1]);
  }

  if(arr[0].indexOf(':')) {//处理 d:/ddd/d
       arr.splice(0, 2, arr[0] + "/" + arr[1]);
  }

  function inner(cur) {
      if (!fs.existsSync(cur)) {//不存在就创建一个
          fs.mkdirSync(cur, mode);
      }
      if (arr.length) {
          inner(cur + "/"+ arr.shift());
      } else {
          cb();
      }
  }
  
  arr.length && inner(arr.shift());
}

function getAbsPath(p) { //  获取绝对路径
  return path.join(process.cwd(), p)
}

module.exports = {
  mkdirSync,
  getAbsPath
}