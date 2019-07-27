import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Row, Col, Radio, Checkbox } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { connect } from 'dva';

@connect(({ economyRule, loading }) => ({
  economyRule,
  loading: loading.models.economyRule,
}))
class IndustialEconomyChart extends PureComponent {
  componentWillMount() {
    this.setState({ radioValue: '1', checkValue: ['1'] });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/getJjyxidexinfoList',
      payload: {},
      callback: response => {
        console.log(`response = ${JSON.stringify(response)}`);
      },
    });

    const myChart = echarts.init(document.getElementById('main'));
    this.setState({
      chart: myChart,
    });

    // 绘制图表
    myChart.setOption({
      title: { text: '环比分析' },
      tooltip: {},
      xAxis: {
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20],
        },
        {
          name: '进货',
          type: 'line',
          data: [10, 230, 316, 50, 50, 120],
        },
      ],
    });
  }

  handleSizeChange = e => {
    const checkValue = e.target.value;
    const { chart } = this.state;
    if (checkValue === '1') {
      chart.setOption({
        title: { text: '环比分析' },
        tooltip: {},
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20],
          },
          {
            name: '进货',
            type: 'line',
            data: [10, 230, 316, 50, 50, 120],
          },
        ],
      });
    } else {
      chart.setOption({
        title: { text: '同比分析' },
        tooltip: {},
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
            barWidth: '0%',
            barCategoryGap: 30,
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255,37,117,0.7)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(0,133,245,0.7)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,133,245,0.3)',
                    },
                  ],
                  globalCoord: false,
                },
              },
            },
          },
          {
            name: '进货',
            type: 'bar',
            data: [10, 230, 316, 50, 50, 120],
            barWidth: 'auto',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255,37,117,0.7)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(0,255,252,0.7)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,255,252,0.3)',
                    },
                  ],
                  globalCoord: false,
                },
              },
            },
          },
          {
            name: '进货2',
            type: 'bar',
            data: [10, 230, 316, 50, 50, 120],
            barWidth: 'auto',
          },
        ],
      });
    }

    this.setState({ radioValue: e.target.value });
  };

  onCheckChange = checkedValues => {
    this.setState({ checkValue: checkedValues });
  };

  render() {
    const { radioValue, checkValue } = this.state;
    return (
      <PageHeaderWrapper title="产业经济可视化">
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={4}>产业经济发展</Col>
            <Col span={8}>
              <Radio.Group value={radioValue} onChange={this.handleSizeChange}>
                <Radio.Button value="1">环比分析</Radio.Button>
                <Radio.Button value="2">同比分析</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={2}>多选:</Col>
            <Col span={10}>
              <Checkbox.Group
                defaultValue={checkValue}
                style={{ width: '100%' }}
                onChange={this.onCheckChange}
              >
                <Row>
                  <Col span={8}>
                    <Checkbox value="1">软件产业</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="2">人工智能</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="3">金融</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={8}>
              <p style={{ color: '#ccc', fontSize: 14, lineHeight: '35px' }}>
                2019软件产业值
                <br />
                <abbr style={{ color: '#444', fontSize: 30 }}>
                  1224,543,233
                  <abbr style={{ color: '#ccc', fontSize: 14 }}>元</abbr>
                </abbr>
              </p>
            </Col>
            <Col span={8}>
              <p style={{ color: '#ccc', fontSize: 14, lineHeight: '35px' }}>
                2019人工智能产业值
                <br />
                <abbr style={{ color: '#444', fontSize: 30 }}>
                  4，543，980
                  <abbr style={{ color: '#ccc', fontSize: 14 }}>元</abbr>
                </abbr>
              </p>
            </Col>
            <Col span={8}>
              <p style={{ color: '#ccc', fontSize: 14, lineHeight: '35px' }}>
                产值差值总额
                <br />
                <abbr style={{ color: '#444', fontSize: 30 }}>12亿元</abbr>
              </p>
            </Col>
          </Row>

          <div id="main" style={{ width: 1200, height: 600 }} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default IndustialEconomyChart;
