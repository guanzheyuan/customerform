import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

// const { RangePicker } = DatePicker;
const fieldLabels = {
  name: '指标名称',
  url: '指标等级',
  owner: '指标类型',
  approver: '责任单位',
  dateRange: '指标编码',
  type: '单位',
  name2: '创建年份',
};
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

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class AddQuotaManage extends PureComponent {
  state = {
    width: '100%',
  };

  componentWillMount() {
    const { location } = this.props;

    const doubtData = location.record !== undefined ? location.record : {};

    const pageState = location.pageState !== undefined ? location.pageState : 0;

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

  handleCancle = () => {
    router.goBack();
    // router.push('/Economy/QuotaManage');
  };

  backFunction = () => {
    router.goBack();
  };

  onSubmit = () => {
    const { dispatch } = this.props;
    const indexName = this.indexName.state.value;
    const deptValue = this.deptInput.state.value;
    const targetValue = this.targetInput.state.value;
    const yearValue = this.yearInput.state.value;
    const indexLevel = this.indexLevel.state.value;
    const indexType = this.indexType.state.value;

    if (yearValue === null || yearValue.length <= 0) {
      message.warning('年份必填！');
      return;
    }

    const object = {
      indexName,
      indexLevel,
      indexType,
      respDept: deptValue,
      uid: targetValue,
      unit: formData.unitValue.title,
      yearDate: yearValue,
    };
    const { record, pageState } = this.state;

    //  修改
    if (pageState === 1) {
      const editObject = {
        ...object,
        id: record.id,
      };
      dispatch({
        type: 'rule/updateJjyxidexinfo',
        payload: editObject,
        callback: response => {
          if (response !== undefined) {
            router.goBack();
            // router.push('/Economy/QuotaManage');
            message.success('修改成功');
          } else {
            message.error('修改失败');
          }
        },
      });
    } else {
      //  新增
      dispatch({
        type: 'rule/addJjyxidexinfo',
        payload: object,
        callback: response => {
          if (response !== undefined) {
            router.goBack();
            // message.success('添加成功');
          } else {
            message.error('添加失败');
          }
        },
      });
    }
  };

  indexSelectChange = value => {
    let indexObject = {};
    if (value === 1) {
      indexObject = {
        key: value,
        title: '核心指标',
      };
    } else {
      indexObject = {
        key: value,
        title: '普通指标',
      };
    }
    formData.indexValue = indexObject;
  };

  typeSelectChange = value => {
    let indexObject = {};
    if (value === 1) {
      indexObject = {
        key: value,
        title: '创建名城建设',
      };
    } else {
      indexObject = {
        key: value,
        title: '创建名城建设2',
      };
    }
    formData.typeValue = indexObject;
  };

  unitSelectChange = value => {
    let indexObject = {};
    if (value === 1) {
      indexObject = {
        key: value,
        title: '万',
      };
    } else {
      indexObject = {
        key: value,
        title: '亿',
      };
    }
    formData.unitValue = indexObject;
  };

  processRender() {
    const {
      // form: { getFieldDecorator },
      submitting,
    } = this.props;

    const { pageState } = this.state;

    let element = (
      <div>
        <div
          style={{ marginLeft: -25, marginRight: -25, height: '1.1px', backgroundColor: '#dddddd' }}
        />
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
    //  查看
    if (pageState === 2) {
      element = <div />;
    }

    return element;
  }

  render() {
    const { record, pageState } = this.state;
    const date = new Date();
    const year = date.getFullYear();

    let title = '新增指标管理';
    if (pageState === 1) {
      title = '修改指标管理';
    } else if (pageState === 2) {
      title = '查看指标管理';
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
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.url}>
                  <Input
                    placeholder="输入指标等级"
                    defaultValue={record.indexLevel}
                    ref={c => {
                      this.indexLevel = c;
                    }}
                    disabled={pageState === 2}
                  />

                  {/* <Select
                    placeholder="请选择指标等级"
                    defaultValue={record.indexLevel}
                    onChange={this.indexSelectChange}
                    disabled={pageState === 2}
                  >
                    <Option value="1">核心指标</Option>
                    <Option value="2">普通指标</Option>
                  </Select> */}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.owner}>
                  <Input
                    placeholder="输入指标类型"
                    defaultValue={record.indexType}
                    ref={c => {
                      this.indexType = c;
                    }}
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver}>
                  <Input
                    placeholder=""
                    defaultValue={record.respDept}
                    ref={c => {
                      this.deptInput = c;
                    }}
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.dateRange}>
                  <Input
                    placeholder="请输入指标编码"
                    defaultValue={record.uid}
                    ref={c => {
                      this.targetInput = c;
                    }}
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {
                    <Select
                      placeholder="请选择单位"
                      defaultValue={record.unit}
                      onChange={this.unitSelectChange}
                      disabled={pageState === 2}
                    >
                      <Option value="1">万</Option>
                      <Option value="2">亿</Option>
                    </Select>
                  }
                </Form.Item>
              </Col>

              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name2}>
                  {
                    <Input
                      placeholder="指标创建年份"
                      defaultValue={year}
                      ref={c => {
                        this.yearInput = c;
                      }}
                      disabled
                    />
                  }
                </Form.Item>
              </Col>
            </Row>
            {this.processRender()}
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddQuotaManage;
