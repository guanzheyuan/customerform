import React, { Component, Fragment } from 'react';
import { Row } from 'antd';

class Illustrate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Row>说明</Row>
        <Row>1. 按照第一步的布局，表单每行展示相应的元素数据；</Row>
        <Row>2. 当选择合并列时，元素跨列显示；</Row>
        <Row>3. 当点击新增按钮可以增加行，一个表单至少有一行；</Row>
        <Row>4. 预览结果为第一步与第二部设置的结果；</Row>
      </Fragment>
    );
  }
}

export default Illustrate;
