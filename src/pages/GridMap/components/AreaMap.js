/* eslint-disable array-callback-return */
/* eslint-disable no-array-constructor */
import React, { Component, Fragment } from 'react';
import { Row, Tooltip } from 'antd';
import { Map, MouseTool, Marker, Polygon, Markers } from 'react-amap';

import styles from '../gridmap.less';

const drawImg = require('../../../assets/mapposition.png');
const cancelImg = require('../../../assets/delete.png');
const resetImg = require('../../../assets/reset.png');
const areaImg = require('../../../assets/park.png');

class AreaMap extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      areaPosition: [],
    };

    this.toolEvents = {
      created: tool => {
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };
  }

  componentDidMount() {
    const { areaPosition, setAreaPosition } = this.props;
    this.setState({ areaPosition });
    if (areaPosition.length === 2) {
      setAreaPosition({ lng: areaPosition[0], lat: areaPosition[1] });
    }
  }

  drawMaker = () => {
    this.setState({ areaPosition: [] });
    if (this.tool) {
      this.tool.close(true);
      this.tool.marker();
    }
  };

  drawWhat = obj => {
    const { setAreaPosition } = this.props;
    setAreaPosition(obj.getPosition());
    if (this.tool) {
      this.tool.close();
    }
  };

  deleteMaker = e => {
    e.preventDefault();
    const { setAreaPosition } = this.props;
    if (this.tool) {
      this.tool.close(true);
    }
    this.setState({ areaPosition: [] });
    setAreaPosition({});
  };

  resetMaker = e => {
    e.preventDefault();
    const { setAreaPosition, areaPosition } = this.props;
    this.setState({ areaPosition });
    setAreaPosition(areaPosition);
    if (this.tool) {
      this.tool.close(true);
    }
  };

  renderLayers = () => {
    const { areaPosition } = this.state;
    if (areaPosition.length === 0) {
      return '';
    }
    return <Marker position={areaPosition} />;
  };

  renderAllGrip = () => {
    const {
      gridmap: { defaultGrid },
    } = this.props;
    return (
      <Polygon
        path={defaultGrid}
        zIndex={100}
        style={{ fillColor: '#1791fc', fillOpacity: 0.6, strokeColor: '#fff' }}
      />
    );
  };

  renderAreaLayout = () => {
    return (
      <div>
        <img alt="园区" src={areaImg} style={{ width: '20px' }} />
      </div>
    );
  };

  renderAllArea = () => {
    const {
      areaPosition,
      gridmap: { defaultArea },
    } = this.props;
    const areaArray = new Array();
    defaultArea.map(postion => {
      if (areaPosition[0] !== postion[0] && areaPosition[1] !== postion[1]) {
        areaArray.push({ position: { longitude: postion[0], latitude: postion[1] } });
      }
    });
    return <Markers markers={areaArray} render={this.renderAreaLayout} zIndex={200} />;
  };

  render() {
    const { mapCenter, mapZoom } = this.props;
    return (
      <Fragment>
        <div className={styles.overOption}>
          <Row>
            <Tooltip title="打点">
              <img alt="打点" className={styles.overIcon} src={drawImg} onClick={this.drawMaker} />
            </Tooltip>
          </Row>
          <Row>
            <Tooltip title="重置">
              <img
                alt="重置"
                className={styles.overIcon}
                src={resetImg}
                onClick={this.resetMaker}
              />
            </Tooltip>
          </Row>
          <Row>
            <Tooltip title="清空地图">
              <img
                alt="清空"
                className={styles.overIcon}
                src={cancelImg}
                onClick={this.deleteMaker}
              />
            </Tooltip>
          </Row>
        </div>
        <Map amapkey="d4430fc1b168a2bf0478eb64a3458b39" zoom={mapZoom} center={mapCenter}>
          <MouseTool events={this.toolEvents} />
          {this.renderLayers()}
          {this.renderAllGrip()}
          {this.renderAllArea()}
        </Map>
      </Fragment>
    );
  }
}

export default AreaMap;
