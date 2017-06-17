'use strict';

let TINY_URL_SERVER = 'http://dwz.cn/create.php';

// 获取当前标签页的URL
function getCurrentTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if(tabs && tabs.length > 0 && tabs[0].url) {
        return resolve(tabs[0].url);
      }
      reject(new Error('get current tab url fail!'))
    })
  })
}

// 获取短链接
function getTinyUrl(url) {
  return Promise.resolve($.ajax({
    url: TINY_URL_SERVER, 
    method: 'POST', 
    data: { url }
  }));
}
// 传入url生成二维码
function createQrcode(url) {
  $('#qr-code').qrcode({ text: url, width: 250, height: 250 });
}

(async () => {
  try {
    let tinyUrl = '';
    let tabUrl = await getCurrentTabUrl();
    let tinyUrlRes = await getTinyUrl(tabUrl);
    
    tinyUrlRes = JSON.parse(tinyUrlRes);
    if(tinyUrlRes.status === 0) {
      tinyUrl = tinyUrlRes.tinyurl;
      console.log('fetch tinyurl success:', tinyUrl);
    }else {
      console.log('fetch tinyurl fail:', tinyUrlRes.err_msg);
    }
    // 创建二维码
    createQrcode(tinyUrl || tabUrl);
    $('#url-src').text(tabUrl).attr('title', tabUrl);
  } catch(e) {
    console.log(e);
  }
})()