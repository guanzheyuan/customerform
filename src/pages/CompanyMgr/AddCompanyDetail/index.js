/* eslint-disable no-array-constructor */
import React, { Component, Fragment } from 'react';
import {
  Form,
  Card,
  Steps,
  Button,
  message,
  Input,
  Select,
  Row,
  Checkbox,
  Divider,
  Modal,
  Col,
} from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CompanyRow from './components/CompanyRow';
import Illustrate from './components/ Illustrate';
import AddCompanyRow from './components/AddCompanyRow';

import styles from './AddCompanyDetail.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;
const Layout = { 1: '一列', 2: '两列', 3: '三列', 4: '四列' };
const Type = { 1: '表单', 2: '列表', 3: '混合' };

const mapDispatchToProps = dispatch => {
  return {
    getElementDataSource: () => {
      dispatch({
        type: 'addcompany/getElementDataSource',
      });
    },
  };
};

@connect(
  ({ addcompany }) => ({ addcompany }),
  mapDispatchToProps
)
@Form.create()
class AddCompanyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      addElementVisible: false,
      addElementMerge: false,
    };
  }

  componentDidMount() {
    const { getElementDataSource } = this.props;
    getElementDataSource();
  }

  backFunction = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  backFunction = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  next = () => {
    const { current } = this.state;
    this.setState({ current: current + 1 });
  };

  prev = () => {
    const { current } = this.state;
    this.setState({ current: current - 1 });
  };

  showAddElement = () => {
    this.setState({ addElementVisible: true });
  };

  formLayerRender = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const config = {
      rules: [{ required: true, message: '请输入必填项' }],
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 8,
          offset: 5,
        },
      },
    };

    return (
      <Row style={{ paddingTop: 80, textAlign: 'center' }}>
        <Form {...formItemLayout}>
          <FormItem label="标签编码">
            {getFieldDecorator('labelEname', { ...config, initialValue: '' })(
              <Input placeholder="请输入标签编码" />
            )}
          </FormItem>
          <FormItem label="标签名称">
            {getFieldDecorator('labelCname', { ...config, initialValue: '' })(
              <Input placeholder="请输入标签名称" />
            )}
          </FormItem>
          <FormItem label="内容类型">
            {getFieldDecorator('type', { ...config, initialValue: '1' })(
              <Select>
                {Object.keys(Type).map(key => (
                  <Option key={key} value={key}>
                    {Type[key]}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="默认布局">
            {getFieldDecorator('layout', { ...config, initialValue: '2' })(
              <Select>
                {Object.keys(Layout).map(key => (
                  <Option key={key} value={key}>
                    {Layout[key]}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="" {...tailFormItemLayout}>
            {getFieldDecorator('is_valid', config)(<Checkbox>是否启用</Checkbox>)}
          </FormItem>
        </Form>
      </Row>
    );
  };

  bindElementRender = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const layoutId = getFieldValue('layout');
    return (
      <div className={styles.innerContent}>
        <Row style={{ fontSize: 16 }}>当前表单布局：{Layout[layoutId]}</Row>
        <Divider />
        <CompanyRow />
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={this.showAddElement}
        >
          添加
        </Button>
      </div>
    );
  };

  handleAddElementOk = () => {
    this.setState({ addElementVisible: false });
  };

  handleAddElementCancel = () => {
    this.setState({ addElementVisible: false });
  };

  mergeCol = e => {
    this.setState({ addElementMerge: e.target.checked });
  };

  elementRow = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { addElementMerge } = this.state;
    const layoutId = getFieldValue('layout');
    switch (layoutId) {
      case '1':
        return <AddCompanyRow {...this.props} />;
      case '2':
        return (
          <Fragment>
            <AddCompanyRow {...this.props} />
            {addElementMerge === true ? '' : <AddCompanyRow {...this.props} />}
            <Row>
              <Checkbox onChange={this.mergeCol}>合并列</Checkbox>
            </Row>
          </Fragment>
        );
      case '3':
        return (
          <Fragment>
            <AddCompanyRow {...this.props} />
            {addElementMerge === true ? (
              ''
            ) : (
              <Fragment>
                <AddCompanyRow {...this.props} />
                <AddCompanyRow {...this.props} />
              </Fragment>
            )}
            <Row>
              <Checkbox onChange={this.mergeCol}>合并列</Checkbox>
            </Row>
          </Fragment>
        );
      case '4':
        return (
          <Fragment>
            <AddCompanyRow {...this.props} />
            {addElementMerge === true ? (
              ''
            ) : (
              <Fragment>
                <AddCompanyRow {...this.props} />
                <AddCompanyRow {...this.props} />
                <AddCompanyRow {...this.props} />
              </Fragment>
            )}
            <Row>
              <Checkbox onChange={this.mergeCol}>合并列</Checkbox>
            </Row>
          </Fragment>
        );
      default:
        return '';
    }
  };

  addElementRender = () => {
    const { addElementVisible } = this.state;
    return (
      <Modal
        title="新增元素数据源"
        destroyOnClose
        visible={addElementVisible}
        onOk={this.handleAddElementOk}
        onCancel={this.handleAddElementCancel}
      >
        <Form>{this.elementRow()}</Form>
      </Modal>
    );
  };

  previewRender = () => {
    return (
      <div className={styles.innerContent}>
        <Row>
          <Col span={3} className={styles.name}>
            企业名称：
          </Col>
          <Col span={9}>中兴通讯科技股份有限公司</Col>
          <Col span={3} className={styles.name}>
            成立日期：
          </Col>
          <Col span={9}>1990-01-01</Col>
        </Row>
        <Row>
          <Col span={3} className={styles.name}>
            经营范围：
          </Col>
          <Col span={21}>
            通过激活系统的建设大大提升了业务开通的效率，简化了业务开通的过程，降低了服务开通系统的复杂度。提供灵活的SPI、NPI接口配置能力，极大地提高了新业务的推出速度
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { current } = this.state;
    const steps = [
      {
        title: '选择表单布局',
        content: this.formLayerRender(),
      },
      {
        title: '绑定元素数据源',
        content: this.bindElementRender(),
      },
      {
        title: '预览',
        content: this.previewRender(),
      },
    ];
    return (
      <PageHeaderWrapper title="新增标签" backFunction={this.backFunction} backBtnShow>
        <Card bordered={false}>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className={styles.stepsContent}>{steps[current].content}</div>
          <div className={styles.stepsAction}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                保存
              </Button>
            )}
            {current > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            )}
          </div>
          <Divider />
          <Illustrate />
        </Card>
        {this.addElementRender()}
      </PageHeaderWrapper>
    );
  }
}

export default AddCompanyDetail;
