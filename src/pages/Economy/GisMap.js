import React, { PureComponent } from 'react';
import { Map, Polygon, Marker, InfoWindow } from 'react-amap';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { TreeSelect, Row, Col, Tree, Radio } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

const { SHOW_PARENT } = TreeSelect;
const { TreeNode } = Tree;

@connect(({ economyRule, loading }) => ({
  economyRule,
  loading: loading.models.economyRule,
}))
class Amap extends PureComponent {
  cashData = {
    index_q: 0,
    maxValue: 0,
    once: 1,
    maxLat: 0,
    minLat: 99999,
    maxLng: 0,
    minLng: 99999,
  };

  state = {
    radioValue: '1',
    infoWindowPot: { longitude: 118.749941, latitude: 31.973993 },
    isVisiable: false,
    infoWindowValue: 0,
    treeData: [],
    treeData2: [],
    value: ['1'],
    expandedKeys: ['0-0', '0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0', '0-0-1'],
    selectGridKeys: [],
    selectEnterprise: [],
    selectedKeys: [],
    areaPots: [],
    jjyxIndexListRes: {},
    gridListRes: {},
    emableRes: {},
    floatDivList: [],
    mapCenter: { longitude: 118.749941, latitude: 31.973993 },
    polyColors: ['#ffff5c', '#fae14e', '#f5c43f', '#f0a441', '#eb8836', '#ed742e'],
  };

  constructor() {
    super();

    this.windowEvents = {
      created: () => {},
      open: () => {},
      close: () => {},
      change: () => {},
    };

    this.polyEvents = {
      mouseover: e => {
        const poly = e.target;
        const { extData } = poly.Ge;
        this.setState({
          infoWindowPot: extData.pot,
          isVisiable: true,
          infoWindowValue: extData.indexValue,
        });
      },
      mouseout: () => {
        this.setState({
          isVisiable: false,
        });
      },
    };
  }

  componentDidMount() {
    this.getGrids();
  }

  getGrids() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/gridList',
      callback: response => {
        this.setState({
          gridListRes: response,
        });
        this.getEnterprise();
      },
    });
  }

  getEnterprise() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/emlabelList',
      callback: response => {
        this.setState({
          emableRes: response,
        });
        this.getIndexs();
      },
    });
  }

  getIndexs() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/searchtype',
      callback: response => {
        this.setState({
          jjyxIndexListRes: response,
        });
        this.refreshIndex();
      },
    });
  }

  getmapinfo(selectEnterprise, selectGridKeys, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/mapinfo',
      payload: {
        gridIdList: selectGridKeys,
        indexTypeId: value[0],
        labelIdList: selectEnterprise,
      },
      callback: response => {
        this.refreshFloatDivMap(response);
      },
    });
  }

  onChange = value => {
    const { selectEnterprise, selectGridKeys } = this.state;
    this.setState({ value: [value] });
    this.getmapinfo(selectEnterprise, selectGridKeys, [value]);
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, info) => {
    const { checkedNodes } = info;
    const selectEnterprise = [];
    const selectGridKeys = [];
    for (let i = 0; i < checkedNodes.length; i += 1) {
      const { key } = checkedNodes[i];
      if (key.indexOf('0-0-') >= 0) {
        // 企业类型
        const { value } = checkedNodes[i].props;
        selectEnterprise.push(value);
      }
      if (key.indexOf('0-1-') >= 0) {
        // 网格
        const { value } = checkedNodes[i].props;
        selectGridKeys.push(value);
      }
    }
    this.setState({ checkedKeys, selectEnterprise, selectGridKeys });
    const { value } = this.state;
    this.getmapinfo(selectEnterprise, selectGridKeys, value);
  };

  onSelect = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handleRadioChange = e => {
    const checkValue = e.target.value;
    if (checkValue === '2') {
      // 企业指标
      router.push({
        pathname: '/Economy/EnterpriseGisMap',
      });
    }

    // this.setState({
    //   radioValue:checkValue,
    // });
  };

  // 获取中间经纬度
  getMinddleLatLng = path => {
    let maxLat = 0;
    let minLat = 99999;
    let maxLng = 0;
    let minLng = 99999;

    for (let i = 0; i < path.length; i += 1) {
      const pot = path[i];
      const lat = pot[1];
      const lng = pot[0];
      if (lat > maxLat) {
        maxLat = lat;
      }
      if (lat < minLat) {
        minLat = lat;
      }
      if (lng > maxLng) {
        maxLng = lng;
      }
      if (lng < minLng) {
        minLng = lng;
      }
    }

    // 全局中间经纬度
    if (maxLat > this.cashData.maxLat) {
      this.cashData.maxLat = maxLat;
    }
    if (minLat < this.cashData.minLat) {
      this.cashData.minLat = minLat;
    }
    if (maxLng > this.cashData.maxLng) {
      this.cashData.maxLng = maxLng;
    }
    if (minLng < this.cashData.minLng) {
      this.cashData.minLng = minLng;
    }
    const middleLat = (maxLat + minLat) / 2;
    const middlelng = (maxLng + minLng) / 2;
    const minddlePot = {
      longitude: middlelng,
      latitude: middleLat,
    };
    return minddlePot;
  };

  markerMap = () => {
    const { areaPots } = this.state;
    if (areaPots !== null && areaPots.length > 0) {
      const element = areaPots.map((areapot, index) => {
        const path = areapot.areaList;
        const middlePot = this.getMinddleLatLng(path);
        const key = `${index}_mark`;
        return (
          <Marker position={middlePot} key={key}>
            <div>
              <h1
                style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#ffffff',
                  textShadow: '#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0',
                }}
              >
                {areapot.gridName}
              </h1>
            </div>
          </Marker>
        );
      });

      if (this.cashData.once === 1) {
        // 设置地图初始化中心点
        const globallat = (this.cashData.maxLat + this.cashData.minLat) / 2;
        const globallng = (this.cashData.maxLng + this.cashData.minLng) / 2;
        this.setState({
          mapCenter: { longitude: globallng, latitude: globallat },
        });
        this.cashData.once = 2;
      }
      return element;
    }

    return null;
  };

  polygonMap = () => {
    this.cashData.index_q += 1;
    const { areaPots, polyColors } = this.state;
    const { maxValue } = this.cashData;
    if (areaPots !== null && areaPots.length > 0) {
      const element = areaPots.map((areapot, index) => {
        const path = areapot.areaList;
        const middlePot = this.getMinddleLatLng(path);
        const { indexValue } = areapot;
        const mindleValue = maxValue / 5;
        const i = (indexValue / mindleValue).toFixed(0);
        let colorStr = polyColors[i];
        if (indexValue === 0) {
          colorStr = '#cccccc';
        }
        const key = `${index}_map`;
        return (
          <Polygon
            path={path}
            key={key}
            style={{
              fillColor: colorStr,
              fillOpacity: 0.7,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }}
            events={this.polyEvents}
            extData={{ indexValue, pot: middlePot, gridName: areapot.gridName }}
          />
        );
      });

      return element;
    }

    return null;
  };

  refreshIndex() {
    // 指标格式化
    const { jjyxIndexListRes, emableRes, gridListRes } = this.state;
    const treeData = [];
    const value = [];
    for (let i = 0; i < jjyxIndexListRes.length; i += 1) {
      const originType = jjyxIndexListRes[i];
      const subtype = {
        title: originType.parentTypeName,
        key: `0-${i}`,
        value: `0-${i}`,
        disable: false,
        selectable: false,
        isLeaf: false,
        children: [],
      };
      const children = [];
      for (let j = 0; j < originType.childDataList.length; j += 1) {
        const origindatatype = originType.childDataList[j];
        const datatype = {
          title: origindatatype.indexName,
          value: origindatatype.id,
          key: `0-${i}-${j}`,
        };
        if (i === 0 && j === 0) {
          value.push(origindatatype.id);
        }
        children.push(datatype);
      }
      subtype.children = children;
      treeData.push(subtype);
    }
    // 企业类型格式化
    // 初始化选中数据
    const expandedKeys = [];
    const checkedKeys = [];
    const selectEnterprise = [];
    const enterpriseList = [];
    const emables = emableRes.data;
    const emteriseData = {
      title: emables.levelName,
      key: '0-0',
      value: '0-0',
      children: [],
    };
    expandedKeys.push('0-0');
    const emterchildren = emteriseData.children;
    const emableList = emables.levelData;
    for (let i = 0; i < emableList.length; i += 1) {
      const emable = emableList[i];
      const subemable = {
        title: emable.labelName,
        key: `0-0-${i}`,
        value: emable.id,
      };
      if (i === 0) {
        checkedKeys.push(`0-0-${i}`);
        selectEnterprise.push(emable.id);
      }
      emterchildren.push(subemable);
    }
    enterpriseList.push(emteriseData);
    // 网格继续加入
    const grid = gridListRes.data;
    const gridData = {
      title: grid.levelName,
      key: '0-1',
      value: '0-1',
      children: [],
    };
    expandedKeys.push('0-1');
    // 初始化选了哪些网格
    const selectGridKeys = [];
    const gridchildren = gridData.children;
    const grids = grid.levelData;
    for (let i = 0; i < grids.length; i += 1) {
      const origingrid = grids[i];
      const subgrid = {
        title: origingrid.gridName,
        key: `0-1-${i}`,
        value: origingrid.id,
      };
      checkedKeys.push(`0-1-${i}`);
      gridchildren.push(subgrid);
      selectGridKeys.push(origingrid.id);
    }
    enterpriseList.push(gridData);

    this.setState({
      treeData,
      treeData2: enterpriseList,
      expandedKeys,
      autoExpandParent: false,
      selectEnterprise,
      selectGridKeys,
      checkedKeys,
      value,
    });

    this.getmapinfo(selectEnterprise, selectGridKeys, value);
  }

  refreshFloatDivMap(response) {
    const areaPots = [];
    let sumValue = 0;
    for (let i = 0; i < response.length; i += 1) {
      const grid = response[i];
      areaPots.push(grid);
      sumValue += grid.indexValue;
    }
    // 将sumValue分6个范围
    const mindleValue = sumValue / 5;
    const floatDivList = [];
    let currentValue = 0;
    for (let i = 0; i < 6; i += 1) {
      let rowElement = '';
      currentValue += mindleValue;
      if (i === 0) {
        // 开始部分
        rowElement = `< ${currentValue.toFixed(1)}`;
      } else if (i === 5) {
        rowElement = `>= ${currentValue.toFixed(1)}`;
      } else {
        rowElement = `${(currentValue - mindleValue).toFixed(1)}-${currentValue.toFixed(1)}`;
      }
      floatDivList.push(rowElement);
    }

    this.setState({
      areaPots,
      floatDivList,
    });
    this.cashData.maxValue = sumValue;
  }

  renderInfoWindow() {
    const { infoWindowPot, infoWindowValue, isVisiable } = this.state;
    const html = `<div style="width:130;height:30;line-height:30px;text-align:center;back;background-color: rgba(255,255,255,0.8);;">${infoWindowValue}</div>`;
    const isCustom = false;
    const element = (
      <InfoWindow
        position={infoWindowPot}
        visible={isVisiable}
        isCustom={isCustom}
        content={html}
        size={{ width: 130, height: 50 }}
        offset={[0, 0]}
        events={this.windowEvents}
      />
    );

    return element;
  }

  renderEnterpriseTree = () => {
    const { expandedKeys, autoExpandParent, checkedKeys, selectedKeys, treeData2 } = this.state;
    if (treeData2 === null || treeData2.length <= 0) {
      return null;
    }
    const element = (
      <div style={{ width: '100%', height: '600px', backgroundColor: '#ffffff' }}>
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={selectedKeys}
        >
          {this.renderTreeNodes(treeData2)}
        </Tree>
      </div>
    );

    return element;
  };

  renderDivFloat = () => {
    const { maxValue } = this.cashData;
    if (maxValue <= 0) {
      return null;
    }
    const { polyColors, floatDivList } = this.state;
    let element = polyColors.map((polyColor, index) => {
      const title = floatDivList[index];
      const key = `divkey_${index}`;
      const subelement = (
        <div key={key}>
          <Row gutter={15}>
            <Col span={4}>
              <div style={{ backgroundColor: polyColor, width: '15px', height: '15px' }} />
            </Col>
            <Col span={20}>
              <div
                style={{
                  width: 'auto',
                  height: '15px',
                  textAlign: 'left',
                  lineHeight: '15px',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </div>
            </Col>
          </Row>
          <p />
        </div>
      );
      return subelement;
    });

    element = (
      <div
        style={{
          width: 'auto',
          backgroundColor: '#fffa',
          float: 'left',
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 2,
          filter: 'alpha(Opacity=100)',
          boxShadow: '5px 5px 2px #bebebe63',
        }}
      >
        <div style={{ padding: '10px' }}>{element}</div>
      </div>
    );
    return element;
  };

  render() {
    const { value, mapCenter, treeData, radioValue } = this.state;

    const tProps = {
      treeData,
      value,
      onChange: this.onChange,
      treeCheckable: false,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选指标',
      multiple: false,
      treeDefaultExpandAll: true,
      style: {
        width: 300,
      },
    };
    return (
      <PageHeaderWrapper title="指标GIS多图层可视化">
        <div style={{ marginLeft: 0, marginRight: 0, height: 500 }}>
          <Row>
            <Radio.Group value={radioValue} onChange={this.handleRadioChange}>
              <Radio.Button value="1">园区指标</Radio.Button>
              <Radio.Button value="2">企业指标</Radio.Button>
            </Radio.Group>
          </Row>
          <p />
          <Row gutter={0}>
            <Col span={24}>
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  height: 40,
                  lineHeight: '40px',
                }}
              >
                <div
                  style={{
                    top: '0px',
                    float: 'left',
                    width: '80px',
                    textAlign: 'center',
                    lineHeight: '40px',
                  }}
                >
                  指标体系:
                </div>
                <TreeSelect {...tProps} style={{ top: 4, width: 200, float: 'left' }} />
              </div>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={20}>
              <div style={{ width: '100%', height: '600px' }}>
                <Map
                  zoom={14}
                  center={mapCenter}
                  style={{ width: '100%', height: '100%' }}
                  amapkey="7f02658d1acabe65b9629bb8b3132b86"
                  ref={c => {
                    this.map = c;
                  }}
                >
                  {this.polygonMap()}
                  {this.markerMap()}
                  {this.renderInfoWindow()}
                </Map>
              </div>
              {this.renderDivFloat()}
            </Col>
            <Col span={4}>{this.renderEnterpriseTree()}</Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Amap;
