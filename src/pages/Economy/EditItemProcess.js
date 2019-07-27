import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, Radio, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TextArea from 'antd/lib/input/TextArea';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const fieldLabels = {
  name: '项目名称',
  url: '一级分类',
  owner: '二级分类',
  approver: '责任单位',
  dateRange: '项目建设内容和规模',
  title1: '计划总投资',
  title2: '年度计划投资',
  title3: '计划开工季度',
  title4: '计划开工月份',
};

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class EditItemProcess extends PureComponent {
  state = {
    width: '100%',
    radioValue: 1,
  };

  componentWillMount() {
    const { location } = this.props;
    const projectTarget = location.record !== undefined ? location.record : {};

    const pageState = location.pageState !== undefined ? location.pageState : 0;
    const response = location.response !== undefined ? location.response : 0;

    this.setState({
      record: projectTarget,
      pageState,
      actualProcess: response,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onSubmit = () => {
    const { dispatch } = this.props;

    const { record } = this.state;

    const object = {
      projectYearTargetId: record.id,
      processPeriod: record.targetYear,
      actualProcessValue: document.getElementById('inputV1').value,
      actualProcessInvestValue: document.getElementById('inputN1').value,

      actualProcessValue2: document.getElementById('inputV2').value,
      actualProcessInvestValue2: document.getElementById('inputN2').value,

      actualProcessValue3: document.getElementById('inputV3').value,
      actualProcessInvestValue3: document.getElementById('inputN3').value,

      actualProcessValue4: document.getElementById('inputV4').value,
      actualProcessInvestValue4: document.getElementById('inputN4').value,

      actualProcessValue5: document.getElementById('inputV5').value,
      actualProcessInvestValue5: document.getElementById('inputN5').value,

      actualProcessValue6: document.getElementById('inputV6').value,
      actualProcessInvestValue6: document.getElementById('inputN6').value,

      actualProcessValue7: document.getElementById('inputV7').value,
      actualProcessInvestValue7: document.getElementById('inputN7').value,

      actualProcessValue8: document.getElementById('inputV8').value,
      actualProcessInvestValue8: document.getElementById('inputN8').value,

      actualProcessValue9: document.getElementById('inputV9').value,
      actualProcessInvestValue9: document.getElementById('inputN9').value,

      actualProcessValue10: document.getElementById('inputV10').value,
      actualProcessInvestValue10: document.getElementById('inputN10').value,

      actualProcessValue11: document.getElementById('inputV11').value,
      actualProcessInvestValue11: document.getElementById('inputN11').value,

      actualProcessValue12: document.getElementById('inputV12').value,
      actualProcessInvestValue12: document.getElementById('inputN12').value,
    };

    //  新增
    dispatch({
      type: 'rule/addProjectActualProcess',
      payload: object,
      callback: response => {
        if (response !== undefined) {
          router.goBack();
          // router.push('/Economy/ItemProcessManage');
          message.success('填报成功');
        } else {
          message.error('填报失败');
        }
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

  handleCancle = () => {
    router.goBack();
    // router.push('/Economy/ItemProcessManage');
  };

  backFunction = () => {
    router.goBack();
  };

  onRadioChange = e => {
    this.setState({
      radioValue: e.target.value,
    });
  };

  reportArea() {
    const { submitting } = this.props;
    const { pageState } = this.state;
    let element = (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <Col span={12}>填报月份:</Col>
            <Col span={12}>
              <Input placeholder="请输入填报月份" defaultValue="六月份" />
            </Col>
          </Col>
          <Col span={6}>
            <Col span={12}>固投(亿):</Col>
            <Col span={12}>
              <Input placeholder="请输入固投额" defaultValue="900" />
            </Col>
          </Col>

          <Col span={6}>
            <Col span={12}>进度:</Col>
            <Col span={12}>
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入进度" />
            </Col>
          </Col>

          <Col span={6}>
            <Col span={12}>项目延迟原因:</Col>
            <Col span={12}>
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入延迟原因" />
            </Col>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={6}>
            <Col span={12}>需要协调:</Col>
            <Col span={12}>
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />
            </Col>
          </Col>

          <Col span={6}>
            <Col span={12}>责任部门:</Col>
            <Col span={12}>
              <Input placeholder="请输入固投额" defaultValue="战发局" disabled />
            </Col>
          </Col>
        </Row>
        <p />
        <div
          style={{ marginLeft: -25, marginRight: -25, height: 1.2, backgroundColor: '#dddddd' }}
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

    if (pageState === 2) {
      element = (
        <div>
          <Row gutter={10}>
            <Col span={6}>
              <Col span={12}>填报月份:</Col>
              <Col span={12}>
                <Input placeholder="请输入填报月份" defaultValue="六月份" />
              </Col>
            </Col>
            <Col span={6}>
              <Col span={12}>固投(亿):</Col>
              <Col span={12}>
                <Input placeholder="请输入固投额" defaultValue="900" />
              </Col>
            </Col>

            <Col span={6}>
              <Col span={12}>进度:</Col>
              <Col span={12}>
                <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入进度" />
              </Col>
            </Col>

            <Col span={6}>
              <Col span={12}>项目延迟原因:</Col>
              <Col span={12}>
                <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入延迟原因" />
              </Col>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={6}>
              <Col span={12}>需要协调:</Col>
              <Col span={12}>
                <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />
              </Col>
            </Col>

            <Col span={6}>
              <Col span={12}>责任部门:</Col>
              <Col span={12}>
                <Input placeholder="请输入固投额" defaultValue="战发局" disabled />
              </Col>
            </Col>
          </Row>
        </div>
      );
    }

    return element;
  }

  processRender() {
    const { radioValue } = this.state;
    const { record, pageState, actualProcess } = this.state;

    let process = {};
    if (actualProcess !== undefined && actualProcess.length > 0) {
      [process] = actualProcess;
    } else {
      process = {};
    }

    const yearLabels = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份'];
    const yearLabels2 = ['七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'];
    const processElement = yearLabels.map((yearStr, index) => {
      if (index === 0) {
        const element = (
          <Col span={4} key={yearStr}>
            <Form.Item label={yearStr}>
              <Row gutter={5}>
                <Col span={6}>
                  <Col span={24}>
                    <p />
                    进度
                  </Col>
                </Col>
                <Col span={18}>
                  <Col span={12}>
                    目标
                    <TextArea
                      autosize={{ minRows: 2, maxRows: 6 }}
                      placeholder="目标"
                      defaultValue={record[`targetProcessValue${index === 0 ? '' : index + 1}`]}
                      disabled
                    />
                  </Col>
                  <Col span={12}>
                    实际
                    <TextArea
                      id={`inputV${index + 1}`}
                      autosize={{ minRows: 2, maxRows: 6 }}
                      placeholder="实际"
                      defaultValue={process[`actualProcessValue${index === 0 ? '' : index + 1}`]}
                      disabled={pageState === 2}
                    />
                  </Col>
                </Col>
              </Row>
              <p />
              <Row gutter={5}>
                <Col span={6}>投资量</Col>
                <Col span={18}>
                  <Col span={12}>
                    <Input
                      placeholder="投资量"
                      defaultValue={
                        record[`targetProcessInvestValue${index === 0 ? '' : index + 1}`]
                      }
                      disabled
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      id={`inputN${index + 1}`}
                      placeholder="投资量"
                      defaultValue={
                        process[`actualProcessInvestValue${index === 0 ? '' : index + 1}`]
                      }
                      disabled={pageState === 2}
                    />
                  </Col>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        );
        return element;
      }
      const element = (
        <Col span={4} key={yearStr}>
          <Form.Item label={yearStr}>
            <Row gutter={5}>
              <Col span={12}>
                目标
                <TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  placeholder="目标"
                  defaultValue={record[`targetProcessValue${index === 0 ? '' : index + 1}`]}
                  disabled
                />
              </Col>
              <Col span={12}>
                实际
                <TextArea
                  id={`inputV${index + 1}`}
                  autosize={{ minRows: 2, maxRows: 6 }}
                  placeholder="实际"
                  defaultValue={process[`actualProcessValue${index === 0 ? '' : index + 1}`]}
                  disabled={pageState === 2}
                />
              </Col>
            </Row>
            <p />
            <Row gutter={5}>
              <Col>
                <Col span={12}>
                  <Input
                    placeholder="投资量"
                    defaultValue={record[`targetProcessInvestValue${index === 0 ? '' : index + 1}`]}
                    disabled
                  />
                </Col>
                <Col span={12}>
                  <Input
                    id={`inputN${index + 1}`}
                    placeholder="投资量"
                    disabled={pageState === 2}
                    defaultValue={
                      process[`actualProcessInvestValue${index === 0 ? '' : index + 1}`]
                    }
                  />
                </Col>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      );
      return element;
    });
    const processElement2 = yearLabels2.map((yearStr, index) => {
      if (index === 0) {
        const element = (
          <Col span={4} key={yearStr}>
            <Form.Item label={yearStr}>
              <Row gutter={5}>
                <Col span={6}>
                  <Col span={24}>
                    <p />
                    进度
                  </Col>
                </Col>
                <Col span={18}>
                  <Col span={12}>
                    目标
                    <TextArea
                      autosize={{ minRows: 2, maxRows: 6 }}
                      placeholder="目标"
                      defaultValue={record[`targetProcessValue${index + 7}`]}
                      disabled
                    />
                  </Col>
                  <Col span={12}>
                    实际
                    <TextArea
                      id={`inputV${index + 7}`}
                      autosize={{ minRows: 2, maxRows: 6 }}
                      placeholder="实际"
                      defaultValue={process[`actualProcessValue${index + 7}`]}
                      disabled={pageState === 2}
                    />
                  </Col>
                </Col>
              </Row>
              <p />
              <Row gutter={5}>
                <Col span={6}>投资量</Col>
                <Col span={18}>
                  <Col span={12}>
                    <Input
                      placeholder="投资量"
                      defaultValue={record[`targetProcessInvestValue${index + 7}`]}
                      disabled
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      id={`inputN${index + 7}`}
                      placeholder="投资量"
                      defaultValue={process[`actualProcessInvestValue${index + 7}`]}
                      disabled={pageState === 2}
                    />
                  </Col>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        );
        return element;
      }
      const element = (
        <Col span={4} key={yearStr}>
          <Form.Item label={yearStr}>
            <Row gutter={5}>
              <Col span={12}>
                目标
                <TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  placeholder="目标"
                  defaultValue={record[`targetProcessValue${index + 7}`]}
                  disabled
                />
              </Col>
              <Col span={12}>
                实际
                <TextArea
                  id={`inputV${index + 7}`}
                  autosize={{ minRows: 2, maxRows: 6 }}
                  placeholder="实际"
                  defaultValue={process[`actualProcessValue${index + 7}`]}
                  disabled={pageState === 2}
                />
              </Col>
            </Row>
            <p />
            <Row gutter={5}>
              <Col>
                <Col span={12}>
                  <Input
                    placeholder="投资量"
                    defaultValue={record[`targetProcessInvestValue${index + 7}`]}
                    disabled
                  />
                </Col>
                <Col span={12}>
                  <Input
                    id={`inputN${index + 7}`}
                    placeholder="投资量"
                    defaultValue={process[`actualProcessInvestValue${index + 7}`]}
                    disabled={pageState === 2}
                  />
                </Col>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      );
      return element;
    });

    // 项目状态

    const projectState = (
      <div>
        <Row gutter={10}>
          <h1>项目状态</h1>
        </Row>
        <Row gutter={10}>
          <Col span={6}>
            <Select placeholder="请选择月份" defaultValue="三月份">
              <Option value="1">三月份</Option>
              <Option value="2">五月份</Option>
              <Option value="2">六月份</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Row gutter={10}>
              <Col span={8}>是否延迟:</Col>
              <Col span={16}>
                <Radio.Group onChange={this.onRadioChange} value={radioValue}>
                  <Radio value={1}>正常</Radio>
                  <Radio value={2}>延迟</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={8}>责任部门:</Col>
              <Col span={16}>
                <Input placeholder="" defaultValue="战发局" disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Col span={8}>项目延迟原因:</Col>
            <Col span={16}>
              {' '}
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入原因" />
            </Col>
          </Col>
          <Col span={6}>
            <Col span={8}>需要协调:</Col>
            <Col span={16}>
              {' '}
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入协调原因" />
            </Col>
          </Col>
        </Row>
      </div>
    );

    const element = (
      <div style={{ marginRight: 0, marginLeft: 0 }}>
        <Row gutter={5}>{processElement}</Row>
        <Row gutter={5}>{processElement2}</Row>
        <Row gutter={10}>{projectState}</Row>
      </div>
    );

    return element;
  }

  render() {
    const { record, pageState } = this.state;
    let title = '修改项目进度';
    if (pageState === 1) {
      title = '修改项目进度';
    } else if (pageState === 2) {
      title = '查看项目进度';
    }

    return (
      <PageHeaderWrapper
        title={title}
        wrapperClassName={styles.advancedForm}
        backFunction={this.backFunction}
        backBtnShow
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  <Input placeholder="" defaultValue={record.projectName} disabled />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.url}>
                  <Input placeholder="" defaultValue={record.firstClassify} disabled />
                </Form.Item>
              </Col>

              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.owner}>
                  <Input defaultValue={record.secondClassify} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver}>
                  <Input placeholder="" defaultValue={record.respDept} disabled />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.dateRange}>
                  <Input
                    placeholder=""
                    defaultValue="占地面积15亩，建成后用于智能机器人的研发和办公。"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="项目计划" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.title1}>
                  <Input placeholder="" defaultValue={record.planTotalInvest} disabled />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.title2}>
                  <Input placeholder="" defaultValue={record.planCurYearInvest} disabled />
                </Form.Item>
              </Col>

              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title3}>
                  <Input placeholder="" defaultValue={record.cityPlanBeginQuarter} disabled />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.title4}>
                  <Select placeholder="请选择" defaultValue="2月份">
                    <Option value="1">1月份</Option>
                    <Option value="2">2月份</Option>
                    <Option value="2">3月份</Option>
                    <Option value="2">4月份</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}
          </Form>
        </Card>

        <Card title="项目进度信息展示区" className={styles.card} bordered={false}>
          {this.processRender()}
        </Card>
        <Card title="项目进度填报区" className={styles.card} bordered={false}>
          {this.reportArea()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditItemProcess;
