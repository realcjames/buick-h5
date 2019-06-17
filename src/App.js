import React from 'react';
import autoBind from 'react-autobind';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  render() {
    return <div>hello world!</div>;
  }
}
