import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Popover, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './style.less';

const fieldLabels = {
  name: '项目名称',
  url: '一级分类',
  owner: '二级分类',
  approver: '责任单位',
  dateRange: '计划投资',
  type: '当年投资计划',
  name2: '截止年底完成市投资',
  title1: '市计划开工季度',
  title2: '市当年计划投资',
  title3: '市年度推进目标',
  title4: '项目性质(区)',
  title5: '计划总投资(区)',
  title6: '计划总投资中的政府资金(区)',
  title7: '当年投资计划总额(区)',
  title8: '当年投资计划政府资金(区)',
  title9: '年度建设计划一季度',
  title10: '年度建设计划二季度',
  title11: '年度将设计划三季度',
  title12: '年度建设计划四季度',
  title13: '牵头谷领导',
  title14: '年度',
};

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class AddItemTargetManage extends PureComponent {
  state = {
    width: '100%',
  };

  componentWillMount() {
    const { location } = this.props;
    const projectTarget = location.record !== undefined ? location.record : {};
    const pageState = location.pageState !== undefined ? location.pageState : 0;

    this.setState({
      record: projectTarget,
      pageState,
    });
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

  onSubmit = () => {
    const { dispatch } = this.props;
    const { record, pageState } = this.state;

    if (this.targetYear.state.value === null || this.targetYear.state.value.length <= 0) {
      message.warning('年份必填！');
      return;
    }
    const object = {
      projectName: this.projectName.state.value,
      firstClassify: this.firstClassify.state.value,
      secondClassify: this.secondClassify.state.value,
      respDept: this.respDept.state.value,
      planTotalInvest: this.planTotalInvest.state.value,
      planCurYearInvest: this.planCurYearInvest.state.value,
      finishCityInvest: this.finishCityInvest.state.value,
      cityPlanBeginQuarter: this.cityPlanBeginQuarter.state.value,
      cityPlanCurYearInvest: this.cityPlanCurYearInvest.state.value,
      cityActualValue: this.cityActualValue.state.value,

      areaProjectProperty: this.areaProjectProperty.state.value,
      areaPlanTotalInvest: this.areaPlanTotalInvest.state.value,
      areaPlanGovInvest: this.areaPlanGovInvest.state.value,
      areaPlanCurYearInvest: this.areaPlanCurYearInvest.state.value,
      areaPlanCurYearGovInvest: this.areaPlanCurYearGovInvest.state.value,

      firstSeasonWork: this.firstSeasonWork.state.value,
      secondSeasonWork: this.secondSeasonWork.state.value,
      thirdSeasonWork: this.thirdSeasonWork.state.value,
      fourthSeasonWork: this.fourthSeasonWork.state.value,

      leaderId: this.leaderId.state.value,
      targetYear: this.targetYear.state.value,
      targetProcessValue: document.getElementById('inputV1').value,
      targetProcessInvestValue: document.getElementById('inputN1').value,

      targetProcessValue2: document.getElementById('inputV2').value,
      targetProcessInvestValue2: document.getElementById('inputN2').value,

      targetProcessValue3: document.getElementById('inputV3').value,
      targetProcessInvestValue3: document.getElementById('inputN3').value,

      targetProcessValue4: document.getElementById('inputV4').value,
      targetProcessInvestValue4: document.getElementById('inputN4').value,

      targetProcessValue5: document.getElementById('inputV5').value,
      targetProcessInvestValue5: document.getElementById('inputN5').value,

      targetProcessValue6: document.getElementById('inputV6').value,
      targetProcessInvestValue6: document.getElementById('inputN6').value,

      targetProcessValue7: document.getElementById('inputV7').value,
      targetProcessInvestValue7: document.getElementById('inputN7').value,

      targetProcessValue8: document.getElementById('inputV8').value,
      targetProcessInvestValue8: document.getElementById('inputN8').value,

      targetProcessValue9: document.getElementById('inputV9').value,
      targetProcessInvestValue9: document.getElementById('inputN9').value,

      targetProcessValue10: document.getElementById('inputV10').value,
      targetProcessInvestValue10: document.getElementById('inputN10').value,

      targetProcessValue11: document.getElementById('inputV11').value,
      targetProcessInvestValue11: document.getElementById('inputN11').value,

      targetProcessValue12: document.getElementById('inputV12').value,
      targetProcessInvestValue12: document.getElementById('inputN12').value,
    };

    //  修改
    if (pageState === 1) {
      const editObject = {
        ...object,
        id: record.id,
        uid: record.uid,
      };
      dispatch({
        type: 'rule/updateProjectTargetYear',
        payload: editObject,
        callback: response => {
          if (response !== undefined) {
            router.goBack();
            message.success('修改成功');
          } else {
            message.error('修改失败');
          }
        },
      });
    } else {
      //  新增
      dispatch({
        type: 'rule/addProjectTargetYear',
        payload: object,
        callback: response => {
          if (response !== undefined) {
            router.goBack();
            message.success('添加成功');
          } else {
            message.error('添加失败');
          }
        },
      });
    }
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
    // router.push('/Economy/ItemTargetManage');
  };

  backFunction = () => {
    router.goBack();
  };

  processRender() {
    const { submitting } = this.props;
    const { record, pageState } = this.state;

    const yearLabels = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份'];
    const yearLabels2 = ['七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'];
    const processElement = yearLabels.map((yearStr, index) => (
      <Col span={4} key={yearStr}>
        <Form.Item label={yearStr}>
          <Input
            id={`inputV${index + 1}`}
            placeholder="请输入内容"
            defaultValue={record[`targetProcessValue${index === 0 ? '' : index + 1}`]}
            disabled={pageState === 2}
          />
          <Input
            id={`inputN${index + 1}`}
            placeholder="请输入内容"
            defaultValue={record[`targetProcessInvestValue${index === 0 ? '' : index + 1}`]}
            disabled={pageState === 2}
          />
        </Form.Item>
      </Col>
    ));
    const processElement2 = yearLabels2.map((yearStr, index) => (
      <Col span={4} key={yearStr}>
        <Form.Item label={yearStr}>
          <Input
            id={`inputV${index + 7}`}
            placeholder="请输入内容"
            defaultValue={record[`targetProcessValue${index + 7}`]}
            disabled={pageState === 2}
          />
          <Input
            id={`inputN${index + 7}`}
            placeholder="请输入内容"
            defaultValue={record[`targetProcessInvestValue${index + 7}`]}
            disabled={pageState === 2}
          />
        </Form.Item>
      </Col>
    ));

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

  render() {
    const { record, pageState } = this.state;
    let title = '新增项目目标';

    if (pageState === 1) {
      title = '修改项目目标';
    } else if (pageState === 2) {
      title = '查看项目目标';
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
                    placeholder="输入项目名称"
                    defaultValue={record.projectName}
                    ref={c => {
                      this.projectName = c;
                    }}
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.url}>
                  <Input
                    placeholder="输入产业发展类"
                    defaultValue={record.firstClassify}
                    ref={c => {
                      this.firstClassify = c;
                    }}
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>

              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.owner}>
                  <Input
                    placeholder="输入产业发展类"
                    defaultValue={record.secondClassify}
                    ref={c => {
                      this.secondClassify = c;
                    }}
                    disabled={pageState === 2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver}>
                  {
                    <Input
                      placeholder="请输入单位"
                      defaultValue={record.respDept}
                      ref={c => {
                        this.respDept = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.dateRange}>
                  {
                    <Input
                      placeholder="请输入投资额"
                      defaultValue={record.planTotalInvest}
                      ref={c => {
                        this.planTotalInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {
                    <Input
                      placeholder="请输入"
                      defaultValue={record.planCurYearInvest}
                      ref={c => {
                        this.planCurYearInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name2}>
                  {
                    <Input
                      placeholder="请输入"
                      defaultValue={record.finishCityInvest}
                      ref={c => {
                        this.finishCityInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>

              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.title1}>
                  {
                    <Input
                      placeholder="请输入"
                      defaultValue={record.cityPlanBeginQuarter}
                      ref={c => {
                        this.cityPlanBeginQuarter = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title2}>
                  {
                    <Input
                      placeholder="请输入"
                      defaultValue={record.cityPlanCurYearInvest}
                      ref={c => {
                        this.cityPlanCurYearInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.title3}>
                  {
                    <Input
                      placeholder="请输入"
                      defaultValue={record.cityActualValue}
                      ref={c => {
                        this.cityActualValue = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>

              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.title4}>
                  {
                    <Input
                      placeholder="输入项目性质"
                      defaultValue={record.areaProjectProperty}
                      ref={c => {
                        this.areaProjectProperty = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title5}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.areaPlanTotalInvest}
                      ref={c => {
                        this.areaPlanTotalInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.title6}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.areaPlanGovInvest}
                      ref={c => {
                        this.areaPlanGovInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>

              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.title7}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.areaPlanCurYearInvest}
                      ref={c => {
                        this.areaPlanCurYearInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title8}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.areaPlanCurYearGovInvest}
                      ref={c => {
                        this.areaPlanCurYearGovInvest = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.title9}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.firstSeasonWork}
                      ref={c => {
                        this.firstSeasonWork = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>

              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.title10}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.secondSeasonWork}
                      ref={c => {
                        this.secondSeasonWork = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title11}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.thirdSeasonWork}
                      ref={c => {
                        this.thirdSeasonWork = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.title12}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.fourthSeasonWork}
                      ref={c => {
                        this.fourthSeasonWork = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>

              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.title13}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.leaderId}
                      ref={c => {
                        this.leaderId = c;
                      }}
                      disabled={pageState === 2}
                    />
                  }
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title14}>
                  {
                    <Input
                      placeholder="输入"
                      defaultValue={record.targetYear}
                      ref={c => {
                        this.targetYear = c;
                      }}
                      disabled={pageState !== 0}
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
      </PageHeaderWrapper>
    );
  }
}

export default AddItemTargetManage;
