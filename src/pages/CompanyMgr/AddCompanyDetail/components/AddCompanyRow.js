/* eslint-disable react/no-array-index-key */
/* eslint-disable no-prototype-builtins */
import React, { Component } from 'react';
import { Form, Row, Col, Input, TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

@Form.create()
class AddCompanyRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emColEname: '',
    };
  }

  componentDidMount() {}

  onChange = emColEname => {
    console.log(emColEname);
    this.setState({ emColEname });
  };

  render() {
    const {
      addcompany: { elementData },
    } = this.props;

    const { emColEname } = this.state;
    console.log(emColEname);
    const loop = data =>
      data.map((item, index) => {
        if (item.hasOwnProperty('childList')) {
          return (
            <TreeNode disabled key={index} title={item.treeType} value={item.treeType}>
              {loop(item.childList)}
            </TreeNode>
          );
        }
        return <TreeNode key={index} title={item.columnComment} value={item.columnName} />;
      });

    return (
      <Row style={{ marginBottom: 10 }}>
        <Col span={10}>
          <Input placeholder="请输入标题" />
        </Col>
        <Col span={13} offset={1}>
          <TreeSelect
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            placeholder="选择数据源"
            onChange={this.onChange}
          >
            {loop(elementData)}
          </TreeSelect>
        </Col>
      </Row>
    );
  }
}

export default AddCompanyRow;
