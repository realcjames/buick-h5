const CLIENT_ENV = process.env.CLIENT_ENV;
const NODE_ENV = process.env.NODE_ENV;

const devMock = 'http://localhost:3000'; // 开发环境，需要开启mock server（执行：gulp mock）
const dev = 'https://jsy-wechat.xici.com/api'; // 开发环境，线上服务器
const devURL = CLIENT_ENV && CLIENT_ENV.indexOf('mock') > -1 ? devMock : dev;
// const devURL = "https://www.easy-mock.com/mock/5c90765427f7cd15bd94be45/api"; // 开发环境，easy-mock，真机调试时切换
const prodURL = 'https://jsy-wechat.xici.com/api'; // 生产环境，线上服务器

// 请求连接前缀
const baseUrl = NODE_ENV && NODE_ENV === 'development' ? devURL : prodURL;
const noConsole = false; // TODO 上线了别忘了关掉

const appId = 'appid';

export default { baseUrl, noConsole, appId };
