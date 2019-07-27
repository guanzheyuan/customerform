import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, message } from 'antd';
import HandleTaskModal from './HandleTaskModal';

const { confirm } = Modal;
@connect(({ todoTask, loading }) => ({
  todoTask,
  loading: loading.effects['todoTask/queryTodoTaskList'],
}))
class TodoList extends PureComponent {
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
      title: '环节状态',
      dataIndex: 'techeStatus',
    },
    {
      title: '标题',
      dataIndex: 'title',
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
      title: '任务发起时间',
      dataIndex: 'taskBeginTime',
    },
    {
      title: '任务结束时间',
      dataIndex: 'taskEndTime',
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
            <a onClick={() => this.openHandleModal(record)}>处理</a>
          </Fragment>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      currentRowData: {},
      pagination: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'todoTask/fetchWorkTaskType',
    });
    dispatch({
      type: 'todoTask/fetchOrgAndUser',
    });
    this.fetch();
  }

  fetch = () => {
    const { pagination } = this.state;
    const params = {
      ...pagination,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'todoTask/queryTodoTaskList',
      params,
    });
  };

  queryAuditForm = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todoTask/queryAuditForm',
      id,
    });
  };

  queryOrgList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todoTask/queryChildrenOrgListOfCurOrg',
    });
  };

  queryGridList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todoTask/queryGridList',
    });
  };

  queryAllPersonList = cb => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todoTask/queryAllPersonResponseInfo',
      cb,
    });
  };

  queryReportList = params => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'todoTask/getEnterReportList',
      params,
    });
  };

  queryZxwgyReportList = params => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'todoTask/getZxwgyEnterReportList',
      params,
    });
  };

  queryWgzxReportList = params => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'todoTask/getWgzxEnterReportList',
      params,
    });
  };

  getRespPersonList = workOrderId => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'todoTask/getRespPersonList',
      workOrderId,
    });
  };

  getRespDeptList = workOrderId => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'todoTask/getRespDeptList',
      workOrderId,
    });
  };

  queryDictValues = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'todoTask/queryEvaluateDict',
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

  handleReportTableChange = (pagination, checkStatus) => {
    const { currentRowData } = this.state;
    this.queryReportList({
      workOrderId: currentRowData.id,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      checkStatus,
    });
  };

  handleZxwgyReportTableChange = pagination => {
    const { currentRowData } = this.state;
    this.queryZxwgyReportList({
      workOrderId: currentRowData.id,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    });
  };

  handleWgzxReportTableChange = pagination => {
    const { currentRowData } = this.state;
    this.queryWgzxReportList({
      workOrderId: currentRowData.id,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    });
  };

  openHandleModal = record => {
    this.queryAuditForm(record.id);
    this.queryOrgList();
    this.queryGridList();
    this.queryAllPersonList(() => {
      this.setState({
        modalVisible: true,
        currentRowData: record,
      });
    });
    if (record.tacheCode.startsWith('td_from_leader')) {
      this.queryReportList({
        workOrderId: record.id,
        pageNum: 1,
        pageSize: 5,
      });
      this.componentDidMount();
    }
    if (record.tacheCode.startsWith('wgy')) {
      this.queryReportList({
        workOrderId: record.id,
        pageNum: 1,
        pageSize: 5,
      });
    }
    if (record.tacheCode.startsWith('qs_wgzx')) {
      this.queryWgzxReportList({
        workOrderId: record.id,
        pageNum: 1,
        pageSize: 5,
      });
      // 获取被评价人员
      this.getRespPersonList(record.id);
      // 获取字典数据
      this.queryDictValues();
    }
    if (record.tacheCode.startsWith('qs_zxwgy')) {
      this.queryZxwgyReportList({
        workOrderId: record.id,
        pageNum: 1,
        pageSize: 5,
      });
      // 获取被评价部门
      this.getRespDeptList(record.id);
      // 获取字典数据
      this.queryDictValues();
    }
  };

  handleSubmit = params => {
    const { dispatch } = this.props;
    confirm({
      title: '确认',
      content: '确认提交?',
      onOk: () => {
        dispatch({
          type: 'todoTask/dealTask',
          params,
          callback: data => {
            if (data.code === '901') {
              Modal.error({ title: data.msg });
              return;
            }
            message.info('处理成功');
            this.handleCancel();
            this.fetch();
          },
        });
      },
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {
      todoTask: {
        workTaskTypeList,
        orgUserData,
        todoTaskData: { list, total, pageSize },
        auditForm,
        orgList,
        gridList,
        allPersonList,
        reportList,
        zxwgyReportList,
        wgzxReportList,
        evaluatePersonList, // 被评价人
        evaluateDeptList, // 被人部门
        evaluateDict, // 字典数据
      },
      loading,
    } = this.props;
    const { modalVisible, currentRowData } = this.state;
    const modalParams = {
      record: currentRowData,
      orgUserData,
      workTaskTypeList,
      auditForm,
      workOrderBaseInfo: auditForm.workOrderInfo.workOrderBaseInfo,
      orgList,
      gridList,
      allPersonList,
      reportList,
      zxwgyReportList,
      wgzxReportList,
      evaluatePersonList,
      evaluateDeptList,
      evaluateDict,
      attachmentList: auditForm.workOrderInfo.attachmentList,
      handleReportTableChange: this.handleReportTableChange,
      handleCancel: this.handleCancel,
      handleSubmit: this.handleSubmit,
    };
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
        {modalVisible && <HandleTaskModal {...modalParams} />}
      </Fragment>
    );
  }
}

export default TodoList;
