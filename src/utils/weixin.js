import axios from 'axios';
import { appId, baseUrl } from '../config/config';

/**
 * 判断是否为安卓客户端
 */
export function isAndroid() {
  let u = window.navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
}

/**
 * 判断微信版本是否大于6.3.31
 */
export function weixinVersion() {
  var str = window.navigator.userAgent;
  var v0 = [6, 3, 31];
  var regExp = /MicroMessenger\/([\d|.]+)/;
  if (regExp.exec(str) === null) {
    return;
  }
  var v1 = regExp.exec(str)[1].split('.');
  if (v1.length >= 4) {
    v1 = v1.slice(0, 3);
  }
  v1 = v1.map(function(v) {
    return parseInt(v, 10);
  });
  if (v1[0] > v0[0]) {
    return true;
  }
  if (v1[0] === v0[0] && v1[1] > v0[1]) {
    return true;
  }
  if (v1[0] === v0[0] && v1[1] === v0[1] && v1[2] >= v0[2]) {
    return true;
  }
  return false;
}

/**
 * 微信配置和分享配置
 */
export function jsSdkConfig() {
  //安卓需要使用当前URL进行微信API注册（即当场调用location.href.split('#')[0]）
  //iOS需要使用进入页面的初始URL进行注册，（即在任何pushstate发生前，调用location.href.split('#')[0]）
  let url = '';
  if (isAndroid() && !weixinVersion()) {
    url = encodeURIComponent(window.location.href.split('#')[0]);
  } else {
    url = encodeURIComponent(
      `http://www.qq.com/home/index?op=${window.sessionStorage.getItem(
        'option',
      )}`,
    ); //获取初始化的url相关参数
  }

  let time = Math.round(new Date().getTime() / 1000); //获取10位时间戳
  // alert(window.location.href.split('#')[0]);
  axios
    .get(
      `${baseUrl}/wechat/getJsSDKConfig?timestamp=${time}&nonceStr=nonceStr&url=${url}`,
    )
    .then(function(response) {
      if (response.data.state === 0) {
        /*配置微信jssdk*/
        window.wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: response.data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳（10位）
          nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串,注意大小写
          signature: response.data.data.signature, // 必填，签名，见附录1（通过https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 验证）
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要使用的JS接口列表
        });
      }
    })
    .catch(function(errors) {
      console.log('errors', errors);
    });
}
