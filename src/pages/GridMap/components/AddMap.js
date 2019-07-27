/* eslint-disable array-callback-return */
/* eslint-disable no-array-constructor */
import React, { Component, Fragment } from 'react';
import { Row, Tooltip } from 'antd';
import { Map, MouseTool, Polygon, PolyEditor, Markers } from 'react-amap';

import styles from '../gridmap.less';

const drawImg = require('../../../assets/Pentagon.png');
const cancelImg = require('../../../assets/delete.png');
const resetImg = require('../../../assets/reset.png');
const areaImg = require('../../../assets/park.png');
const dragImg = require('../../../assets/edit_polygon.png');

class AddMap extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      showArealist: [],
      polygonActive: false,
    };

    this.toolEvents = {
      created: tool => {
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };

    this.editorEvents = {
      created: () => {},
      addnode: e => {
        this.updatePolygonData(e.target.getPath());
      },
      adjust: e => {
        this.updatePolygonData(e.target.getPath());
      },
      removenode: e => {
        this.updatePolygonData(e.target.getPath());
      },
      end: () => {},
    };
  }

  componentDidMount() {
    const { areaList, setAreaList } = this.props;
    const areaArray = new Array();
    areaList.map(item => {
      areaArray.push({ lng: item[0], lat: item[1] });
    });
    setAreaList(areaArray);
    this.setState({ showArealist: areaList });
  }

  drawPolygon = () => {
    this.setState({ showArealist: [] });
    if (this.tool) {
      this.tool.close(true);
      this.tool.polygon({ fillColor: '#fe7ca3', fillOpacity: 0.6, strokeColor: '#fff' });
    }
  };

  updatePolygonData = data => {
    const { setAreaList } = this.props;
    const arr = new Array();
    data.map(item => {
      arr.push({ lng: item.lng, lat: item.lat });
    });
    setAreaList(arr);
    this.setState({ showArealist: arr });
  };

  editPolygon = e => {
    /*
    将编辑区域变成可拖拽，拖拽完成后将数据提交
     */
    e.preventDefault();
    const { polygonActive } = this.state;
    this.setState({
      polygonActive: !polygonActive,
    });
    if (this.tool) {
      this.tool.close(true);
    }
  };

  drawWhat = obj => {
    const { setAreaList } = this.props;
    setAreaList(obj.getPath());
    this.setState({ showArealist: obj.getPath() });
    if (this.tool) {
      this.tool.close();
    }
  };

  deletePolygon = e => {
    e.preventDefault();
    const { setAreaList } = this.props;
    setAreaList([]);
    this.setState({ showArealist: [] });
    if (this.tool) {
      this.tool.close(true);
    }
  };

  resetPolygon = e => {
    e.preventDefault();
    const { setAreaList, areaList } = this.props;
    setAreaList(areaList);
    this.setState({ showArealist: areaList, polygonActive: false });
  };

  renderLayers = () => {
    const { showArealist, polygonActive } = this.state;
    return (
      <Polygon
        path={showArealist}
        zIndex={200}
        style={{ fillColor: '#fe7ca3', fillOpacity: 0.7, strokeColor: '#fff' }}
      >
        <PolyEditor active={polygonActive} events={this.editorEvents} />
      </Polygon>
    );
  };

  renderAllGrip = () => {
    const {
      areaList,
      gridmap: { defaultGrid },
    } = this.props;

    const showDefaultGrid = defaultGrid;

    /** grid中去重 */
    let removeIndex = -1;
    defaultGrid.map((item, index) => {
      if (item.length === areaList.length) {
        let flag = 0;
        item.map((point, pointIndex) => {
          if (point[0] !== areaList[pointIndex][0] || point[1] !== areaList[pointIndex][1]) {
            flag = -1;
          }
        });
        if (flag === 0) {
          removeIndex = index;
        }
      }
    });
    if (removeIndex !== -1) {
      showDefaultGrid.splice(removeIndex, 1);
    }

    return (
      <Polygon
        path={showDefaultGrid}
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
      gridmap: { defaultArea },
    } = this.props;
    const areaArray = new Array();
    defaultArea.map(postion => {
      areaArray.push({ position: { longitude: postion[0], latitude: postion[1] } });
    });
    return <Markers markers={areaArray} render={this.renderAreaLayout} zIndex={200} />;
  };

  render() {
    const { mapCenter, mapZoom } = this.props;
    const { showArealist } = this.state;
    return (
      <Fragment>
        <div className={styles.overOption}>
          <Row>
            {showArealist.length > 0 && (
              <Tooltip title="编辑网格">
                <img
                  alt="编辑网格"
                  className={styles.overIcon}
                  src={dragImg}
                  onClick={this.editPolygon}
                />
              </Tooltip>
            )}
          </Row>
          <Row>
            <Tooltip title="绘制地图">
              <img
                alt="绘制地图"
                className={styles.overIcon}
                src={drawImg}
                onClick={this.drawPolygon}
              />
            </Tooltip>
          </Row>
          <Row>
            <Tooltip title="重置">
              <img
                alt="重置"
                className={styles.overIcon}
                src={resetImg}
                onClick={this.resetPolygon}
              />
            </Tooltip>
          </Row>
          <Row>
            <Tooltip title="清空地图">
              <img
                alt="清空地图"
                className={styles.overIcon}
                src={cancelImg}
                onClick={this.deletePolygon}
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

export default AddMap;
