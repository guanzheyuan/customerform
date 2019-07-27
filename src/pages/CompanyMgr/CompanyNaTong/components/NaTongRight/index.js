import React, { Component, Fragment } from 'react';
import { Row, Col, Input, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Search } = Input;
const pageSize = 10;
@connect(({ naTongMgr, loading }) => ({
  naTongMgr,
  loading: loading.effects['naTongMgr/querySeedTabelList'],
}))
class NaTongRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seedSerachText: '',
      seedPageNumCount: 0,
    };
  }

  seedSerach = value => {
    const { dispatch } = this.props;
    // const { seedPageNumCount } = this.state;
    this.setState({
      seedSerachText: value,
    });
    dispatch({
      type: 'naTongMgr/querySeedTabelList',
      payload: {
        pageNum: 0,
        pageSize,
        enterpriseName: value,
      },
    });
  };

  onSeedPageChange = pageNumber => {
    const { dispatch } = this.props;
    const { seedSerachText } = this.state;
    dispatch({
      type: 'naTongMgr/querySeedTabelList',
      payload: {
        pageNum: pageNumber.current - 1,
        pageSize: pageNumber.pageSize,
        enterpriseName: seedSerachText,
      },
    });
    this.setState({
      seedPageNumCount: pageNumber.current - 1,
    });
  };

  handleAddNaTong = record => {
    const { dispatch, tabKey, NaTongPageNumCount } = this.props;
    const { seedPageNumCount } = this.state;
    dispatch({
      type: 'naTongMgr/queryAddNaTong',
      payload: {
        id: record.id,
        typeId: tabKey,
      },
      callback: () => {
        dispatch({
          type: 'naTongMgr/querySeedTabelList',
          payload: {
            pageNum: seedPageNumCount,
            pageSize,
          },
          callback: () => {
            dispatch({
              type: 'naTongMgr/queryNaTongTabelList',
              payload: {
                pageNum: NaTongPageNumCount,
                pageSize,
                databaseId: tabKey,
              },
              callback: () => {
                dispatch({
                  type: 'naTongMgr/queryNaTongTabs',
                });
              },
            });
          },
        });
      },
    });
  };

  handleSeedDelete = record => {
    const { dispatch } = this.props;
    const { seedPageNumCount } = this.state;
    dispatch({
      type: 'naTongMgr/queryDeleteSeed',
      payload: {
        id: record.id,
      },
      callback: () => {
        dispatch({
          type: 'naTongMgr/querySeedTabelList',
          payload: {
            pageNum: seedPageNumCount,
            pageSize,
          },
        });
      },
    });
  };

  render() {
    const { seedTabelList } = this.props;
    const seedColumns = [
      {
        title: '',
        key: 'code',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        render: text => <a style={{ textDecoration: 'underline' }}>{text}</a>,
      },
      {
        title: '软件业务收入',
        dataIndex: 'income',
        key: 'income',
      },
      {
        title: '入库时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{text ? text.substr(0, 10) : ''}</span>,
      },
      {
        title: '',
        key: 'action',
        render: (text, record) => (
          <span className={styles.handleIcon}>
            <Popconfirm
              title="确定加入纳统库吗？"
              onText="确定"
              cancelText="取消"
              onConfirm={() => this.handleAddNaTong(record)}
            >
              <a>加入纳统库</a>
            </Popconfirm>
            <Popconfirm
              title="确定移除吗？"
              onText="确定"
              cancelText="取消"
              onConfirm={() => this.handleSeedDelete(record)}
            >
              <a>移除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <Fragment>
        <div className={styles.seedTable}>
          <Row style={{ marginBottom: '5px' }}>
            <Col lg={14} md={14} sm={24}>
              <h3>
                种子库企业<a>批量导入</a>
              </h3>
            </Col>
            <Col lg={10} md={10} sm={24}>
              <Search
                placeholder="企业名称"
                enterButton="搜索"
                size="default"
                onSearch={this.seedSerach}
              />
            </Col>
          </Row>
          <Row>
            <Table
              columns={seedColumns}
              dataSource={seedTabelList.list}
              rowKey={record => record.id}
              pagination={{
                pageSize,
                currentPage: seedTabelList.pageNum,
                total: seedTabelList.total,
              }}
              onChange={this.onSeedPageChange}
            />
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default NaTongRight;
