'use strict';

let TINY_URL_SERVER = 'http://dwz.cn/create.php';

function promisePost(url, settings) {
  return Promise.resolve($.post(url, settings))
}

// 获取当前标签页的URL
function getCurrentTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if(tabs && tabs.length > 0) {
        let url = tabs[0].url;
        if(url) {
          $('#url').text(url);
          return resolve(url)
        }
      }
      reject(new Error('get current tab url fail!'))
    })
  })
}

// 获取短链接
function getTinyUrl(url) {
  // return fetch(TINY_URL_SERVER, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: 'url=' + url
  // })
  
  return Promise.resolve($.post(TINY_URL_SERVER, { url }))
  // .then(res => res.json())
  .then(res => {
    console.log(res);
    res = JSON.parse(res);
    if(res.status !== 0) {
      console.log('fetch tinyurl fail:', res.err_msg);
      return res.longurl;
    }
    return res.tinyurl;             // 获取百度短链
  })
}
// 传入url生成二维码
function createQrcode(url) {
  $('#qr-code').qrcode({ text: url, width: 250, height: 250 });
}

$(function() {
  getCurrentTabUrl()
    .then(url => getTinyUrl(url))
    .then(url => createQrcode(url))
    .catch(err => {
      console.log(err);
    })
})
