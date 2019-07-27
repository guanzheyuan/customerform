import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Table,
  message,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import CreateFormModal from './components/CreateFormModal';
import UpdateFormModal from './components/UpdateFormModal';
import OrderDetailModal from './components/OrderDetailModal';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create()
@connect(({ workOrder, loading }) => ({
  workOrder,
  loading: loading.effects['workOrder/fetchWorkOrder'],
}))
class CreateWorkOrder extends PureComponent {
  columns = [
    {
      title: '工单编号',
      dataIndex: 'workOrderNo',
    },
    {
      title: '工单类型',
      dataIndex: 'workType',
    },
    {
      title: '工单状态',
      dataIndex: 'taskStatusName',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '当前处理人',
      dataIndex: 'currentProcessor',
    },
    {
      title: '任务发起时间',
      dataIndex: 'taskBeginTime',
    },
    {
      title: '任务结束时间',
      dataIndex: 'taskEndTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '关闭人',
      dataIndex: 'closeByName',
    },
    {
      title: '关闭时间',
      dataIndex: 'closeDate',
    },
    {
      title: '操作',
      width: '150px',
      fixed: 'right',
      render: (text, record) => {
        if (record.taskStatus === '0') {
          return (
            <Fragment>
              <a
                onClick={() => {
                  this.queryOrderDetail(record);
                }}
              >
                详情
              </a>
              <Divider type="vertical" />
              <a onClick={() => this.updateWorkOrder(record, false)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定删除?"
                onConfirm={() => {
                  this.handleDelete(record.id);
                }}
              >
                <a href="#">删除</a>
              </Popconfirm>
            </Fragment>
          );
        }
        return (
          <Fragment>
            <a
              onClick={() => {
                this.queryOrderDetail(record);
              }}
            >
              详情
            </a>
          </Fragment>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      updateModalVisible: false,
      detailModalVisible: false,
      searchParam: {},
      pagination: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchWorkTaskType',
    });
    dispatch({
      type: 'workOrder/fetchOrgAndUser',
    });
    this.fetch();
  }

  fetch = () => {
    const { pagination, searchParam } = this.state;
    const params = {
      ...pagination,
      ...searchParam,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchWorkOrder',
      params,
    });
  };

  handleTableChange = pagination => {
    this.setState(
      {
        pagination: { pageNum: pagination.current, pageSize: pagination.pageSize },
      },
      this.fetch
    );
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/deleteWorkOrder',
      id,
      callback: this.fetch,
    }).then(() => {
      message.info('删除成功');
    });
  };

  queryOrderDetail = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/queryOrderDetail',
      workOrderId: record.id,
    }).then(() => {
      this.setState({
        detailModalVisible: true,
      });
    });
  };

  handleCancelDetailModal = () => {
    this.setState({
      detailModalVisible: false,
    });
  };

  hideUpdateFormModal = () => {
    this.setState({
      updateModalVisible: false,
    });
  };

  hideAddFormModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const result = form.getFieldsValue();
    this.setState(
      {
        searchParam: result,
      },
      this.fetch
    );
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  addWorkOrder = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  updateWorkOrder = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/queryOrderDetail',
      workOrderId: record.id,
    }).then(() => {
      this.setState({
        updateModalVisible: true,
      });
    });
  };

  handleSubmit = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/submitWorkOrder',
      payload: params,
      callback: this.fetch,
    });

    message.success('创建成功');
    this.hideAddFormModal();
    this.hideUpdateFormModal();
  };

  handleSave = params => {
    const { dispatch } = this.props;
    const data = {
      ...params,
    };
    dispatch({
      type: 'workOrder/saveWorkOrder',
      payload: data,
      callback: this.fetch,
    });
    message.success('保存成功');
    this.hideAddFormModal();
  };

  handleUpdate = params => {
    const { dispatch } = this.props;
    const data = {
      ...params,
    };
    dispatch({
      type: 'workOrder/saveWorkOrder',
      payload: data,
      callback: this.fetch,
    });
    message.success('修改成功');
    this.hideUpdateFormModal();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      workOrder: { workTaskTypeList },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout}>
        <Row gutter={{ md: 8 }}>
          <Col md={8} sm={24}>
            <FormItem label="工单编号">
              {getFieldDecorator('workOrderNo')(<Input allowClear placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工单类型">
              {getFieldDecorator('taskType')(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  {workTaskTypeList.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.workType}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工单状态">
              {getFieldDecorator('taskStatus')(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">草稿</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">待完成</Option>
                  <Option value="3">待修改</Option>
                  <Option value="5">已关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(<Input allowClear placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      workOrder: {
        orderListResult: { list, total },
        workTaskTypeList,
        orgUserData,
        workOrderInfo,
        auditList,
      },
      loading,
    } = this.props;
    const {
      addModalVisible,
      updateModalVisible,
      detailModalVisible,
      pagination: { pageSize },
    } = this.state;
    const updateModalProp = {
      workTaskTypeList,
      orgUserData,
      record: workOrderInfo.workOrderBaseInfo,
      attachmentList: workOrderInfo.attachmentList,
      handleSubmit: this.handleSubmit,
      handleUpdate: this.handleUpdate,
      hideUpdateFormModal: this.hideUpdateFormModal,
    };
    const addModalProp = {
      workTaskTypeList,
      orgUserData,
      handleSubmit: this.handleSubmit,
      handleSave: this.handleSave,
      hideAddFormModal: this.hideAddFormModal,
    };
    return (
      <PageHeaderWrapper title="创建工单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.addWorkOrder}>
                新建
              </Button>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={list}
              columns={this.columns}
              pagination={{ total, pageSize }}
              onChange={this.handleTableChange}
              scroll={{ x: 1600 }}
            />
          </div>
        </Card>
        {addModalVisible && <CreateFormModal {...addModalProp} />}
        {updateModalVisible && <UpdateFormModal {...updateModalProp} />}
        <OrderDetailModal
          detailModalVisible={detailModalVisible}
          handleCancelDetailModal={this.handleCancelDetailModal}
          workOrderInfo={workOrderInfo}
          auditList={auditList}
        />
      </PageHeaderWrapper>
    );
  }
}

export default CreateWorkOrder;
