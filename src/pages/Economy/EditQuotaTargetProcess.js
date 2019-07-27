import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
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
class EditQuotaTargetProcess extends PureComponent {
  cashData = {
    monthSelect: 0,
    monthValue: 0,
  };

  state = {
    isRefresh: true,
    width: '100%',
  };

  componentWillMount() {
    const { location } = this.props;
    const doubtData = location.record !== undefined ? location.record : {};
    const pageState = location.pageState !== undefined ? location.pageState : 0;
    // 初始化月份
    const date = new Date();
    const monthr = date.getMonth();
    const selectMonth = monthr;
    this.cashData.monthSelect = selectMonth;
    this.cashData.monthValue = 0;

    this.setState({
      record: doubtData,
      pageState,
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

  monthSelectF = value => {
    const monthSelect = value;
    this.cashData.monthSelect = monthSelect;
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
    const { record, isRefresh } = this.state;
    const { dispatch } = this.props;
    const selectMonth = this.cashData.monthSelect + 1;
    const monthValue = this.monthValue.state.value;
    const dto = {};
    const key = `actualProcessValue${selectMonth}`;
    dto[key] = monthValue;
    dto.indexTargetId = record.targetId;
    //  const acValue =  record[`actualProcessValue${index + 1}`];
    dispatch({
      type: 'economyRule/adupIndexActualProcess',
      payload: dto,
      callback: response => {
        if (response !== undefined) {
          record[`actualProcessValue${selectMonth}`] = monthValue;
          this.setState({
            isRefresh: !isRefresh,
            record,
          });
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      },
    });
  };

  handleCancle = () => {
    router.goBack();
    // router.push('/Economy/QuotaTargetProcessManage');
  };

  backFunction = () => {
    router.goBack();
  };

  processWrite = () => {
    const { pageState, record } = this.state;
    const monthOptions = [
      '一月份',
      '二月份',
      '三月份',
      '四月份',
      '五月份',
      '六月份',
      '七月份',
      '八月份',
      '九月份',
      '十月份',
      '十一月份',
      '十二月份',
    ];
    const date = new Date();
    const monthr = date.getMonth();
    const monthn = monthOptions[monthr];

    const monthOptionsElement = monthOptions.map((month, index) => {
      const keyValue = `${index}`;
      const element = (
        <Option key={keyValue} value={index}>
          {month}
        </Option>
      );
      return element;
    });

    const element = (
      <div>
        <Row>
          <h1>填报频率：月</h1>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <h1>
              填报月:
              <Select
                style={{ width: 120 }}
                placeholder="选择填报月"
                defaultValue={monthn}
                onChange={this.monthSelectF}
                ref={c => {
                  this.monthSelect = c;
                }}
              >
                {monthOptionsElement}
              </Select>
            </h1>
          </Col>
          <Col span={8}>
            <h1>
              指标名称:
              <Input style={{ width: 180 }} placeholder="" value={record.indexName} disabled />
            </h1>
          </Col>
          <Col span={8}>
            <h1>
              本月进度:
              <Input
                style={{ width: 180 }}
                placeholder=""
                defaultValue=""
                ref={c => {
                  this.monthValue = c;
                }}
              />
            </h1>
          </Col>
        </Row>
      </div>
    );

    let processWriteElement = (
      <div>
        {element}
        <div style={{ marginLeft: -25, marginRight: -25, height: 1, backgroundColor: '#dddddd' }} />
        <Button
          style={{ marginTop: 20, marginRight: 25, float: 'right' }}
          onClick={this.handleCancle}
        >
          取消
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 20, marginRight: 20, float: 'right' }}
          onClick={this.onSubmit}
        >
          提交
        </Button>
      </div>
    );
    if (pageState === 2) {
      processWriteElement = <div style={{ marginRight: 0, marginLeft: 0 }}>{element}</div>;
    }

    return processWriteElement;
  };

  processRender() {
    const { record } = this.state;

    const yearLabels = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份'];
    const yearLabels2 = ['七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'];
    // let process = {};
    // if (record !== undefined && record.length > 0) {
    //   [process] = targetProcess;
    // } else {
    //   process = {};
    // }

    const processElement = yearLabels.map((yearStr, index) => {
      const dValue = record[`targetProcessValue${index + 1}`];
      const acValue = record[`actualProcessValue${index + 1}`];
      let element = (
        <Col span={4} key={yearStr}>
          <Form.Item label={yearStr}>
            <Input id={`input${index + 1}`} placeholder="请输入内容" value={dValue} disabled />
            <Input id={`inputs${index + 1}`} placeholder="请输入实际" value={acValue} disabled />
          </Form.Item>
        </Col>
      );

      if (index === 0) {
        element = (
          <Col span={4} key={yearStr}>
            <Form.Item label={yearStr}>
              <Row gutter={2}>
                <Col span={4}>
                  <h0>目标</h0>
                </Col>
                <Col span={20}>
                  <Input
                    id={`input${index + 1}`}
                    placeholder="请输入内容"
                    value={dValue}
                    disabled
                  />
                </Col>
              </Row>
              <Row gutter={2}>
                <Col span={4}>
                  <h0>实际</h0>
                </Col>
                <Col span={20}>
                  <Input
                    id={`inputs${index + 1}`}
                    placeholder="请输入实际"
                    value={acValue}
                    disabled
                  />
                </Col>
              </Row>
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
              value={record[`targetProcessValue${index + 7}`]}
              disabled
              onChange={this.handleInputChange}
            />
            <Input
              id={`inputs${index + 7}`}
              placeholder="请输入实际"
              value={record[`actualProcessValue${index + 7}`]}
              disabled
            />
          </Form.Item>
        </Col>
      );
      if (index === 0) {
        element = (
          <Col span={4} key={yearStr}>
            <Form.Item label={yearStr}>
              <Row gutter={2}>
                <Col span={4}>
                  <h0>目标</h0>
                </Col>
                <Col span={20}>
                  <Input
                    id={`input${index + 7}`}
                    placeholder="请输入内容"
                    value={record[`targetProcessValue${index + 7}`]}
                    disabled
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
              <Row gutter={2}>
                <Col span={4}>
                  <h0>实际</h0>
                </Col>
                <Col span={20}>
                  <Input
                    id={`inputs${index + 7}`}
                    placeholder="请输入实际"
                    value={record[`actualProcessValue${index + 7}`]}
                    disabled
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        );
      }

      return element;
    });

    const element = (
      <div style={{ marginRight: 0, marginLeft: 0 }}>
        <Row gutter={16}>{processElement}</Row>
        <Row gutter={16}>{processElement2}</Row>
      </div>
    );

    return element;
  }

  render() {
    const { record, pageState } = this.state;
    let title = '填报指标目标进度';
    if (pageState === 1) {
      title = '填报指标目标进度';
    } else if (pageState === 2) {
      title = '查看指标目标进度';
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
                  <Input
                    placeholder="输入指标名称"
                    defaultValue={record.indexName}
                    ref={c => {
                      this.indexName = c;
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.url}>
                  <Select placeholder="请选择指标等级" defaultValue={record.indexLevel} disabled>
                    <Option key="1" value="1">
                      核心指标
                    </Option>
                    <Option key="2" value="2">
                      普通指标
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.owner}>
                  <Select placeholder="请选择指标类型" defaultValue={record.indexType} disabled>
                    <Option key="1" value="1">
                      创建名城建设
                    </Option>
                    <Option key="2" value="2">
                      创建名城建设2
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver}>
                  {
                    <Input
                      placeholder=""
                      defaultValue={record.respDept}
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
                      defaultValue={record.targetValue}
                      ref={c => {
                        this.targetInput = c;
                      }}
                      disabled
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {
                    <Select
                      placeholder="请选择单位"
                      defaultValue={record.unit}
                      onChange={this.unitSelectChange}
                      disabled
                    >
                      <Option key="1" value="1">
                        万
                      </Option>
                      <Option key="2" value="2">
                        亿
                      </Option>
                    </Select>
                  }
                </Form.Item>
              </Col>

              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name2}>
                  {
                    <Input
                      placeholder="请输入年份"
                      defaultValue={record.yearDate}
                      ref={c => {
                        this.yearInput = c;
                      }}
                      disabled
                    />
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="进度指标" className={styles.card} bordered={false}>
          {this.processRender()}
        </Card>
        <Card title="指标进度填报" className={styles.card} bordered={false}>
          {this.processWrite()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditQuotaTargetProcess;
