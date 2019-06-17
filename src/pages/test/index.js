import { connect } from 'dva';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import './index.scss';

class Index extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { common } = this.props;

    return <div className="test-page">test</div>;
  }
}

export default connect(({ test, common }) => ({
  test,
  common,
}))(Index);
