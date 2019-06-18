import axios from 'axios';
import wx from 'weixin-js-sdk';
import config from '../config/config';
import common from './common';

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

export function weixinAuth() {
  const code = common.getUrlParams('code');

  // 如果url里面不存在code或没有授权通过，要跳转
  if (!code && !sessionStorage.getItem('isAuth')) {
    const redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${document.location.href}&response_type=code&scope=snsapi_base#wechat_redirect`;
    // location.href = redirectUrl; // todo 记得放开
  }

  // sessionStorage.setItem('curUrl', path);
  sessionStorage.setItem('isAuth', true);
}

/**
 * 微信配置和分享配置
 */
export function jsSdkConfig() {
  // 安卓大于6.3.31需要使用当前URL进行微信API注册（即当场调用location.href.split('#')[0]）
  // 安卓小于6.3.31需要将第一次进入页面的地址保存，之后每次页面改变（即URL变化），就调用一次config。url使用第一次进入页面的URL
  // 只需要进入第一个页面之后调用一次（即在任何pushstate发生前，调用location.href.split('#')[0]）
  // todo 这里还要试验下，另外要看下安卓小于6.3.31和ios的能不能合并？①每个页面都调用但是只用第一次进来的url ②只在第一个页面调用一次
  let url = '';
  if (isAndroid()) {
    // 安卓机
    if (weixinVersion()) {
      // 大于6.3.31版本
      url = encodeURIComponent(window.location.href.split('#')[0]);
      weixinConfig(url);
    } else {
      // 小于6.3.31版本
      let firstEnterUrl = sessionStorage.getItem('firstEnterUrl');
      if (firstEnterUrl) {
        url = encodeURIComponent(window.location.href.split('#')[0]);
      } else {
        firstEnterUrl = window.location.href.split('#')[0];
        sessionStorage.setItem('firstEnterUrl', firstEnterUrl);
      }
      weixinConfig(url);
    }
  } else {
    // ios
    let firstEnterUrl = sessionStorage.getItem('firstEnterUrl');
    if (firstEnterUrl) {
      url = encodeURIComponent(window.location.href.split('#')[0]);
      weixinConfig(url);
    }
  }
}

function weixinConfig(url) {
  let time = Math.round(new Date().getTime() / 1000); //获取10位时间戳
  // alert(window.location.href.split('#')[0]);
  axios
    .get(
      `${config.baseUrl}/wechat/getJsSDKConfig?timestamp=${time}&nonceStr=nonceStr&url=${url}`,
    )
    .then(function(response) {
      if (response.data.state === 0) {
        /*配置微信jssdk*/
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: response.data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳（10位）
          nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串,注意大小写
          signature: response.data.data.signature, // 必填，签名，见附录1（通过https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 验证）
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要使用的JS接口列表
        });

        wx.ready(() => {
          wx.updateTimelineShareData({
            title: '弘阳家居江宁店惊喜周年庆，有鲤才有趣。',
            link: 'https://saas-api.heyizhizao.com/zhuanti/jlhb-h5/index.html',
            imgUrl:
              'https://saas-api.heyizhizao.com/zhuanti/jlhb-h5/static/img/share.jpg',
            success: () => {},
          });
          wx.updateAppMessageShareData({
            title: '弘阳家居江宁店惊喜周年庆，有鲤才有趣。',
            desc: '不会念红鲤鱼、绿鲤鱼与驴？！不如来抽条锦鲤吧~',
            link: 'https://saas-api.heyizhizao.com/zhuanti/jlhb-h5/index.html',
            imgUrl:
              'https://saas-api.heyizhizao.com/zhuanti/jlhb-h5/static/img/share.jpg',
            success: () => {},
          });
        });
      }
    })
    .catch(function(errors) {
      console.log('errors', errors);
    });
}
