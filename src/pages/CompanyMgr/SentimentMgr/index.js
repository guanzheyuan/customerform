import React, { Fragment } from 'react';
import { Icon, Input } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SentimentEcharts from './conponents/SentimentEcharts';
import TrendsTableSpace from './conponents/TrendsTableSpace';

const { Search } = Input;

@connect(({ sentimentMgr }) => ({ sentimentMgr }))
class SentimentMgr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
  }

  componentDidMount() {
    /* const { dispatch } = this.props;
    dispatch({
      type: 'sentimentMgr/searchData',
      payload: {},
    }); */
  }

  changeCompany = e => {
    this.setState({
      inputText: e.target.value,
    });
  };

  render() {
    /* const {
      sentimentMgr: { echartsData },
    } = this.props; */
    const echartsData = {
      a: 320,
      b: 42,
      c: 12,
      d: '12%',
      e: '10%',
      f: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      g: [820, 932, 901, 934, 1290, 1330, 1320],
    };
    const { inputText } = this.state;
    const trendsTableSpaceProps = {
      inputText,
    };
    return (
      <Fragment>
        <div className={styles.detectSpace}>
          <div className={styles.headCircle} />
          <div className={styles.headTitle}>企业舆情监测</div>
          {echartsData.a && (
            <div className={styles.columSource}>
              <p style={{ marginTop: 20, marginBottom: 4 }}>舆情信息总计：</p>
              <span style={{ fontSize: 24, fontWeight: 'bold' }}>{echartsData.a}</span>
              <p style={{ display: 'inline-block', marginLeft: 30 }}>周同比</p>
              <Icon type="caret-up" style={{ color: 'green', marginLeft: 6 }} />
              <span style={{ marginLeft: 6 }}>{echartsData.d}</span>
              <p style={{ marginTop: 20, marginBottom: 4 }}>今日动态总量：</p>
              <span style={{ fontSize: 24, fontWeight: 'bold' }}>{echartsData.b}</span>
              <p style={{ display: 'inline-block', marginLeft: 30 }}>周环比</p>
              <Icon type="caret-down" style={{ color: 'red', marginLeft: 6 }} />
              <span style={{ marginLeft: 6 }}>{echartsData.e}</span>
              <p style={{ marginTop: 20, marginBottom: 4 }}>预警个数：</p>
              <span style={{ fontSize: 24, fontWeight: 'bold' }}>{echartsData.c}</span>
            </div>
          )}
          <SentimentEcharts />
        </div>
        <div className={styles.trendsTable}>
          <div className={styles.headCircle} />
          <div className={styles.headTitle} style={{ display: 'inline-block' }}>
            企业动态
          </div>
          <Search
            placeholder="企业名称"
            enterButton="搜索"
            className={styles.trendsList}
            onChange={e => this.changeCompany(e)}
          />
          <TrendsTableSpace {...trendsTableSpaceProps} />
        </div>
      </Fragment>
    );
  }
}
export default SentimentMgr;
