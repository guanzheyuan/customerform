import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import styles from './style.less';

class NaTongLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { infoDatas } = this.props;
    return (
      <Fragment>
        <div className={styles.naTongLeftTop}>
          <h3>{infoDatas.dashboard_title}</h3>
          <ul>
            {infoDatas.dashboard_list &&
              infoDatas.dashboard_list.map(item => {
                return (
                  <li key={item.id}>
                    <p>{item.statName}</p>
                    <mark>{item.statValue}</mark>
                    <span>{item.statValueUnit}</span>
                    {item.statValueUnit === '%' && item.statValue > 0 && (
                      <Icon type="caret-up" style={{ color: '#00A854' }} />
                    )}
                    {item.statValueUnit === '%' && item.statValue < 0 && (
                      <Icon type="caret-down" style={{ color: '#f00' }} />
                    )}
                  </li>
                );
              })}
          </ul>
          <a>查看完整统计台账&gt;&gt;</a>
        </div>
        <div className={styles.naTongLeftMiddle}>
          <h4>纳统资料</h4>
          <ul>
            <li>
              <Icon type="compass" />
              <a>申报指南</a>
            </li>
            <li>
              <Icon type="sound" />
              <a>申报通知</a>
            </li>
            <li>
              <Icon type="book" />
              <a>申报材料</a>
            </li>
            <li>
              <Icon type="dollar" />
              <a>政策奖励</a>
            </li>
          </ul>
        </div>
        <div className={styles.naTongLeftBottom}>
          <h4>
            纳统报表<a>新增报表</a>
          </h4>
          <ul>
            <li>
              <span> </span>
              <a>2018年统计年报</a>
            </li>
            <li>
              <span> </span>
              <a>2018年定期统计报表</a>
            </li>
            <li>
              <span> </span>
              <a>固定资产投资统计报表制度</a>
            </li>
          </ul>
        </div>
      </Fragment>
    );
  }
}
export default NaTongLeft;
