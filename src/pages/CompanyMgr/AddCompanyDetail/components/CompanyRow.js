import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';

import styles from '../AddCompanyDetail.less';

class CompanyRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.addSection}>
        <Row>
          <Col span={12} className={styles.sequence}>
            第1行
          </Col>
          <Col span={12} className={styles.sectionRight}>
            <Button type="link">上移</Button>
            <Button type="link">下移</Button>
            <Button type="link">编辑</Button>
            <Button type="link">删除</Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>公司名称</Col>
          <Col span={8}>选择数据源</Col>
        </Row>
        <Row>
          <Col span={8}>标题</Col>
          <Col span={8}>XXXX</Col>
        </Row>
      </div>
    );
  }
}

export default CompanyRow;
