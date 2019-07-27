/* eslint-disable no-array-constructor */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, message, Tabs, Table } from 'antd';
import echarts from 'echarts/lib/echarts';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import styles from './portrait.less';

const { TabPane } = Tabs;

const mapDispatchToProps = dispatch => {
  return {
    queryEnterpriseinfo: param => {
      dispatch({
        type: 'portrait/queryEnterpriseinfo',
        payload: param,
      });
    },
    queryTabdetail: param => {
      dispatch({
        type: 'portrait/queryTabdetail',
        payload: param,
      });
    },
    queryTablist: () => {
      dispatch({
        type: 'portrait/queryTablist',
        callback: tab => {
          dispatch({
            type: 'portrait/queryTabdetail',
            payload: tab,
          });
        },
      });
    },
  };
};

@Form.create()
@connect(
  ({ portrait }) => ({ portrait }),
  mapDispatchToProps
)
class Portrait extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      queryEnterpriseinfo,
      queryTablist,
      location: {
        state: { data },
      },
    } = this.props;
    if (typeof data === 'undefined' || data === '') {
      message.warn('页面有误！！');
      return;
    }
    queryEnterpriseinfo(data);
    queryTablist();
    this.drawRadar();
  }

  drawRadar = () => {
    /* const companyRadarData = {
      "hypf": {},
      "qypf": {},
      "citypf": {
        "creditScore": "66.56",
        "humanResourceScore": "20.83",
        "innovationScore": "0.7",
        "operatorScore": "17.27",
        "resourceScore": "25.45",
        "socialRespScore": "10"
      }
    }; */
    const seriesData = [];
    const seriesDataOne = ['66.56', '20.83', '0.7', '17.27', '25.45', '10'];
    const seriesDataTwo = [];

    /* for (var key in companyRadarData.citypf) {
      seriesDataOne.push(companyRadarData.citypf[key]);
    }
    for (var key in companyRadarData.hypf) {
      seriesDataTwo.push(companyRadarData.hypf[key]);
    }
    for (var key in companyRadarData.qypf) {
      seriesData.push(companyRadarData.qypf[key]);
    }
 */
    const legendName = ['全南京平均值', '同行业平均值', '本企业评分'];
    const option = {
      legend: {
        data: legendName,
        bottom: -5,
      },
      tooltip: {
        show: true,
        trigger: 'item',
        position(pos, _params, _dom, _rect, size) {
          const obj = { top: 60 };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        },
      },

      radar: {
        axisLabel: {
          show: false,
          fontSize: 18,
          color: '#fff',
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'grey',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'grey',
          },
        },
        indicator: [
          { name: '信用指数', max: 100 },
          { name: '人力资源指数', max: 100 },
          { name: '创新指数', max: 100 },
          { name: '运营指数', max: 100 },
          { name: '资源指数', max: 100 },
          { name: '社会责任指数', max: 100 },
        ],
        nameGap: 5,
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: seriesDataOne,
              symbol: 'circle',
              symbolSize: 5,
              name: legendName[0],
              itemStyle: {
                normal: {
                  // color : "rgb(144,212,112)",
                  color: 'rgba(245, 166, 35, 1)',
                  borderColor: 'rgba(245, 166, 35, 0.3)',
                  borderWidth: 2,
                },
              },
              lineStyle: {
                normal: {
                  // color:"rgb(144,212,112)",
                  // type: "dashed",
                  color: 'rgba(245, 166, 35, 1)',
                  width: 2,
                },
              },
              label: {
                normal: {
                  show: true,
                  formatter(params) {
                    return params.value;
                  },
                },
              },
            },
            {
              value: seriesDataTwo,
              name: legendName[1],
              symbol: 'circle',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: 'rgba(19, 173, 255, 1)',
                  borderColor: 'rgba(19, 173, 255, 0.4)',
                  borderWidth: 2,
                },
              },
              lineStyle: {
                normal: {
                  color: 'rgba(19, 173, 255, 1)',
                  width: 2,
                  // type: "dashed"
                },
              },
              label: {
                normal: {
                  show: true,
                  formatter(params) {
                    return params.value;
                  },
                },
              },
            },
            {
              value: seriesData,
              name: legendName[2],
              symbol: 'circle',
              symbolSize: 5,
              label: {
                normal: {
                  show: true,
                  formatter(params) {
                    return params.value;
                  },
                },
              },
              lineStyle: {
                normal: {
                  color: '#e95677',
                },
              },
              itemStyle: {
                normal: {
                  // color:"#0b96e9"
                  color: '#e95677',
                },
              },
            },
          ],
        },
      ],
    };
    const myChart = echarts.init(document.getElementById('portraitCharts'));
    myChart.setOption(option);
  };

  onOperationTabChange = key => {
    if (key === 'basic' || key === 'tax') {
      const { queryTabdetail } = this.props;
      queryTabdetail(key);
    }
  };

  renderTabDetail = tabInfo => {
    if (tabInfo.display_type === '0') {
      return tabInfo.data_list.map(itemInfo => (
        <Col
          className={styles.listCol}
          key={itemInfo.id}
          span={(Number(itemInfo.content_grid_col) + Number(itemInfo.label_grid_col)) * 2}
        >
          {itemInfo.label_cname}：{itemInfo.label_value}
        </Col>
      ));
    }
    if (tabInfo.display_type === '1') {
      return (
        <Fragment>
          {tabInfo.data_list.map(data => (
            <Fragment key={data.table_name}>
              <h3 className={styles.tableTitle}>{data.title}</h3>
              <Table dataSource={data.list_data} columns={data.list_col} pagination={false} />
            </Fragment>
          ))}
        </Fragment>
      );
    }
    return '';
  };

  backFunction = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  render() {
    const {
      portrait: { enterpriseInfo, tabList, tabDetail },
    } = this.props;

    const description = (
      <Row>
        <Col span={16}>
          <h2>{enterpriseInfo.data.label_value}</h2>
          <Row>
            {enterpriseInfo.data.main_data_list.map(labelItem => (
              <Col
                key={labelItem.id}
                span={(Number(labelItem.label_grid_col) + Number(labelItem.content_grid_col)) * 2}
                style={{ marginBottom: 8 }}
              >
                <span className={styles.labelName}>{labelItem.label_cname}：</span>
                {labelItem.label_value}
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={8}>
          <div id="portraitCharts" style={{ width: '100%', height: 220 }} />
        </Col>
      </Row>
    );
    return (
      <PageHeaderWrapper title="企业画像" backFunction={this.backFunction} backBtnShow>
        <Fragment>
          <Card style={{ marginBottom: 10 }}>{description}</Card>
          <Card bordered={false}>
            <Tabs defaultActiveKey="basic" onChange={this.onOperationTabChange}>
              {tabList.map(tab => (
                <TabPane tab={tab.tab} key={tab.key}>
                  <Row>
                    {tabDetail[tab.key] !== '' ? this.renderTabDetail(tabDetail[tab.key][0]) : ''}
                  </Row>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default Portrait;
