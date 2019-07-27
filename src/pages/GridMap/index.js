/* eslint-disable array-callback-return */
/* eslint-disable no-array-constructor */
import React, { Component } from 'react';
import { Card, Row, Col, Form, Checkbox } from 'antd';
import { Map, Marker, Polygon, Markers } from 'react-amap';

import { connect } from 'dva';

import SearchTree from './components/SearchTree';

import styles from './gridmap.less';

const markerImg = require('../../assets/company.png');
const areaImg = require('../../assets/park.png');
const areaActiveImg = require('../../assets/areaactive.png');

const pageSize = 5;
const FormItem = Form.Item;

const mapDispatchToProps = dispatch => {
  return {
    queryGridList: () => {
      dispatch({
        type: 'gridmap/queryGridList',
      });
    },
    queryGridDetail: param => {
      dispatch({
        type: 'gridmap/queryGridDetail',
        payload: { param },
        callback: data => {
          /* 获取企业列表信息 */
          if (data.gridLevel === '2') {
            dispatch({
              type: 'gridmap/queryGridCompany',
              payload: { id: data.id, pageNum: 1, pageSize },
            });
          }
        },
      });
    },
    queryGridCompany: (id, pageNum) => {
      dispatch({
        type: 'gridmap/queryGridCompany',
        payload: { id, pageNum, pageSize },
      });
    },
    queryDefaultGrid: () => {
      dispatch({
        type: 'gridmap/queryDefaultGrid',
      });
    },
    queryDefaultArea: () => {
      dispatch({
        type: 'gridmap/queryDefaultArea',
      });
    },
    queryDefaultCompany: () => {
      dispatch({
        type: 'gridmap/queryDefaultCompany',
      });
    },
    deleteTreeNode: (param, callback) => {
      dispatch({
        type: 'gridmap/deleteTreeNode',
        payload: { param },
        callback: data => {
          callback(data);
        },
      });
    },
    addGrid: (param, callback) => {
      dispatch({
        type: 'gridmap/addGrid',
        payload: { param },
        callback: data => {
          callback(data);
        },
      });
    },
    editGrid: (param, callback) => {
      dispatch({
        type: 'gridmap/updateGrid',
        payload: { param },
        callback: data => {
          callback(data);
        },
      });
    },
    getGridRespPerson: () => {
      dispatch({
        type: 'gridmap/getGridRespPerson',
      });
    },
  };
};

@connect(
  ({ gridmap }) => ({ gridmap }),
  mapDispatchToProps
)
@Form.create()
class GridMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layer1Show: true,
      layer2Show: true,
      layer3Show: false,
      selectedKeys: '',
    };
  }

  componentDidMount() {
    const {
      queryGridList,
      queryDefaultGrid,
      queryDefaultArea,
      queryDefaultCompany,
      getGridRespPerson,
    } = this.props;
    queryGridList();
    queryDefaultGrid();
    queryDefaultArea();
    queryDefaultCompany();
    getGridRespPerson();
  }

  setSelectedKeys = key => {
    this.setState({ selectedKeys: key });
  };

  onChangeGrid = e => {
    this.setState({
      layer1Show: e.target.checked,
    });
  };

  onChangeArea = e => {
    this.setState({
      layer2Show: e.target.checked,
    });
  };

  onChangeCompany = e => {
    this.setState({
      layer3Show: e.target.checked,
    });
  };

  renderMarkerLayout = () => {
    return (
      <div>
        <img alt="企业" src={markerImg} />
      </div>
    );
  };

  renderAreaLayout = () => {
    return (
      <div>
        <img alt="园区" src={areaImg} style={{ width: '20px' }} />
      </div>
    );
  };

  renderAreaActiveLayout = () => {
    return (
      <div>
        <img alt="园区" src={areaActiveImg} style={{ width: '20px' }} />
      </div>
    );
  };

  renderLayer1() {
    const { layer1Show } = this.state;
    const {
      gridmap: { defaultGrid },
    } = this.props;
    if (layer1Show) {
      return (
        <Polygon
          path={defaultGrid}
          style={{ fillColor: '#1791fc', fillOpacity: 0.6, strokeColor: '#fff' }}
        />
      );
    }
    const noneGrid = new Array();
    return <Polygon path={noneGrid} />;
  }

  renderLayer2() {
    const { layer2Show } = this.state;
    const {
      gridmap: { defaultArea },
    } = this.props;

    const areaArray = new Array();
    if (layer2Show) {
      defaultArea.map(postion => {
        areaArray.push({ position: { longitude: postion[0], latitude: postion[1] } });
      });
    }
    return <Markers markers={areaArray} render={this.renderAreaLayout} />;
  }

  renderLayer3() {
    const { layer3Show } = this.state;
    const {
      gridmap: { defaultCompany },
    } = this.props;
    const areaArray = new Array();
    if (layer3Show) {
      defaultCompany.map(postion => {
        areaArray.push({ position: { longitude: postion[0], latitude: postion[1] } });
      });
    }
    return <Markers markers={areaArray} render={this.renderMarkerLayout} />;
  }

  renderMarker() {
    const {
      gridmap: {
        gridDetails: { areaPoint, gridLevel, areaList },
      },
    } = this.props;

    /** 确定tree被选中 */
    const { selectedKeys } = this.state;
    if (selectedKeys === '') {
      return '';
    }

    if (gridLevel === '2' && typeof areaPoint !== 'undefined') {
      return <Marker position={areaPoint} render={this.renderAreaActiveLayout} zIndex={200} />;
    }
    if (gridLevel === '1' && typeof areaList !== 'undefined') {
      return (
        <Polygon
          zIndex={200}
          path={areaList}
          style={{ fillColor: '#fe7ca3', fillOpacity: 0.6, strokeColor: '#fff' }}
        />
      );
    }
    return '';
  }

  render() {
    const { layer1Show, layer2Show, layer3Show } = this.state;
    const { mapCenter, mapZoom } = this.props;
    return (
      <Card bodyStyle={{ padding: 0 }}>
        <Row gutter={24}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <SearchTree {...this.props} setSelectedKeys={this.setSelectedKeys} />
          </Col>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className={styles.overLayer}>
              <Form layout="inline">
                <FormItem label="" style={{ marginBottom: 0 }}>
                  <Checkbox checked={layer1Show} onChange={this.onChangeGrid}>
                    网格
                  </Checkbox>
                </FormItem>
                <FormItem label="" style={{ marginBottom: 0 }}>
                  <Checkbox checked={layer2Show} onChange={this.onChangeArea}>
                    园区
                  </Checkbox>
                </FormItem>
                <FormItem label="" style={{ marginBottom: 0 }}>
                  <Checkbox checked={layer3Show} onChange={this.onChangeCompany}>
                    企业
                  </Checkbox>
                </FormItem>
              </Form>
            </div>
            <div className={styles.gridMap}>
              <Map amapkey="d4430fc1b168a2bf0478eb64a3458b39" zoom={mapZoom} center={mapCenter}>
                {this.renderMarker()}
                {this.renderLayer1()}
                {this.renderLayer2()}
                {this.renderLayer3()}
              </Map>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}

GridMap.defaultProps = {
  mapCenter: { longitude: 118.774552, latitude: 31.976766 },
  mapZoom: 14,
};

export default GridMap;
