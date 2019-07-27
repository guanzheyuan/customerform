import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, Button, Table, Divider, Input, Checkbox, Modal, Popconfirm } from 'antd';
import monent from 'moment';
import styles from './style.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const mapDispatchToProps = dispatch => {
  return {
    queryRaiseType: callback => {
      dispatch({
        type: 'raiseMgr/queryRaiseType',
        callback: data => {
          callback(data);
        },
      });
    },
    getRaiseStatistic: id => {
      dispatch({
        type: 'raiseMgr/getRaiseStatistic',
        id,
      });
    },
    querySeedList: params => {
      dispatch({
        type: 'raiseMgr/querySeedList',
        params,
      });
    },
    queryEntpList: params => {
      dispatch({
        type: 'raiseMgr/queryEntpList',
        params,
      });
    },
    queryPlanList: params => {
      dispatch({
        type: 'raiseMgr/queryPlanList',
        params,
      });
    },
    queryNotiList: params => {
      dispatch({
        type: 'raiseMgr/queryNotiList',
        params,
      });
    },
    successEntp: (id, callback) => {
      dispatch({
        type: 'raiseMgr/successEntp',
        id,
        callback: data => {
          callback(data);
        },
      });
    },
    deleteEntp: (id, callback) => {
      dispatch({
        type: 'raiseMgr/deleteEntp',
        id,
        callback: data => {
          callback(data);
        },
      });
    },
    addSeedToCul: (id, callback) => {
      dispatch({
        type: 'raiseMgr/addSeedToCul',
        id,
        callback: data => {
          callback(data);
        },
      });
    },
    deleteSeed: (id, callback) => {
      dispatch({
        type: 'raiseMgr/deleteSeed',
        id,
        callback: data => {
          callback(data);
        },
      });
    },
    updateMutiSeed: (params, callback) => {
      dispatch({
        type: 'raiseMgr/updateMutiSeed',
        params,
        callback: data => {
          callback(data);
        },
      });
    },
    updateSeed: (params, callback) => {
      dispatch({
        type: 'raiseMgr/updateSeed',
        params,
        callback: data => {
          callback(data);
        },
      });
    },
  };
};
const { Search } = Input;
const mormalPageSize = 10;

@Form.create()
@connect(
  ({ raiseMgr }) => ({ raiseMgr }),
  mapDispatchToProps
)
class RaiseMgr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {
    const { queryRaiseType } = this.props;
    // 获取企业培育的类别
    queryRaiseType(result => {
      if (result && result.length > 0) {
        const key = result[0].id.toString();
        this.state.selectedKey = key;
      }
      this.setState({});
      // 请求第一页数据
      const { id } = result[0];
      this.initData(id);
    });
  }

  initData = id => {
    // 请求统计数据
    this.getStatistic(id);
    // 请求种子库表格数据
    const {
      raiseMgr: { zzkdata, entpdata },
    } = this.props;

    this.querySeedList(id, '', 0, zzkdata[id].pageSize);
    // 请求企业库表格数据
    this.queryEntpList(id, 0, entpdata[id].pageSize);
    // 请求计划数据
    this.queryPlanList(id);
    // 请求通知数据
    this.queryNotiList(id);
  };

  // 刷新企业列表数据
  refreshEntpList = () => {
    const {
      raiseMgr: { entpdata },
    } = this.props;
    const { selectedKey } = this.state;
    this.queryEntpList(
      selectedKey,
      entpdata[selectedKey].pageNum - 1,
      entpdata[selectedKey].pageSize
    );
  };

  getStatistic = key => {
    const { getRaiseStatistic } = this.props;
    getRaiseStatistic(key);
  };

  onTabChange = key => {
    this.state.selectedKey = key;
    this.setState({});
    this.initData(key);
  };

  renderItem = item => {
    const {
      raiseMgr: { tjdata, entpdata },
    } = this.props;
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        render: text => <a>{text}</a>,
      },
      {
        title: '估值（亿美元）',
        dataIndex: 'enterpriseValue',
        key: 'enterpriseValue',
      },
      {
        title: '入库时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => {
          const date = monent(text).format('YYYY-MM-DD');
          return <div>{date}</div>;
        },
      },
      {
        title: '资金拨付方式',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '资金拨付情况（万元）',
        dataIndex: 'payValue',
        key: 'payValue',
      },
      {
        title: '',
        key: 'action',
        render: record => {
          const flag = record.isSuccess === '1';
          return (
            <span>
              <Popconfirm
                title="确定培育成功?"
                onConfirm={() => this.successEntp(record.id)}
                okText="是"
                cancelText="否"
              >
                <a disabled={flag}> 培育成功 </a>
              </Popconfirm>

              <Divider type="vertical" />
              <Popconfirm
                title="确定移除?"
                onConfirm={() => this.deleteEntp(record.id)}
                okText="是"
                cancelText="否"
              >
                <a> 移除 </a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    const { selectedKey } = this.state;

    const onEntpTableChange = pagination => {
      const pageNum = pagination.current - 1;
      const { pageSize } = pagination;

      this.queryEntpList(selectedKey, pageNum, pageSize);
    };

    return (
      <div>
        <div className={styles.title}>
          <h3>{item.name}</h3>
          <a>查看完整统计台帐</a>
        </div>

        <div className={styles.row}>
          {selectedKey !== -1 && tjdata[selectedKey]
            ? tjdata[selectedKey].map((tjitem, tjindex) => {
                const firstName = `${item.name}数量`;
                return (
                  <div className={styles.tjdiv} key={tjitem.key}>
                    <div>{tjindex === 0 ? firstName : tjitem.name}</div>
                    <div className={styles.row}>
                      <div className={styles.tjcount}>{tjitem.count}</div>

                      <div className={styles.tjtext}>家</div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        <Table
          rowKey={record => record.id}
          pagination={{
            pageSize: selectedKey ? entpdata[selectedKey].pageSize : mormalPageSize,
            total: selectedKey ? entpdata[selectedKey].total : 0,
            showSizeChanger: true,
            showQuickJumper: true,
            current: selectedKey ? entpdata[selectedKey].pageNum : 1,
          }}
          dataSource={selectedKey ? entpdata[selectedKey].list : []}
          columns={columns}
          onChange={onEntpTableChange}
        />
      </div>
    );
  };

  searchCompany = value => {
    const { selectedKey } = this.state;
    const {
      raiseMgr: { zzkdata },
    } = this.props;
    zzkdata[selectedKey].searchContent = value;
    // 请求种子库表格数据
    this.querySeedList(selectedKey, value, 0, zzkdata[selectedKey].pageSize);
  };

  // 请求种子库表格数据
  querySeedList = (databaseId, enterpriseName = '', pageNum = 0, pageSize) => {
    const { querySeedList } = this.props;
    const params = {
      pageNum,
      pageSize,
      databaseId,
      enterpriseName,
    };
    querySeedList(params);
  };

  // 查询企业列表
  queryEntpList = (databaseId, pageNum = 0, pageSize) => {
    const { queryEntpList } = this.props;

    const params = {
      pageNum,
      pageSize,
      databaseId,
    };
    queryEntpList(params);
  };

  // 查询计划列表
  queryPlanList = (databaseId, pageNum = 0, pageSize = 10) => {
    const { queryPlanList } = this.props;
    const params = {
      pageNum,
      pageSize,
      databaseId,
    };
    queryPlanList(params);
  };

  // 查询通知列表
  queryNotiList = (databaseId, pageNum = 0, pageSize = 10) => {
    const { queryNotiList } = this.props;
    const params = {
      pageNum,
      pageSize,
      databaseId,
    };
    queryNotiList(params);
  };

  // 企业列表-培育成功
  successEntp = id => {
    const { successEntp } = this.props;
    successEntp(id, result => {
      if (result.success) {
        // 刷新列表
        this.refreshEntpList();
        // 更新统计数据
        const { selectedKey } = this.state;
        this.getStatistic(selectedKey);
      }
    });
  };

  // 企业列表-删除
  deleteEntp = id => {
    const { deleteEntp } = this.props;
    deleteEntp(id, result => {
      if (result.success) {
        // 刷新列表
        this.refreshEntpList();
        // 更新统计数据
        const { selectedKey } = this.state;
        this.getStatistic(selectedKey);
      }
    });
  };

  // 种子库-加入培育库
  addSeedToCul = id => {
    const { addSeedToCul } = this.props;
    addSeedToCul(id, result => {
      if (result.success) {
        // 刷新列表
        this.refreshSeedList();
        // 更新统计数据
        const { selectedKey } = this.state;
        this.getStatistic(selectedKey);
      }
    });
  };

  // 种子库-移除
  deleteSeed = id => {
    const { deleteSeed } = this.props;
    deleteSeed(id, result => {
      if (result.success) {
        // 刷新列表
        this.refreshSeedList();
        // 更新统计数据
        const { selectedKey } = this.state;
        this.getStatistic(selectedKey);
      }
    });
  };

  // 种子库-全量更新
  updateMutiSeed = (list, columnName, checked) => {
    const { updateMutiSeed } = this.props;
    const params = [];
    list.map(item => {
      const data = {
        enterpriseName: item.enterpriseName,
        id: item.id,
      };
      data[columnName] = checked ? '1' : '0';
      params.push(data);
      return false;
    });

    updateMutiSeed(params, result => {
      if (result.success) {
        // 刷新列表
        this.refreshSeedList();
      }
    });
  };

  // 种子库-更新
  updateSeed = (record, columnName, checked) => {
    const { updateSeed } = this.props;
    const params = {
      id: record.id,
    };
    params[columnName] = checked ? '1' : '0';
    updateSeed(params, result => {
      if (result.success) {
        // 刷新列表
        this.refreshSeedList();
      }
    });
  };

  // 刷新种子库列表数据
  refreshSeedList = () => {
    const {
      raiseMgr: { zzkdata },
    } = this.props;
    const { selectedKey } = this.state;
    this.querySeedList(
      selectedKey,
      zzkdata[selectedKey].searchContent,
      zzkdata[selectedKey].pageNum - 1,
      zzkdata[selectedKey].pageSize
    );
  };

  getChecked = (name, zzkdata) => {
    const { selectedKey } = this.state;

    if (selectedKey && zzkdata[selectedKey].list) {
      const selectedCount = zzkdata[selectedKey].list.filter(item => item[name] === '1').length;
      if (selectedCount === 0) {
        return false;
      }
      return selectedCount === zzkdata[selectedKey].list.length;
    }
    return false;
  };

  getIndeterminate = (name, selectedKey, zzkdata) => {
    if (selectedKey && zzkdata[selectedKey].list) {
      const count = zzkdata[selectedKey].list.filter(item => item[name] === '1').length;
      if (count === zzkdata[selectedKey].list.length || count === 0) {
        return true;
      }
    }
    return false;
  };

  renderZZView = selectedKey => {
    const {
      raiseMgr: { zzkdata },
    } = this.props;

    const onTitleChange = (e, columnName, lastColumnName, nextColumns) => {
      // 判断是否能够批量修改
      // 选中的情况
      if (lastColumnName && e.target.checked) {
        const data = zzkdata[selectedKey].list.filter(item => item[lastColumnName] === '1');
        //  判断上个节点的全部选中了
        if (data.length !== zzkdata[selectedKey].list.length) {
          Modal.error({ title: '错误', content: '上个节点有未选中的，请逐个勾选' });
          return;
        }
      }
      // 未选中的情况
      if (nextColumns.length > 0 && !e.target.checked) {
        let hasSelected = false;
        nextColumns.map(columnItem => {
          const data = zzkdata[selectedKey].list.filter(item => item[columnItem] === '1');
          if (data.length > 0) {
            hasSelected = true;
          }
          return false;
        });
        if (hasSelected) {
          Modal.error({ title: '错误', content: '后面节点有选中的，请逐个取消勾选' });
          return;
        }
      }
      this.updateMutiSeed(zzkdata[selectedKey].list, columnName, e.target.checked);
      // zzkdata[selectedKey].list.map((item, index) => {
      //   zzkdata[selectedKey].list[index][name] = e.target.checked ? '1' : '0';
      //   return null;
      // });
      // this.setState({});
    };
    const onItemChange = (e, record, columnName, lastColumnName, nextColumns) => {
      // 判断是否能够修改
      if (e.target.checked && lastColumnName && record[lastColumnName] !== '1') {
        Modal.error({ title: '错误', content: '上个节点未选中，请逐个勾选' });
        return;
      }
      if (!e.target.checked && nextColumns.length > 0) {
        let hasSelected = false;
        nextColumns.map(columnItem => {
          if (record[columnItem] === '1') {
            hasSelected = true;
          }
          return false;
        });
        if (hasSelected) {
          Modal.error({ title: '错误', content: '后面节点有选中的，请逐个取消勾选' });
          return;
        }
      }

      //
      this.updateSeed(record, columnName, e.target.checked);
      // const item = zzkdata[selectedKey].list.filter(d => d.id === record.id)[0];
      // item[columnName] = e.target.checked ? '1' : '0';
      // this.setState({});
    };
    const renderCkTitle = (name, columnName, lastColumnName, nextColumns) => {
      return (
        <div className={styles.row}>
          {name}
          <Checkbox
            style={{ marginLeft: 10 }}
            indeterminate={!this.getIndeterminate(columnName, selectedKey, zzkdata)}
            checked={this.getChecked(columnName, zzkdata)}
            onChange={e => {
              onTitleChange(e, columnName, lastColumnName, nextColumns);
            }}
          />
        </div>
      );
    };
    const renderCkItem = (text, record, columnName, lastColumnName, nextColumns) => {
      return (
        <Checkbox
          checked={text === '1'}
          onChange={e => {
            onItemChange(e, record, columnName, lastColumnName, nextColumns);
          }}
        />
      );
    };
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        render: text => <a>{text}</a>,
      },
      {
        title: '是否上年度销售收入2000万元一下的一小企业',
        dataIndex: 'isMicroEntp',
        key: 'isMicroEntp',
        render: text => (text === '1' ? <div>是</div> : <div>否</div>),
      },
      {
        title: renderCkTitle('企业申报', 'isEntpApply', '', [
          'isGovRecommend',
          'isReview',
          'isPublicity',
        ]),
        dataIndex: 'isEntpApply',
        key: 'isEntpApply',
        render: (text, record) =>
          renderCkItem(text, record, 'isEntpApply', '', [
            'isGovRecommend',
            'isReview',
            'isPublicity',
          ]),
      },
      {
        title: renderCkTitle('地方推荐', 'isGovRecommend', 'isEntpApply', [
          'isReview',
          'isPublicity',
        ]),
        dataIndex: 'isGovRecommend',
        key: 'isGovRecommend',
        render: (text, record) =>
          renderCkItem(text, record, 'isGovRecommend', 'isEntpApply', ['isReview', 'isPublicity']),
      },
      {
        title: renderCkTitle('专家评审', 'isReview', 'isGovRecommend', ['isPublicity']),
        dataIndex: 'isReview',
        key: 'isReview',
        render: (text, record) =>
          renderCkItem(text, record, 'isReview', 'isGovRecommend', ['isPublicity']),
      },
      {
        title: renderCkTitle('公示', 'isPublicity', 'isReview', []),
        dataIndex: 'isPublicity',
        key: 'isPublicity',
        render: (text, record) => renderCkItem(text, record, 'isPublicity', 'isReview', []),
      },
      {
        title: '',
        key: 'action',
        render: record => {
          const flag =
            record.isEntpApply === '1' &&
            record.isGovRecommend === '1' &&
            record.isReview === '1' &&
            record.isPublicity === '1';
          return (
            <span>
              <Popconfirm
                title="确定加入培育库?"
                onConfirm={() => this.addSeedToCul(record.id)}
                okText="是"
                cancelText="否"
              >
                <a disabled={!flag}> 加入培育库 </a>
              </Popconfirm>
              <Divider type="vertical" />

              <Popconfirm
                title="确定移除?"
                onConfirm={() => this.deleteSeed(record.id)}
                okText="是"
                cancelText="否"
              >
                <a> 移除 </a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    const onZZKTableChange = pagination => {
      const pageNum = pagination.current - 1;
      const { pageSize } = pagination;
      this.querySeedList(selectedKey, zzkdata[selectedKey].searchContent, pageNum, pageSize);
    };

    return (
      <Card
        bordered={false}
        style={{
          marginTop: 20,
        }}
      >
        <div className={styles.row} style={{}}>
          <div className={styles.pytitle}>种子库企业</div>
          <a className={styles.pya}> 新增</a>
          <div
            className={styles.rowright}
            style={{
              marginLeft: 10,
              flex: 1,
            }}
          >
            <a
              className={styles.pya}
              style={{
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              上传地方推荐名单
            </a>
            <a
              className={styles.pya}
              style={{
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              上传申报推荐汇总表名单
            </a>
            <a
              className={styles.pya}
              style={{
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              生产申报推荐汇总表名单
            </a>
          </div>
        </div>

        {/** 搜索表格 */}
        <Search
          placeholder="企业名称"
          enterButton="搜索"
          className={styles.searchCompany}
          onSearch={value => this.searchCompany(value)}
        />

        <Table
          rowKey="id"
          pagination={{
            pageSize: selectedKey ? zzkdata[selectedKey].pageSize : mormalPageSize,
            total: selectedKey ? zzkdata[selectedKey].total : 0,
            showSizeChanger: true,
            showQuickJumper: true,
            current: selectedKey ? zzkdata[selectedKey].pageNum : 1,
          }}
          dataSource={selectedKey ? zzkdata[selectedKey].list : []}
          columns={columns}
          onChange={onZZKTableChange}
        />
      </Card>
    );
  };

  // 培育计划
  renderJH = () => {
    let pyjh = [];
    const { selectedKey } = this.state;
    const {
      raiseMgr: { plandata },
    } = this.props;
    if (selectedKey && plandata[selectedKey]) {
      pyjh = plandata[selectedKey].list;
    }

    return (
      <div style={{ paddingBottom: 20 }}>
        <div className={styles.row}>
          <div className={styles.pytitle}>培育计划</div>
          <a className={styles.pya}> 查看完整统计台帐</a>
        </div>
        {pyjh.map(item => {
          return (
            <div key={item.id} className={styles.title} style={{ marginTop: 5, marginBottom: 5 }}>
              <div
                style={{
                  fontSize: 14,
                }}
              >
                {item.name}
              </div>
              <a
                className={styles.pya}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  paddingTop: 2,
                }}
              >
                全文&gt;&gt;
              </a>
              <div
                style={{
                  marginRight: 20,
                }}
              >
                2018.12.01
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 培育通知
  renderTZ = () => {
    let pytz = [
      // {
      //   key: 0,
      //   hasPush: true,
      // },
      // {
      //   key: 1,
      //   hasPush: false,
      // },
    ];

    const { selectedKey } = this.state;
    const {
      raiseMgr: { notidata },
    } = this.props;
    if (selectedKey && notidata[selectedKey]) {
      pytz = notidata[selectedKey].list;
    }

    return (
      <div style={{ paddingBottom: 20, paddingTop: 20 }}>
        <div className={styles.row}>
          <div className={styles.pytitle}>培育通知</div>
          <a className={styles.pya}> 新增通知</a>
        </div>
        {pytz.map(item => {
          return (
            <div key={item.id} className={styles.title} style={{ marginTop: 5, marginBottom: 5 }}>
              <div
                style={{
                  fontSize: 14,
                  flex: 11,
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  flex: 6,
                }}
              >
                2019.01.03
              </div>
              <div
                style={{
                  marginRight: 20,
                  flex: 1,
                  fontSize: 13,
                }}
                className={styles.pushdiv}
              >
                {item.hasPush ? <div>已推送</div> : <a style={{ fontSize: 13 }}>推送</a>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;
    const {
      raiseMgr: { typeList },
    } = this.props;

    const { selectedKey } = this.state;
    const operations = (
      <Button type="link" icon="plus">
        新增培育库
      </Button>
    );

    return (
      <PageHeaderWrapper title="企业培育">
        <Card bordered={false}>
          <span style={{ fontSize: 20, color: 'black' }}>企业培育</span>
          <Tabs
            tabBarExtraContent={operations}
            onChange={key => {
              this.onTabChange(key);
            }}
          >
            {typeList
              ? typeList.map(item => {
                  return (
                    <TabPane tab={item.name} key={item.id.toString()}>
                      {this.renderItem(item)}
                    </TabPane>
                  );
                })
              : null}
          </Tabs>
        </Card>
        <Card
          bordered={false}
          style={{
            marginTop: 20,
          }}
        >
          {this.renderJH()}
          <Divider />
          {this.renderTZ()}
        </Card>

        {this.renderZZView(selectedKey)}
      </PageHeaderWrapper>
    );
  }
}

export default RaiseMgr;
