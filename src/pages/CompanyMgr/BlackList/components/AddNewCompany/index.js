import React from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ blackList, loading }) => ({
  blackList,
  blackData: loading.effects['blackList/Add'],
}))
@Form.create()
class AddNewCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = () => {
    const { dispatch, turnHidden } = this.props;
    dispatch({
      type: 'blackList/Add',
      payload: {
        a: 1,
        b: 2,
      },
    });
    turnHidden();
  };

  handleCancel = () => {
    const { turnHidden } = this.props;
    turnHidden();
  };

  render() {
    const { modalShown, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <Modal
        title="新增黑名单企业"
        visible={modalShown}
        onOk={this.handleOk}
        className={styles.modalSpace}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit} className="add-blacklist">
          <FormItem {...formItemLayout} label="企业名称">
            {getFieldDecorator('enterpriseName', {
              rules: [{ required: true, message: '请输入企业名称' }],
            })(<Input placeholder="请输入企业名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="列入黑名单原因">
            {getFieldDecorator('industryBelong', {
              rules: [{ required: false, message: '请选择原因' }],
            })(<Select mode="multiple" style={{ width: '100%' }} placeholder="请选择" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="有效期">
            {getFieldDecorator('date', {
              rules: [
                {
                  required: false,
                  message: '日期范围',
                },
              ],
            })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="录入负责人">
            {getFieldDecorator('nameOne', {
              rules: [{ required: false, message: '请输入录入负责人姓名' }],
            })(<Input style={{ display: 'inline-block' }} placeholder="默认xxx" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="审批人">
            {getFieldDecorator('nametwo', {
              rules: [{ required: false, message: '请输入审批人姓名' }],
            })(<Input style={{ display: 'inline-block' }} placeholder="默认xxx" disabled />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default AddNewCompany;
