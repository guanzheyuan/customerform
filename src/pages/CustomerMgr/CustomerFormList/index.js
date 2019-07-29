import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Row,
  Col,
  Button,
  Input,
  Table,
  Modal,
  DatePicker,
  Divider,
  Popconfirm,
  Select,
} from 'antd';
import moment from 'moment';

import styles from './style.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ customerFormList, loading }) => ({
  customerFormList,
  loading: loading.effects['customerFormList/qryList'],
}))
class CustomerFormList extends Component {
  columns = [
    {
      title: '事项名称',
      dataIndex: 'name',
    },
    {
      title: '表单版本',
      dataIndex: 'version',
    },
    {
      title: '配置时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: text => {
        switch (text) {
          case 'A':
            return '有效';
          default:
            return '无效';
        }
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        const { formType } = record;
        if (formType === 'UED') {
          return (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.updateFormData(record, false)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定删除?"
                onConfirm={() => {
                  this.handleDelete(record.id);
                }}
              >
                <a href="#">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.updateFormData(record, false)}>设计</a>
              <Divider type="vertical" />
              <a onClick={() => this.updateFormData(record, false)}>预览</a>
            </Fragment>
          );
        }
        return (
          <Fragment>
            <Divider type="vertical" />
            <a onClick={() => this.updateFormData(record, false)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={() => {
                this.handleDelete(record.id);
              }}
            >
              <a href="#">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.updateFormData(record, false)}>设计</a>
          </Fragment>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      visible: false,
      modelTitle: '',
      formRowData: {},
    };
  }

  componentDidMount() {
    // 查询列表数据
    this.loadData();
  }

  // 点击查询按钮
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const result = form.getFieldsValue();
    const beginTime = moment(result.beginTime).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(result.endTime).format('YYYY-MM-DD HH:mm:ss');
    const { name } = this.state;
    const inParam = {
      name: name,
      beginTime: beginTime,
      endTime: endTime,
    };
    this.setState(
      {
        searchParam: inParam,
      },
      this.loadData
    );
  };

  // 查询列表数据
  loadData = () => {
    const { searchParam } = this.state;
    const params = {
      ...searchParam,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFormList/qryList',
      params,
    });
  };

  // 新增事件
  handleAdd = () => {
    // 调出弹出框
    this.setState({
      type: 'add',
      visible: true,
      modelTitle: '新增',
      confirmLoading: false,
      formRowData: {
        id: '',
        addCode: '',
        addName: '',
        formType: 'UED',
        common: '',
      },
    });
  };

  // 新增表单
  handleAddSubmit = e => {
    e.preventDefault();
    this.setState({
      confirmLoading: true,
    });
    const { form, dispatch } = this.props;
    const { type } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id: values.id,
          code: values.addCode,
          name: values.addName,
          formType: values.formType,
          common: values.common,
        };
        if (type === 'add') {
          dispatch({
            type: 'customerFormList/addForm',
            params,
            callback: this.clickCallBack,
          });
        } else if (type === 'edit') {
          dispatch({
            type: 'customerFormList/editForm',
            params,
            callback: this.clickCallBack,
          });
        }
      } else {
        this.setState({
          confirmLoading: false,
        });
      }
    });
  };

  // 编辑事件
  updateFormData = data => {
    this.setState({
      visible: true,
      modelTitle: '编辑',
      type: 'edit',
      confirmLoading: false,
      formRowData: {
        id: data.id,
        addCode: data.code,
        addName: data.name,
        formType: data.formType,
        common: data.common,
      },
    });
  };

  clickCallBack = () => {
    this.setState(
      {
        visible: false,
      },
      this.loadData
    );
  };

  // 弹出框关闭事件
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 删除事件
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFormList/deleteFormData',
      id,
      callback: this.clickCallBack,
    });
  };

  // 渲染搜索条件区域
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem>
              {getFieldDecorator('name')(<Input allowClear placeholder="事项名称" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <Form.Item>
              {getFieldDecorator('beginTime')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间" />
              )}
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item>
              {getFieldDecorator('endTime')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间" />
              )}
            </Form.Item>
          </Col>
          <Col md={6} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      customerFormList: { formList },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      visible,
      modelTitle,
      confirmLoading,
      formRowData: { id, addCode, addName, formType, common },
    } = this.state;
    const { Option } = Select;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAdd}>
                新建标签
              </Button>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={formList}
              columns={this.columns}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        <Modal
          title={modelTitle}
          visible={visible}
          onOk={this.handleAddSubmit}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          destroyOnClose="true"
        >
          <Form layout="inline">
            <Row gutter={{ md: 24 }}>
              <Col md={0}>
                <Form.Item>
                  {getFieldDecorator('id', {
                    initialValue: id,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item>
                  {getFieldDecorator('addCode', {
                    initialValue: addCode,
                    rules: [
                      {
                        required: true,
                        message: '请输入表单编码',
                      },
                    ],
                  })(<Input placeholder="表单编码" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item>
                  {getFieldDecorator('addName', {
                    initialValue: addName,
                    rules: [
                      {
                        required: true,
                        message: '请输入表单编码',
                      },
                    ],
                  })(<Input placeholder="表单名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ md: 24 }}>
              <Col md={12}>
                <Form.Item label="表单类型">
                  {getFieldDecorator('formType', {
                    initialValue: formType,
                  })(
                    <Select>
                      <Option value="UED">模板设计</Option>
                      <Option value="UP">自定义类型</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item>
                  {getFieldDecorator('common', {
                    initialValue: common,
                    rules: [
                      {
                        required: true,
                        message: '请输入表单说明',
                      },
                    ],
                  })(<Input placeholder="表单说明" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default CustomerFormList;
