import React from 'react';
import autoBind from 'react-autobind';
import { Route, Switch, withRouter } from 'react-router-dom';
import { jsSdkConfig, weixinAuth } from './utils/weixin';

class App extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  componentWillMount() {
    weixinAuth();
    jsSdkConfig();
  }

  render() {
    return (
      <Switch>
        <Route path="/home" component={require('./pages/home/index').default} />
      </Switch>
    );
  }
}

export default withRouter(App);
