import React, { Component } from 'react';
import { Card, Row, Col, Tabs, Input, Table, Popconfirm } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './style.less';
import NaTongLeft from './components/NaTongLeft';
import NaTongRight from './components/NaTongRight';

const { TabPane } = Tabs;
const { Search } = Input;
const pageSize = 10;
@connect(({ naTongMgr, loading }) => ({
  naTongMgr,
  loading: loading.effects['naTongMgr/queryNaTongTabelList'],
}))
class CompanyNaTong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 1,
      naTongSerachText: '',
      NaTongPageNumCount: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'naTongMgr/queryInfoDatas',
      payload: {
        id: 1,
      },
    });
    dispatch({
      type: 'naTongMgr/queryNaTongTabs',
    });
    dispatch({
      type: 'naTongMgr/queryNaTongTabelList',
      payload: {
        pageNum: 0,
        pageSize,
        databaseId: 1,
      },
    });
    dispatch({
      type: 'naTongMgr/querySeedTabelList',
      payload: {
        pageNum: 0,
        pageSize,
      },
    });
  }

  onChangeTabKey = key => {
    this.setState({
      tabKey: key,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'naTongMgr/queryInfoDatas',
      payload: {
        id: key,
      },
    });
    dispatch({
      type: 'naTongMgr/queryNaTongTabelList',
      payload: {
        pageNum: 0,
        pageSize,
        databaseId: key,
      },
    });
  };

  naTongSerach = value => {
    const { dispatch } = this.props;
    const { tabKey } = this.state;
    this.setState({
      naTongSerachText: value,
    });
    dispatch({
      type: 'naTongMgr/queryNaTongTabelList',
      payload: {
        pageNum: 0,
        pageSize,
        databaseId: tabKey,
        enterpriseName: value,
      },
    });
  };

  onNaTongPageChange = pageNumber => {
    const { dispatch } = this.props;
    const { tabKey, naTongSerachText } = this.state;
    dispatch({
      type: 'naTongMgr/queryNaTongTabelList',
      payload: {
        pageNum: pageNumber.current - 1,
        pageSize: pageNumber.pageSize,
        databaseId: tabKey,
        enterpriseName: naTongSerachText,
      },
    });
    this.setState({
      NaTongPageNumCount: pageNumber.current - 1,
    });
  };

  handleNaTongDelete = record => {
    const { dispatch } = this.props;
    const { NaTongPageNumCount, tabKey } = this.state;
    dispatch({
      type: 'naTongMgr/queryDeleteNaTong',
      payload: {
        id: record.id,
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
  };

  render() {
    const {
      naTongMgr: { naTongTabelList, naTongTabsList, seedTabelList, infoDatas },
    } = this.props;
    const { NaTongPageNumCount, tabKey } = this.state;
    const naTongLeftProps = {
      infoDatas,
    };
    const naTongRightProps = {
      seedTabelList,
      NaTongPageNumCount,
      tabKey,
    };
    const operations = <a>新增纳统库</a>;
    const columns = [
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
        render: (text, record) => (
          <Link
            to={{ pathname: '/company/portrait', state: { data: record.id } }}
            style={{ textDecoration: 'underline' }}
          >
            {text}
          </Link>
        ),
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
            <a>申报材料</a>
            <a>查看报表</a>
            <Popconfirm
              title="确定移除吗？"
              onText="确定"
              cancelText="取消"
              onConfirm={() => this.handleNaTongDelete(record)}
            >
              <a>移除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <Card title="企业纳统">
        <Row>
          <Col lg={9} md={9} sm={24} className={styles.naTongLeft}>
            <NaTongLeft {...naTongLeftProps} />
          </Col>
          <Col lg={15} md={15} sm={24} className={styles.naTongRight}>
            <Tabs
              defaultActiveKey="1"
              tabBarExtraContent={operations}
              className={styles.naTongTab}
              onChange={this.onChangeTabKey}
            >
              {naTongTabsList.map(item => (
                <TabPane tab={item.name} key={item.id}>
                  <div className={styles.naTongTable}>
                    <Row style={{ marginBottom: '5px' }}>
                      <Col lg={14} md={14} sm={24}>
                        <h3>
                          纳统库企业<a>刷新</a>
                        </h3>
                      </Col>
                      <Col lg={10} md={10} sm={24}>
                        <Search
                          placeholder="企业名称"
                          enterButton="搜索"
                          size="default"
                          onSearch={value => this.naTongSerach(value)}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Table
                        columns={columns}
                        dataSource={naTongTabelList.list}
                        rowKey={record => record.id}
                        pagination={{
                          pageSize,
                          currentPage: naTongTabelList.pageNum,
                          total: naTongTabelList.total,
                        }}
                        onChange={this.onNaTongPageChange}
                      />
                    </Row>
                  </div>
                </TabPane>
              ))}
            </Tabs>
            <NaTongRight {...naTongRightProps} onRef={this.RightChild} />
          </Col>
        </Row>
      </Card>
    );
  }
}
export default CompanyNaTong;
