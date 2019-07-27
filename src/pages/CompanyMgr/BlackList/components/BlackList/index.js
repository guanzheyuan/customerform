import React from 'react';
import { Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

@connect(({ blackList }) => ({ blackList }))
class BlackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 0,
      pageSize: 10,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'blackList/List',
      payload: {
        pageNum,
        pageSize,
      },
    });
  }

  dropCompany = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blackList/Delete',
      payload: {
        id,
      },
      callback: () => {
        this.freshList();
      },
    });
  };

  freshList = () => {
    const { dispatch, inputText } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'blackList/List',
      payload: {
        pageNum,
        pageSize,
        enterpriseName: inputText,
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, inputText } = this.props;
    this.setState({
      pageNum: page,
      pageSize,
    });
    dispatch({
      type: 'blackList/List',
      payload: {
        pageNum: page,
        pageSize,
        enterpriseName: inputText,
      },
    });
  };

  sizeChange = (_, size) => {
    this.setState({
      pageSize: size,
    });
    this.freshList();
  };

  render() {
    const { blackList } = this.props;
    const { blackListData } = blackList;
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        render: (text, record) => <a> {record.enterpriseName} </a>,
      },
      {
        title: '列入黑名单原因',
        dataIndex: 'reason',
        key: 'reason',
      },
      {
        title: '创建日期',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '截止日期',
        dataIndex: 'expiredBy',
        key: 'expiredBy',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (_, record) => (
          <Popconfirm
            title="确定删除?"
            onConfirm={() => this.dropCompany(record.id)}
            okText="是"
            cancelText="否"
          >
            <a> 删除 </a>
          </Popconfirm>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      onChange: this.pageChange,
      onShowSizeChange: this.sizeChange,
    };

    return (
      <Table
        rowKey={record => record.id}
        dataSource={blackListData.list}
        columns={columns}
        pagination={paginationProps}
        className={styles.blackTable}
      />
    );
  }
}
export default BlackList;
