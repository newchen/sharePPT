self.addEventListener('message', function (e) {
  var count = e.data;
  var html = '';
  
  for (var i = 0; i < count; i++) {
    html += '<li>' + i + '</li>'
  }

  self.postMessage(html)
}, false);