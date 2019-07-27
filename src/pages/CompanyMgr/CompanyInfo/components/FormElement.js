import React, { Component, Fragment } from 'react';
import { Form, InputNumber, Input, Select, Col, DatePicker } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class FormElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  switchItem = item => {
    const { eleType } = item;
    switch (eleType.toLowerCase()) {
      case 'int':
        return <InputNumber style={{ width: '100%' }} />;
      case 'input':
        return <Input />;
      case 'datepicker':
        return <DatePicker style={{ width: '100%' }} />;
      case 'select':
        return (
          <Select>
            {item.eleInfo.map(option => {
              return (
                <Option key={option.value} value={option.value}>
                  {option.content}
                </Option>
              );
            })}
          </Select>
        );
      default:
        return <text />;
    }
  };

  switchInitial = item => {
    const { eleType } = item;
    switch (eleType.toLowerCase()) {
      case 'datepicker':
        return item.value.length === 0 ? null : item.value;
      default:
        return item.value;
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      item,
    } = this.props;
    const colTotal = Number(item.labelGridCol) * 2 + Number(item.contentGridCol) * 2;
    const formItemLayout = {
      labelCol: {
        sm: { span: Number(item.labelGridCol) * 2 * (24 / colTotal) },
      },
      wrapperCol: {
        sm: { span: Number(item.contentGridCol) * 2 * (24 / colTotal) },
      },
    };
    return (
      <Fragment>
        <Col span={colTotal}>
          <FormItem {...formItemLayout} key={item.id} label={item.label}>
            {getFieldDecorator(item.name, {
              initialValue: this.switchInitial(item),
              rules: [
                {
                  required: item.required,
                  message: item.errorMessage,
                },
              ],
            })(this.switchItem(item))}
          </FormItem>
        </Col>
      </Fragment>
    );
  }
}

export default FormElement;
