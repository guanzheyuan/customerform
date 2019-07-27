import React, { Component } from 'react';
import { Input, Select, Form, Checkbox, Alert, Button, Icon, message } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

const initVal = {
  operatorRegions: '',
  ruleContentList: '',
  companyAction: '',
  companyType: '',
};

@Form.create()
@connect(({ labelMgr, loading }) => ({
  labelMgr,
  loading: loading.effects['labelMgr/queryParamList'],
}))
class Steps2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operFlag: '', // 运算符
      inputValue: '', // 输入值
      textAreaValue: '', // 规则表达式
      operParam: '', // 参数名称
      operParamText: '', // 参数名称text
      qyRuleList: [],
      flag: false,
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  handleInitVal = key => {
    const { labelType, editRuleResult, nextCurrent, SecondSteps } = this.props;
    if (nextCurrent !== 2 && labelType === 'edit') {
      return editRuleResult[key];
    }
    if (nextCurrent === 2 && SecondSteps) {
      return SecondSteps[key];
    }
    return initVal[key];
  };

  handleChangeParam = value => {
    const { paramList } = this.props;
    paramList.forEach(item => {
      if (item.dictValue === value) {
        this.setState({
          operParamText: item.dictLabel,
          operParam: value,
        });
      }
    });
  };

  handleChangeOper = value => {
    this.setState({
      operFlag: value,
    });
  };

  handleInputValue = e => {
    const re = /\D/;
    if (re.test(e.target.value)) {
      message.info('请输入数字');
      return;
    }
    this.setState({
      inputValue: e.target.value,
    });
  };

  handleAddYu = () => {
    const { textAreaValue, qyRuleList } = this.state;
    qyRuleList.push('#');
    this.setState({
      textAreaValue: `${textAreaValue}与`,
      qyRuleList,
    });
  };

  handleAddHuo = () => {
    const { textAreaValue, qyRuleList } = this.state;
    qyRuleList.push('@');
    this.setState({
      textAreaValue: `${textAreaValue}或`,
      qyRuleList,
    });
  };

  handleAddZuo = () => {
    const { textAreaValue } = this.state;
    this.setState({
      textAreaValue: `${textAreaValue}(`,
    });
  };

  handleAddYou = () => {
    const { textAreaValue } = this.state;
    this.setState({
      textAreaValue: `${textAreaValue})`,
    });
  };

  handleAllCompany = checkedValues => {
    console.log('check', checkedValues);
  };

  handleAddOper = () => {
    const {
      operParam,
      operParamText,
      operFlag,
      inputValue,
      textAreaValue,
      qyRuleList,
    } = this.state;
    qyRuleList.push(operParam + operFlag + inputValue);
    this.setState({
      textAreaValue: textAreaValue + operParamText + operFlag + inputValue,
      qyRuleList,
    });
  };

  handelDelete = () => {
    this.setState({
      textAreaValue: '',
      qyRuleList: [],
    });
    const { deleteTextArea } = this.props;
    deleteTextArea();
  };

  nextStep2 = () => {
    const {
      SecondSteps,
      labelType,
      editRuleResultContentText,
      dispatch,
      editRuleResult,
      editRuleResultContent,
      saveRuleDataList,
    } = this.props;
    const { qyRuleList } = this.state;
    console.log('SecondSteps', SecondSteps, 'editRuleResultContentText', editRuleResultContentText);
    // if (labelType === 'new' && textAreaValue === '' && SecondSteps.length === 0) {
    //   message.info('规则表达式不能为空');
    //   return false;
    // }
    // if (labelType === 'new' && textAreaValue === '' && editRuleResultContentText === '') {
    //   message.info('规则表达式不能为空');
    //   return false;
    // }
    // if(labelType === 'new' && textAreaValue === "" && SecondSteps.textAreaValue === ""){
    //   message.info('规则表达式不能为空');
    //   return false;
    // }
    // if (
    //   labelType === 'edit' &&
    //   textAreaValue === '' &&
    //   SecondSteps.length === 0 &&
    //   editRuleResultContentText === ''
    // ) {
    //   message.info('规则表达式不能为空');
    //   return false;
    // }
    // if (labelType === 'edit' && textAreaValue === '' && editRuleResultContentText === '') {
    //   message.info('规则表达式不能为空');
    //   return false;
    // }
    console.log('qyRuleList', qyRuleList, editRuleResult);

    if (labelType === 'edit') {
      console.log('zoulma');
      const promise = dispatch({
        type: 'labelMgr/checkRule',
        payload: {
          params: {
            ruleContentList: qyRuleList.length === 0 ? editRuleResultContent : qyRuleList,
          },
        },
        callback: result => {
          this.setState({
            flag: result.success,
          });
          if (result.success === false) {
            message.info(result.msg);
          }
        },
      });
      return promise;
    }
    console.log('saveRuleDataList', saveRuleDataList);
    if (labelType === 'new') {
      const promise = dispatch({
        type: 'labelMgr/checkRule',
        payload: {
          params: {
            ruleContentList: qyRuleList.length === 0 ? saveRuleDataList : qyRuleList,
          },
        },
        callback: result => {
          this.setState({
            flag: result.success,
          });
          if (result.success === false) {
            message.info(result.msg);
          }
        },
      });
      return promise;
    }
    return '';
  };

  getData = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const { qyRuleList, textAreaValue, flag } = this.state;
    const valus = getFieldsValue();
    const { operatorRegions } = valus;
    const newValue = {
      operatorRegions,
      qyRuleList,
      textAreaValue,
      flag,
    };
    return newValue;
  };

  render() {
    const {
      form: { getFieldDecorator },
      paramList,
      editRuleResultContentText,
    } = this.props;
    const { textAreaValue } = this.state;
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
    const plainOptions = [
      { label: '企业按时填报数据', value: '1' },
      { label: '企业不存在与黑名单中', value: '2' },
      { label: '企业无纳税不良记录', value: '3' },
    ];
    return (
      <div style={{ width: '720px', margin: '0 auto' }}>
        <Form {...formItemLayout}>
          <Alert
            closable
            showIcon
            message="规则确认后将自动筛选企业名单"
            style={{ marginBottom: 24 }}
          />
          <Form.Item label="经营范围">
            {getFieldDecorator('operatorRegions', {
              initialValue: this.handleInitVal('operatorRegions'),
            })(<Input placeholder="请输入关键字" />)}
          </Form.Item>
          <Form.Item label="规则表达式设置">
            {getFieldDecorator('ruleContentList', {
              initialValue: textAreaValue || editRuleResultContentText,
            })(<TextArea disabled />)}
          </Form.Item>
          <Form.Item label="添加参数" className={styles.formOther}>
            <Select
              placeholder="参数名称"
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={this.handleChangeParam}
            >
              {paramList.map(item => {
                return (
                  <Option key={item.dictCode} value={item.dictValue}>
                    {item.dictLabel}
                  </Option>
                );
              })}
            </Select>
            <Select
              placeholder="运算符"
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={this.handleChangeOper}
            >
              <Option value="=">等于</Option>
              <Option value="<>">不等于</Option>
              <Option value=">">大于</Option>
              <Option value=">=">大于等于</Option>
              <Option value="<">小于</Option>
              <Option value="<=">小于等于</Option>
            </Select>
            <Input placeholder="请输入" onChange={e => this.handleInputValue(e)} />
            <span className={styles.addBtn}>
              <Icon type="plus" onClick={this.handleAddOper} />
              <Icon type="delete" onClick={this.handelDelete} style={{ marginLeft: '15px' }} />
            </span>
          </Form.Item>
          <Form.Item label="添加逻辑运算符" className={styles.formOther}>
            <Button onClick={this.handleAddYu}>与</Button>
            <Button onClick={this.handleAddHuo}>或</Button>
            <Button onClick={this.handleAddZuo}>&#40;</Button>
            <Button onClick={this.handleAddYou}>&#41;</Button>
          </Form.Item>
          <Form.Item label="企业行为(可多选)">
            {getFieldDecorator('companyAction', {
              initialValue: [],
            })(<Checkbox.Group options={plainOptions} onChange={this.handleAllCompany} />)}
          </Form.Item>
          <Form.Item label="企业分类">
            {getFieldDecorator('companyType', {
              initialValue: this.handleInitVal('companyType'),
            })(
              <Select>
                <Option value="1">计算机</Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Steps2;
