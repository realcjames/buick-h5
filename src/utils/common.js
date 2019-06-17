/**
 * 获取url参数
 * @param {参数名} name
 */
function getUrlParams(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); //定义正则表达式
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export default { getUrlParams };
