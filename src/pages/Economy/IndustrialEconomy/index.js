import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Row, Col, Select, DatePicker } from 'antd';
import LineEcharts from './components/LineEcharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ industrial }) => ({ industrial }))
@Form.create()
class IndustrialEconomy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleChangeIndustry = value => {
    console.log(value);
    // this.setState({
    //   operFlag: value,
    // });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper title="产业经济可视化">
        <Card bordered={false}>
          <Form>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="">{getFieldDecorator('startEndTime')(<RangePicker />)}</Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="">
                  {getFieldDecorator('industry')(
                    <Select
                      placeholder="产业"
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      onChange={this.handleChangeIndustry}
                    >
                      <Option value="1">软件产业</Option>
                      <Option value="2">人工智能</Option>
                      <Option value="3">金融</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <LineEcharts />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default IndustrialEconomy;
