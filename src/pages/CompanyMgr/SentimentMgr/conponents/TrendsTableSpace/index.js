import React, { Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

@connect(({ sentimentMgr }) => ({ sentimentMgr }))
class TrendsTableSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sentimentMgr/TrendsList',
      payload: {},
    });
  }

  render() {
    /* const {
      sentimentMgr: { TrendsData },
    } = this.props; */
    const TrendsData = [
      { id: 1, a: 1, b: 1, c: 1, d: 1 },
      { id: 2, a: 2, b: 2, c: 2, d: 2 },
      { id: 3, a: 3, b: 3, c: 3, d: 3 },
      { id: 4, a: 4, b: 4, c: 4, d: 4 },
      { id: 5, a: 5, b: 5, c: 5, d: 5 },
      { id: 6, a: 6, b: 6, c: 6, d: 6 },
      { id: 7, a: 1, b: 1, c: 1, d: 1 },
      { id: 8, a: 1, b: 1, c: 1, d: 1 },
      { id: 9, a: 1, b: 1, c: 1, d: 1 },
      { id: 10, a: 1, b: 1, c: 1, d: 1 },
      { id: 11, a: 1, b: 1, c: 1, d: 1 },
      { id: 12, a: 1, b: 1, c: 1, d: 1 },
      { id: 13, a: 1, b: 1, c: 1, d: 1 },
      { id: 14, a: 1, b: 1, c: 1, d: 1 },
      { id: 15, a: 1, b: 1, c: 1, d: 1 },
      { id: 16, a: 1, b: 1, c: 1, d: 1 },
      { id: 17, a: 1, b: 1, c: 1, d: 1 },
      { id: 18, a: 1, b: 1, c: 1, d: 1 },
    ];
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'a',
        key: 'a',
        render: (text, record) => {
          return (
            <Fragment>
              <div className={styles.titlePoint} />
              <span className={styles.titleName}>{record.a}</span>
            </Fragment>
          );
        },
      },
      {
        title: '舆情级别',
        dataIndex: 'b',
        key: 'b',
        render: (text, record) => <span className={styles.levelText}>{record.b}</span>,
      },
      {
        title: '舆情内容',
        dataIndex: 'c',
        key: 'c',
        render: (text, record) => <a>{record.c}</a>,
      },
      {
        title: '检测日期',
        dataIndex: 'd',
        key: 'd',
      },
    ];

    const paginationProps = {
      pageSize: 10,
    };

    return (
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={TrendsData}
        pagination={paginationProps}
        className={styles.trendsTable}
      />
    );
  }
}
export default TrendsTableSpace;
