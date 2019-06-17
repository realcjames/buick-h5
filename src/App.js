import React from 'react';
import autoBind from 'react-autobind';
import { Route, Router, Switch, withRouter } from 'react-router-dom';
import config from './config/config';
import common from './utils/common';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  generateGetCodeUrl = () => {
    return encodeURIComponent(
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${document.location.href}&response_type=code&scope=snsapi_base#wechat_redirect`,
    );
  };

  wechatAuth(nextState, replace, next) {
    const { code } = common.getUrlParams(document.location.href);

    if (code) {
      // WechatUserStore.fetchUserInfo(code);

      next();
    } else {
      document.location = this.generateGetCodeUrl(document.location.href);
    }
  }

  render() {
    const { history } = this.props;

    return (
      <Router history={history}>
        {/* <PrivateRoute
          name="index"
          path="/"
          render={() => }
          component={require('../pages/home/index').default}
        /> */}
        <Route path="/" component={require('./pages/home/index').default} />
        <Route path="/m" component={require('./pages/test/index').default} />
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, path: path }) => (
  sessionStorage.setItem('curUrl', path),
  sessionStorage.getItem('isAuth') ? (
    <Router render={props => <Component {...props} />} />
  ) : (
    (window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${document.location.href}&response_type=code&scope=snsapi_base#wechat_redirect`)
  )
);
