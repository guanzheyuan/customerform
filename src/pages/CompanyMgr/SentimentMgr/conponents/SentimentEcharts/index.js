import React, { Fragment } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from './style.less';

class SentimentEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('modelEcharts'));
    myChart.setOption({
      grid: {
        top: '10%',
        left: '40px',
        right: '3%',
        bottom: '40px',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#0000ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 0, 255, 0.5)',
                },
                {
                  offset: 1,
                  color: '#FFFFFF',
                },
              ],
              global: false,
            },
          },
        },
      ],
    });
  }

  render() {
    return (
      <Fragment>
        <span style={{ paddingLeft: 40 }}>
          舆情信息变化趋势图（横坐标：时间－每日，纵坐标：每日统计舆情总数）
        </span>
        <div id="modelEcharts" className={styles.modelEcharts} />
      </Fragment>
    );
  }
}
export default SentimentEcharts;
