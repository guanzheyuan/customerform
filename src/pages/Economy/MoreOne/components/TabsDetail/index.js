import React, { Component } from 'react';
import { Tabs } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const yugu = require('../../../../../assets/yugu.png');
const xiangmu = require('../../../../../assets/xiangmu.png');

const { TabPane } = Tabs;
class TabsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.drawRadar();
  }

  drawRadar = () => {
    const { gridInfo } = this.props;
    const yData = gridInfo.project_process.yaxis;
    const xPlanStart = gridInfo.project_process.plan_start;
    const xPlanEnd = gridInfo.project_process.plan_end;
    const xProcessStart = gridInfo.project_process.process_start;
    const xProcessEnd = gridInfo.project_process.process_end;
    const option = {
      grid: {
        containLabel: true,
        left: 0,
        top: 10,
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        data: yData,
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          let res = `${params[0].name}</br>`;
          const date0 = params[0].data;
          const date1 = params[1].data;
          const date2 = params[2].data;
          const date3 = params[3].data;
          // date0 = `${date0.getFullYear()  }-${  date0.getMonth() + 1  }-${  date0.getDate()}`;
          // date1 = `${date1.getFullYear()  }-${  date1.getMonth() + 1  }-${  date1.getDate()}`;
          // date2 = `${date2.getFullYear()  }-${  date2.getMonth() + 1  }-${  date2.getDate()}`;
          // date3 = `${date3.getFullYear()  }-${  date3.getMonth() + 1  }-${  date3.getDate()}`;
          res += `${params[0].seriesName}~${params[1].seriesName}:</br>${date0}~${date1}</br>`;
          res += `${params[2].seriesName}~${params[3].seriesName}:</br>${date2}~${date3}</br>`;
          return res;
        },
      },
      series: [
        {
          name: '计划开始时间',
          type: 'bar',
          stack: 'test1',
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)',
            },
          },
          data: xPlanStart,
        },
        {
          name: '计划结束时间',
          type: 'bar',
          stack: 'test1',
          // 修改地方2
          itemStyle: {
            normal: {
              color: '#F98563',
            },
          },
          data: xPlanEnd,
        },
        {
          name: '实际开始时间',
          type: 'bar',
          stack: 'test2',
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)',
            },
          },
          data: xProcessStart,
        },
        {
          name: '实际结束时间',
          type: 'bar',
          stack: 'test2',
          // 修改地方3
          itemStyle: {
            normal: {
              color: '#A2E068',
            },
          },
          data: xProcessEnd,
        },
      ],
    };
    const myChart = echarts.init(document.getElementById('ganTeCharts'));
    myChart.setOption(option);
  };

  handlecallback = key => {
    console.log(key);
  };

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={this.handlecallback}>
        <TabPane tab="项目进度" key="1">
          <div id="ganTeCharts" style={{ width: '100%', height: 500 }} />
        </TabPane>
        <TabPane tab="项目鱼骨图" key="2">
          <img src={yugu} alt="" />
        </TabPane>
        <TabPane tab="形象进度" key="3">
          <img src={xiangmu} alt="" />
        </TabPane>
      </Tabs>
    );
  }
}

export default TabsDetail;
