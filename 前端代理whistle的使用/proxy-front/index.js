function $(id) {
  return document.querySelector(id)
}
function JSONP({  
  url,
  params,
  callbackKey = 'callback'
}) {
  // 在参数里制定 callback 的名字
  params = params || {}
  params[callbackKey] = 'jsonpCallback'
  // 回调
  let jsonpPromise = new Promise(function(resolve, reject) {
    window.jsonpCallback = function (data) {
      resolve(data);
    }
  })
  // 拼接参数字符串
  const paramKeys = Object.keys(params)
  const paramString = paramKeys
    .map(key => `${key}=${params[key]}`)
    .join('&')
  // 插入 DOM 元素
  const script = document.createElement('script')
  script.setAttribute('src', `${url}?${paramString}`)
  document.body.appendChild(script)

  return jsonpPromise
}
// ------------------------------------------
$('#btn1').addEventListener('click', () => {
  axios.get('/api/user').then(req => {
    console.log(req)
  })
})

$('#btn2').addEventListener('click', () => {
  axios.get('/api/list').then(req => {
    console.log(req)
  })
})

$('#btn3').addEventListener('click', () => {
  JSONP({ url: '/api/jsonp' }).then(data => {
    console.log(data)
  })
})