import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Row, Col, Select, DatePicker } from 'antd';
import BarEcharts from './components/BarEcharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ enterprise }) => ({ enterprise }))
@Form.create()
class EnterpriseEconomy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleChangeCompany = value => {
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
      <PageHeaderWrapper title="企业经济可视化">
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
                      placeholder="企业"
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      onChange={this.handleChangeCompany()}
                    >
                      <Option value="1">江苏润和软件股份有限公司</Option>
                      <Option value="2">小米科技有限责任公司</Option>
                      <Option value="3">华为软件技术有限公司</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <BarEcharts />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EnterpriseEconomy;
