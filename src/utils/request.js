import axios from 'axios';

let api = axios.create({
  baseURL: 'http://idesite.heyizhizao.com/api',
  timeout: 30000,
  headers: {
    Accept: 'application/json; charset=UTF-8',
  },
});

api.interceptors.request.use(request => {
  if (!request.params) {
    request.params = {};
  }
  return request;
});

// 要调试网络请求的话，就在 yarn start 之前设置环境变量如下：
// REACT_APP_DEBUG_API=true
if (process.env.REACT_APP_DEBUG_API === 'true') {
  api.interceptors.request.use(request => {
    console.log('axios request:', request);
    return request;
  });
  api.interceptors.response.use(response => {
    console.log('axios response:', response);
    return response;
  });
}

export default api;
