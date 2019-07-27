import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

// import { interfaceDeclaration } from '@babel/types';

// import { push } from 'react-router-redux';
import styles from './style.less';

const { Option } = Select;

// eslint-disable-next-line no-unused-vars
let formData = {
  indexValue: {
    title: '核心指标',
    key: 1,
  },
  typeValue: {
    title: '创建名城建设',
    key: 1,
  },
  unitValue: {
    title: '万',
    key: 1,
  },
};

const fieldLabels = {
  name: '指标名称',
  url: '指标等级',
  owner: '指标类型',
  approver: '责任单位',
  dateRange: '谷目标',
  type: '单位',
  name2: '年份',
};

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class AdvancedForm extends PureComponent {
  state = {
    isRefresh: true,
    width: '100%',
    currentSelectIndex: {},
    monthValue: {
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
      input6: '',
      input7: '',
      input8: '',
      input9: '',
      input10: '',
      input11: '',
      input12: '',
    },
  };

  cashData = {
    allIndexInfoList: [],
  };

  componentWillMount() {
    const { location } = this.props;
    const doubtData = location.record !== undefined ? location.record : {};

    const pageState = location.pageState !== undefined ? location.pageState : 0;

    const response = location.response !== undefined ? location.response : 0;

    if (pageState === 0) {
      // 新增
      this.getAllIndexInfoList();
    }

    this.setState({
      record: doubtData,
      pageState,
      targetProcess: response,
    });

    let indexValue = {
      title: '核心指标',
      key: 1,
    };
    if (doubtData.indexLevel === '普通指标') {
      indexValue = {
        title: '普通指标',
        key: 2,
      };
    }
    let typeValue = {
      title: '创建名城建设',
      key: 1,
    };
    if (doubtData.indexType === '创建名城建设2') {
      typeValue = {
        title: '创建名城建设2',
        key: 2,
      };
    }
    let unitValue = {
      title: '万',
      key: 1,
    };
    if (doubtData.unit === '亿') {
      unitValue = {
        title: '亿',
        key: 2,
      };
    }
    formData = {
      indexValue,
      typeValue,
      unitValue,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // 获取全指标信息
  getAllIndexInfoList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/getJjyxidexinfoList',
      payload: {},
      callback: response => {
        this.cashData.allIndexInfoList = response;
        this.setState({
          currentSelectIndex: response[0],
        });
      },
    });
  };

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  onSubmit = () => {
    const value1 = document.getElementById('input1').value;
    const value2 = document.getElementById('input2').value;
    const value3 = document.getElementById('input3').value;
    const value4 = document.getElementById('input4').value;
    const value5 = document.getElementById('input5').value;
    const value6 = document.getElementById('input6').value;
    const value7 = document.getElementById('input7').value;
    const value8 = document.getElementById('input8').value;
    const value9 = document.getElementById('input9').value;
    const value10 = document.getElementById('input10').value;
    const value11 = document.getElementById('input11').value;
    const value12 = document.getElementById('input12').value;
    const { dispatch } = this.props;
    const targetValue = this.targetInput.state.value;
    const yearValue = this.yearInput.state.value;
    const object = {
      targetValue,
      unit: formData.unitValue.title,
      yearDate: yearValue,
      targetProcessValue: value1,
      targetProcessValue2: value2,
      targetProcessValue3: value3,
      targetProcessValue4: value4,
      targetProcessValue5: value5,
      targetProcessValue6: value6,
      targetProcessValue7: value7,
      targetProcessValue8: value8,
      targetProcessValue9: value9,
      targetProcessValue10: value10,
      targetProcessValue11: value11,
      targetProcessValue12: value12,
    };
    const { record, pageState, currentSelectIndex } = this.state;
    let indexId = record.id;
    const { targetId } = record;
    if (pageState === 0) {
      // 新增
      indexId = currentSelectIndex.id;
    }

    const editObject = {
      ...object,
      indexId,
      id: targetId,
    };
    if (pageState === 0) {
      // 新增
      dispatch({
        type: 'rule/addTargetYear',
        payload: editObject,
        callback: response => {
          if (response !== undefined) {
            router.goBack();
            // router.push('/Economy/TargetManage');
            message.success('新增成功');
          } else {
            message.error('新增失败');
          }
        },
      });
    } else {
      // 修改
      dispatch({
        type: 'rule/updateTargetYear',
        payload: editObject,
        callback: response => {
          if (response !== undefined) {
            router.goBack();
            // router.push('/Economy/TargetManage');
            message.success('修改成功');
          } else {
            message.error('修改失败');
          }
        },
      });
    }
  };

  handleCancle = () => {
    router.goBack();
    // router.push('/Economy/TargetManage');
  };

  backFunction = () => {
    router.goBack();
  };

  // 请选择指标
  onSelectIndex = value => {
    // console.log("value="+value);
    const { allIndexInfoList } = this.cashData;
    const currentSelectIndex = allIndexInfoList[value];
    this.setState({
      currentSelectIndex,
    });
  };

  onAver = () => {
    const targetValue = this.targetInput.state.value;
    const { monthValue } = this.state;
    let { isRefresh } = this.state;
    const averValue = (targetValue / 12).toFixed(2);
    for (let i = 0; i < 12; i += 1) {
      const key = `input${i + 1}`;
      monthValue[key] = averValue;
    }
    isRefresh = !isRefresh;
    this.setState({
      isRefresh,
    });
  };

  handleInputChange = e => {
    const key = e.currentTarget.id;
    const { monthValue } = this.state;
    let { isRefresh } = this.state;
    monthValue[key] = e.currentTarget.value;
    isRefresh = !isRefresh;
    this.setState({
      isRefresh,
    });
    // console.log("e ="+e+"text="+text);
  };

  processRender() {
    const {
      // form: { getFieldDecorator },
      submitting,
    } = this.props;

    const { targetProcess, pageState, monthValue } = this.state;

    const yearLabels = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份'];
    const yearLabels2 = ['七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'];
    let process = {};
    if (targetProcess !== undefined && targetProcess.length > 0) {
      [process] = targetProcess;
    } else {
      process = {};
    }

    const processElement = yearLabels.map((yearStr, index) => {
      const dValue = process[`targetProcessValue${index === 0 ? '' : index + 1}`];
      let element = (
        <Col span={4} key={yearStr}>
          <Form.Item label={yearStr}>
            <Input
              id={`input${index + 1}`}
              placeholder="请输入内容"
              defaultValue={dValue}
              disabled={pageState === 2}
            />
          </Form.Item>
        </Col>
      );
      if (pageState === 0) {
        const key = `input${index + 1}`;
        const value = monthValue[key];
        element = (
          <Col span={4} key={yearStr}>
            <Form.Item label={yearStr}>
              <Input
                id={`input${index + 1}`}
                placeholder="请输入内容"
                defaultValue={dValue}
                disabled={pageState === 2}
                onChange={this.handleInputChange}
                value={value}
              />
            </Form.Item>
          </Col>
        );
      }
      return element;
    });
    const processElement2 = yearLabels2.map((yearStr, index) => {
      let element = (
        <Col span={4} key={yearStr}>
          <Form.Item label={yearStr}>
            <Input
              id={`input${index + 7}`}
              placeholder="请输入内容"
              defaultValue={process[`targetProcessValue${index + 7}`]}
              disabled={pageState === 2}
              onChange={this.handleInputChange}
            />
          </Form.Item>
        </Col>
      );

      if (pageState === 0) {
        const key = `input${index + 7}`;
        const value = monthValue[key];
        element = (
          <Col span={4} key={yearStr}>
            <Form.Item label={yearStr}>
              <Input
                id={`input${index + 7}`}
                placeholder="请输入内容"
                disabled={pageState === 2}
                onChange={this.handleInputChange}
                value={value}
              />
            </Form.Item>
          </Col>
        );
      }
      return element;
    });

    let element = (
      <div style={{ marginRight: 0, marginLeft: 0 }}>
        <Row gutter={16}>{processElement}</Row>
        <Row gutter={16}>{processElement2}</Row>

        <div style={{ marginLeft: -25, marginRight: -25, height: 1, backgroundColor: '#dddddd' }} />

        <Button
          style={{ marginTop: 20, marginRight: 25, float: 'right' }}
          onClick={this.handleCancle}
          loading={submitting}
        >
          取消
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 20, marginRight: 20, float: 'right' }}
          onClick={this.onSubmit}
          loading={submitting}
        >
          提交
        </Button>
      </div>
    );

    if (pageState === 2) {
      element = (
        <div style={{ marginRight: 0, marginLeft: 0 }}>
          <Row gutter={16}>{processElement}</Row>
          <Row gutter={16}>{processElement2}</Row>
        </div>
      );
    }

    return element;
  }

  // 绘制指标下拉框
  renderIndexList() {
    const { allIndexInfoList } = this.cashData;
    const element = allIndexInfoList.map((indexInfo, index) => {
      const key = `indexInfo${index}`;
      const { indexName } = indexInfo;
      const optionElement = (
        <Option key={key} value={index}>
          {indexName}
        </Option>
      );
      return optionElement;
    });
    return element;
  }

  render() {
    // const {
    //   form: { getFieldDecorator },
    //   submitting,
    // } = this.props;
    // const { width } = this.state;
    const date = new Date();
    const year = date.getFullYear();

    const { record, pageState, currentSelectIndex } = this.state;
    let { indexName, indexLevel, indexType, respDept, targetValue, unit, yearDate } = record;

    if (pageState === 0) {
      // 新增
      // {indexName,indexLevel,indexType,respDept,targetValue,unit,yearDate} = currentSelectIndex;
      // eslint-disable-next-line prefer-destructuring
      indexName = currentSelectIndex.indexName;
      // eslint-disable-next-line prefer-destructuring
      indexLevel = currentSelectIndex.indexLevel;
      // eslint-disable-next-line prefer-destructuring
      indexType = currentSelectIndex.indexType;
      // eslint-disable-next-line prefer-destructuring
      respDept = currentSelectIndex.respDept;
      targetValue = '';
      // eslint-disable-next-line prefer-destructuring
      unit = currentSelectIndex.unit;
      yearDate = year;
    }
    const indexList = this.renderIndexList();

    let title = '新增指标目标';
    if (pageState === 1) {
      title = '修改指标目标';
    } else if (pageState === 2) {
      title = '查看指标目标';
    }

    let averElement = null;
    if (pageState === 0) {
      averElement = <Button onClick={this.onAver}>年目标均分</Button>;
    }

    return (
      <PageHeaderWrapper
        title={title}
        wrapperClassName={styles.advancedForm}
        backFunction={this.backFunction}
        backBtnShow
      >
        <Card title="目标信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  <Select
                    placeholder="请选择指标"
                    value={indexName}
                    disabled={pageState !== 0}
                    onChange={this.onSelectIndex}
                  >
                    {indexList}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.url}>
                  <Input placeholder="请选择指标等级" value={indexLevel} disabled />
                </Form.Item>
              </Col>

              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.owner}>
                  <Input placeholder="请选择指标类型" value={indexType} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver}>
                  {
                    <Input
                      placeholder=""
                      value={respDept}
                      ref={c => {
                        this.deptInput = c;
                      }}
                      disabled
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.dateRange}>
                  {
                    <Input
                      placeholder="请输入谷目标"
                      defaultValue={targetValue}
                      ref={c => {
                        this.targetInput = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  <Input placeholder="请选择单位" value={unit} disabled />
                </Form.Item>
              </Col>

              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name2}>
                  {
                    <Input
                      placeholder="请输入年份"
                      defaultValue={yearDate}
                      ref={c => {
                        this.yearInput = c;
                      }}
                      disabled={pageState !== 0}
                    />
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="进度指标" className={styles.card} bordered={false} extra={averElement}>
          {this.processRender()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
