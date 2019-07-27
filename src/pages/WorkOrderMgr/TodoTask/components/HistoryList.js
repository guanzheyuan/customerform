import React, { PureComponent, Fragment } from 'react';
import { Table } from 'antd';
import HistoryDetailModal from './HistoryDetailModal';

class HistoryList extends PureComponent {
  columns = [
    {
      title: '环节名称',
      dataIndex: 'processStage',
      width: '20%',
    },
    {
      title: '处理人',
      dataIndex: 'curStaffName',
      width: '20%',
    },
    {
      title: '处理结果',
      dataIndex: 'procResultName',
      width: '20%',
    },
    {
      title: '处理意见',
      dataIndex: 'procAdvise',
    },
    {
      title: '处理时间',
      dataIndex: 'createDate',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              this.showHistoryDetailModal(record);
            }}
          >
            详情
          </a>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentRowData: {},
    };
  }

  showHistoryDetailModal = record => {
    this.setState({
      visible: true,
      currentRowData: record,
    });
  };

  cancelDetailModal = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { historyList } = this.props;
    const { visible, currentRowData } = this.state;
    const modalProps = {
      record: currentRowData,
      cancelDetailModal: this.cancelDetailModal,
    };
    return (
      <Fragment>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={historyList}
          // scroll={{ y: '40vh' }}
          pagination={false}
        />
        {visible && <HistoryDetailModal {...modalProps} />}
      </Fragment>
    );
    /* return (
      <div style={{height:'800px'}}>
        <iframe width='100%' height='100%' src='http://10.45.67.186:8001/uos-manager/flowDefineManage?frame=0&language=en&privCode=flowDefineManage'></iframe>
      </div>
    ); */
  }
}

export default HistoryList;
