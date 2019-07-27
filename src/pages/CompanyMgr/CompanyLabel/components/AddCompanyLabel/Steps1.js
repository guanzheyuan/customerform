import React, { Component, Fragment } from 'react';
import { Input, Form, DatePicker, Radio, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './style.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const initVal = {
  labelName: '',
  labelStartDate: '',
  labelEndDate: '',
  labelDescribe: '',
  updateFreq: '',
  labelPer: '',
  userCode: '',
};

@connect(({ labelMgr }) => ({ labelMgr }))
@Form.create()
class Steps1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        nextStep: true,
      },
    ];
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  handleInitVal = key => {
    const { labelType, labelData, nextCurrent, firstSteps } = this.props;
    if (nextCurrent !== 1 && labelType === 'edit') {
      return labelData[key];
    }
    if (nextCurrent === 1 && firstSteps) {
      return firstSteps[key];
    }
    return initVal[key];
  };

  nextStep = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const valus = getFieldsValue();
    const { labelDescribe, labelName, labelPer, updateFreq, userCode } = valus;
    if (labelName === '') {
      message.info('请填写标签名称');
      return false;
    }
    let labelStartDate = '';
    let labelEndDate = '';
    if (valus.startEndTime) {
      labelStartDate = valus.startEndTime[0].format('YYYY-MM-DD');
      labelEndDate = valus.startEndTime[1].format('YYYY-MM-DD');
    }
    if (labelEndDate === '' || labelStartDate === '') {
      message.info('请选择有效期');
      return false;
    }

    const { nextStep } = this.state;
    if (nextStep === false) {
      return false;
    }

    const newValue = {
      labelDescribe,
      labelName,
      labelPer,
      updateFreq,
      userCode,
      labelStartDate,
      labelEndDate,
    };
    return newValue;
  };

  handleCheck = e => {
    const { dispatch, labelType, labelData } = this.props;
    if (labelType === 'new') {
      dispatch({
        type: 'labelMgr/checkLabelName',
        payload: {
          labelName: e.target.value,
        },
        callback: result => {
          if (result.success === false) {
            message.info('标签名称已存在，请重新填写');
            this.setState({
              nextStep: false,
            });
          } else if (result.success === true) {
            this.setState({
              nextStep: true,
            });
          }
        },
      });
    }
    if (labelType === 'edit' && labelData.labelName !== e.target.value) {
      dispatch({
        type: 'labelMgr/checkLabelName',
        payload: {
          labelName: e.target.value,
        },
        callback: result => {
          if (result.success === false) {
            message.info('标签名称已存在，请重新填写');
            this.setState({
              nextStep: false,
            });
          } else if (result.success === true) {
            this.setState({
              nextStep: true,
            });
          }
        },
      });
    }
  };

  render() {
    const {
      updatafreq,
      form: { getFieldDecorator },
      labelType,
      nextCurrent,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Fragment>
        <Form {...formItemLayout} className={styles.stepOneIndex} onSubmit={this.handleSubmit}>
          <Form.Item label="标签名称">
            {getFieldDecorator('labelName', {
              initialValue: this.handleInitVal('labelName'),
              rules: [
                {
                  required: true,
                  message: '请填写标签名称',
                  whitespace: true,
                },
              ],
            })(<Input onBlur={this.handleCheck} />)}
          </Form.Item>
          <Form.Item label="有效期">
            {getFieldDecorator('startEndTime', {
              initialValue:
                labelType === 'edit' || nextCurrent === 1
                  ? [
                      moment(this.handleInitVal('labelStartDate')),
                      moment(this.handleInitVal('labelEndDate')),
                    ]
                  : null,
              rules: [
                {
                  required: true,
                  message: '请选择有效期',
                },
              ],
            })(<RangePicker style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label="标签描述">
            {getFieldDecorator('labelDescribe', {
              initialValue: this.handleInitVal('labelDescribe'),
            })(<TextArea placeholder="请输入标签描述（100字内）" style={{ minHeight: 32 }} />)}
          </Form.Item>
          <Form.Item label="更新频率">
            {getFieldDecorator('updateFreq', {
              initialValue: parseInt(this.handleInitVal('updateFreq'), 0),
            })(
              <Radio.Group>
                {updatafreq.map(item => {
                  return (
                    <Radio key={item.dictCode} value={item.dictCode}>
                      {item.dictLabel}
                    </Radio>
                  );
                })}
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="标签权限">
            {getFieldDecorator('labelPer', {
              initialValue: this.handleInitVal('labelPer'),
            })(
              <Radio.Group>
                <Radio value="1">仅自己可见</Radio>
                <Radio value="2">仅部门可见</Radio>
                <Radio value="3">全部可见</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="标签审批人">
            {getFieldDecorator('userCode', {
              initialValue: this.handleInitVal('userCode'),
            })(<Input />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}
export default Steps1;
