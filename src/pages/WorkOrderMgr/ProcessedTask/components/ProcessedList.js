import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import OrderDetailModal from '../../CreateWorkOrder/components/OrderDetailModal';

@connect(({ processTask, loading }) => ({
  processTask,
  loading: loading.effects['processTask/queryProcessTaskList'],
}))
class ProcessedList extends Component {
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
      width: 300,
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
    },
    {
      title: '任务发起部门',
      dataIndex: 'deptName',
    },
    {
      title: '当前环节',
      dataIndex: 'tacheName',
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this.showDetail(record)}>详情</a>
          </Fragment>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      detailModalVisible: false,
      pagination: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { pagination } = this.state;
    const params = {
      ...pagination,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'processTask/queryProcessTaskList',
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

  handleCancelDetailModal = () => {
    this.setState({
      detailModalVisible: false,
    });
  };

  showDetail = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'processTask/queryOrderDetail',
      workOrderId: record.id,
    }).then(() => {
      this.setState({
        detailModalVisible: true,
      });
    });
  };

  render() {
    const {
      processTask: {
        processTaskData: { list, total, pageSize },
        workOrderInfo,
        auditList,
      },
      loading,
    } = this.props;
    const { detailModalVisible } = this.state;
    return (
      <Fragment>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={list}
          columns={this.columns}
          pagination={{ total, pageSize }}
          onChange={this.handleTableChange}
          scroll={{ x: 1600 }}
        />
        <OrderDetailModal
          detailModalVisible={detailModalVisible}
          handleCancelDetailModal={this.handleCancelDetailModal}
          workOrderInfo={workOrderInfo}
          auditList={auditList}
        />
      </Fragment>
    );
  }
}

export default ProcessedList;
