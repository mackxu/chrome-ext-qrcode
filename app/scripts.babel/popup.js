'use strict';

let TINY_URL_SERVER = 'http://dwz.cn/create.php';

function getCurrentTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if(tabs && tabs.length > 0) {
        let url = tabs[0].url;
        if(url) {
          return resolve(url)
        }
      }
      reject()
    })
  })
}

// 获取短链接
function getTinyUrl(url) {
  return fetch(TINY_URL_SERVER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'url=' + url
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    if(res.status !== 0) {
      console.log('fetch tinyurl fail:', res.err_msg);
      return res.longurl;
    }
    return res.tinyurl;             // 获取百度短链
  })
}

function createQrcode(url) {
  $('#qr-code').qrcode({ text: url, width: 250, height: 250 });
}

$(function() {
  getCurrentTabUrl()
    .then(url => {
      $('#url').text(url);
      return url;
    })
    .then(url => getTinyUrl(url))
    .then(url => createQrcode(url))
    .catch(err => {
      let msg
      try {
        msg = JSON.parse(err.message);
        msg.longurl && createQrcode(msg.longurl);
      } catch(e) {
        msg = err.message;
      }
      console.log(msg);
    })
})