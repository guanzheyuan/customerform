import React, { Fragment } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from './style.less';

class LineEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('lineEcharts'));
    myChart.setOption({
      grid: {
        top: '10%',
        left: '40px',
        right: '3%',
        bottom: '40px',
      },
      tooltip: {
        trigger: 'axis',
        formatter: param => {
          let tip = '';
          if (param != null && param.length > 0) {
            tip += `${param[0].name}年<br>`;
            for (let i = 0; i < param.length; i += 1) {
              tip += `${param[i].marker}${param[i].seriesName} : ${param[i].value}w<br>`;
            }
          }
          return tip;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '江苏润和软件股份有限公司',
          data: [1000, 3000, 4000, 2500, 1800, 3330, 4320, 2900],
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#0000ff',
              lineStyle: {
                color: '#0000ff',
              },
            },
          },
        },
        {
          name: '小米科技有限责任公司',
          data: [1500, 800, 3200, 3500, 1500, 2330, 5320, 3900],
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#ff168a',
              lineStyle: {
                color: '#ff168a',
              },
            },
          },
        },
      ],
    });
  }

  render() {
    return (
      <Fragment>
        <div id="lineEcharts" className={styles.lineEcharts} />
      </Fragment>
    );
  }
}
export default LineEcharts;
