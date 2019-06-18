import { connect } from 'dva';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { jsSdkConfig } from '../../utils/weixin';
import './index.scss';

class Index extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  componentWillMount() {
    console.log('home componentWillMount');
    console.log(document.location.href);

    jsSdkConfig();
  }

  componentDidMount() {}

  render() {
    const { common } = this.props;

    return <div className="home-page">home</div>;
  }
}

export default connect(({ home, common }) => ({
  home,
  common,
}))(Index);
