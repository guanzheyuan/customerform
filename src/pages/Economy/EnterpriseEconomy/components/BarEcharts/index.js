import React, { Fragment } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import styles from './style.less';

class BarEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('barEcharts'));
    myChart.setOption({
      grid: {
        top: '10%',
        left: '40px',
        right: '3%',
        bottom: '60px',
      },
      tooltip: {
        trigger: 'axis',
        formatter: param => {
          let tip = '';
          if (param != null && param.length > 0) {
            tip += `${param[0].name}<br>`;
            for (let i = 0; i < param.length; i += 1) {
              tip += `${param[i].marker}${param[i].seriesName} : ${param[i].value}<br>`;
            }
          }
          return tip;
        },
      },
      legend: {
        orient: 'horizontal',
        x: '40',
        y: 'bottom',
        data: [
          {
            name: '>150s',
            icon: 'circle',
          },
          {
            name: '90~150s',
            icon: 'circle',
          },
          {
            name: '80~90s',
            icon: 'circle',
          },
          {
            name: '<80s',
            icon: 'circle',
          },
        ],
      },
      xAxis: {
        type: 'category',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '>150s',
          data: [15, 30, 25, 40, 30, 20, 40, 50, 50, 40, 30, 10],
          type: 'bar',
          barCategoryGap: '30%',
        },
        {
          name: '90~150s',
          data: [30, 20, 10, 60, 40, 25, 28, 30, 10, 33, 65, 46],
          type: 'bar',
        },
        {
          name: '80~90s',
          data: [35, 15, 40, 50, 30, 55, 35, 40, 30, 20, 10, 30],
          type: 'bar',
        },
        {
          name: '<80s',
          data: [20, 10, 30, 20, 50, 40, 20, 10, 38, 10, 40, 50],
          type: 'bar',
        },
      ],
    });
  }

  render() {
    return (
      <Fragment>
        <div id="barEcharts" className={styles.barEcharts} />
      </Fragment>
    );
  }
}
export default BarEcharts;
