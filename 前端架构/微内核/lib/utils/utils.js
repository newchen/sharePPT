export function createDom(el = 'div', { html = '', attrs = {}, className = '' } = {}) {
  let dom = document.createElement(el)

  html && (dom.innerHTML = html)
  className && (dom.className = className)

  Object.keys(attrs).forEach(key => {
    let value = attrs[key]
    if (el === 'video' || el === 'audio') {
      if (value) {
        dom.setAttribute(key, value)
      }
    } else {
      dom.setAttribute(key, value)
    }
  })
  return dom
}