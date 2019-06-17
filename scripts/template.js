/**
 * pages页面快速生成脚本
 * 用法：npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

//页面模板
const indexTep = `
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'dva';
import './index.scss'

class Index extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { common } = this.props;

    return (
      <div className='${dirName}-page'>
      </div>
    )
  }
}

export default connect(({ ${dirName}, common }) => ({
  ${dirName},
  common
}))(Index);
`;

// scss文件模版
const scssTep = `
.${dirName}-page {
    width: 100%;
    min-height: 100vh;
}
`;

//model模板

const modelTep = `
export default {
  namespace: "${dirName}",
  state: {},
  effects: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
`;

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`index.js`, indexTep); //tsx
fs.writeFileSync(`index.scss`, scssTep); // scss
fs.writeFileSync('model.js', modelTep); // model
fs.writeFileSync('service.js', ''); // service
process.exit(0);
