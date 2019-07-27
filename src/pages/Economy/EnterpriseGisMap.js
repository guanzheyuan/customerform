import React, { PureComponent } from 'react';
import { Map, InfoWindow, Markers, Circle, Polygon } from 'react-amap';
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
class EnterpriseGisMap extends PureComponent {
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
    gridArea: [],
    infoShowList: [],
    radioValue: '2',
    infoWindowPot: { longitude: 118.749941, latitude: 31.973993 },
    isVisiable: false,
    treeData: [],
    treeData2: [],
    value: ['1'],
    valueText: '值',
    expandedKeys: ['0-0', '0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0', '0-0-1'],
    selectGridKeys: [],
    selectEnterprise: [],
    selectedKeys: [],
    areaPots: [],
    entepriseJjyxIndexListRes: {},
    entepriseGridListRes: {},
    entepriseEmableRes: {},
    floatDivList: [],
    mapCenter: { longitude: 118.749941, latitude: 31.973993 },
    polyColors: ['#ffff5c', '#fae14e', '#f5c43f', '#f0a441', '#eb8836', '#ed742e'],
  };

  constructor() {
    super();

    this.windowEvents = {
      created: () => {},
      open: () => {},
      close: () => {
        const isVisiable = false;
        this.setState({
          isVisiable,
        });
      },
      change: () => {},
    };
    this.circleEvents = {
      created: ins => {
        console.log((window.circle = ins));
      },
      click: e => {
        const { extData } = e.target.Ge;
        const isVisiable = true;
        this.setState({
          infoWindowPot: extData.position,
          isVisiable,
          // infoWindowValue: extData.indexValue,
          infoShowList: extData.enterPrise,
        });
      },
      mouseover: () => {
        console.log('mouseover');
      },
    };
    // this.amapEvents = {
    //     created: (mapInstance) => {
    //         const marker = new AMap.Marker({
    //             // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //             position: new AMap.LngLat(116.39, 39.9),
    //             title: '北京!!'
    //         });

    //         const lineArr = [
    //             [116.368904, 39.913423],
    //             [116.382122, 39.901176],
    //             [116.387271, 39.912501],
    //             [116.398258, 39.904600]
    //         ];
    //         const polyline = new AMap.Polyline({
    //             path: lineArr,          // 设置线覆盖物路径
    //             strokeColor: "#3366FF", // 线颜色
    //             strokeWeight: 5,        // 线宽
    //             strokeStyle: "solid",   // 线样式
    //         });
    //         mapInstance.add(polyline);

    //         mapInstance.add(marker);
    //     }
    // }
  }

  componentDidMount() {
    this.getGrids();
  }

  getGrids() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/enterprisegridList',
      callback: response => {
        this.setState({
          entepriseGridListRes: response,
        });
        this.getEnterprise();
      },
    });
  }

  getEnterprise() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/labeEnableList',
      callback: response => {
        this.setState({
          entepriseEmableRes: response,
        });
        this.getIndexs();
      },
    });
  }

  getIndexs() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/enterprisesearchtype',
      callback: response => {
        this.setState({
          entepriseJjyxIndexListRes: response,
        });
        this.getGridAreaInfo();
      },
    });
  }

  getGridAreaInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/enterprisemapinfo',
      payload: {
        gridIdList: [],
        indexTypeId: 0,
        labelIdList: [],
      },
      callback: response => {
        this.setState({ gridArea: response });
        this.refreshIndex();
        // this.refreshFloatDivMap(response);
      },
    });
  }

  getmapinfo(selectEnterprise, selectGridKeys, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/getIndexValue',
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

  onChange = (value, text) => {
    const { selectEnterprise, selectGridKeys } = this.state;
    this.setState({ value: [value], valueText: text });
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
    if (checkValue === '1') {
      // 企业指标
      router.push({
        pathname: '/Economy/GisMap',
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

  polygonMap = () => {
    this.cashData.index_q += 1;
    const { gridArea } = this.state;
    if (gridArea !== null && gridArea.length > 0) {
      const element = gridArea.map((grid, index) => {
        const path = grid.areaList;
        this.getMinddleLatLng(path);
        const colorStr = '#cccccc';
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
          />
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

  // markerMap = () => {
  //   const { areaPots } = this.state;
  //   if (areaPots !== null && areaPots.length > 0) {
  //     const element = areaPots.map((areapot, index) => {
  //       const path = areapot.areaList;
  //       const middlePot = this.getMinddleLatLng(path);
  //       const key = `${index}_mark`;
  //       return (
  //         <Marker position={middlePot} key={key}>
  //           <div>
  //             <h1
  //               style={{
  //                 fontWeight: '900',
  //                 color: '#ffffff',
  //                 textShadow: '#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0',
  //               }}
  //             >
  //               {areapot.gridName}
  //             </h1>
  //           </div>
  //         </Marker>
  //       );
  //     });

  //     if (this.cashData.once === 1) {
  //       // 设置地图初始化中心点
  //       const globallat = (this.cashData.maxLat + this.cashData.minLat) / 2;
  //       const globallng = (this.cashData.maxLng + this.cashData.minLng) / 2;
  //       this.setState({
  //         mapCenter: { longitude: globallng, latitude: globallat },
  //       });
  //       this.cashData.once = 2;
  //     }
  //     return element;
  //   }

  //   return null;
  // };

  //   mapInstance(){
  //     <Marker position={0.39, 0.9} events={this.amapEvents}>
  //     </Marker>
  //   }

  // eslint-disable-next-line react/sort-comp
  MarksMap() {
    const { maxValue } = this.cashData;
    const { areaPots } = this.state;
    let data = [];
    if (areaPots !== null && areaPots.length > 0) {
      data = areaPots.map((areapot, index) => {
        // const path = areapot.areaList;
        let length = 20;
        if (maxValue > 0) {
          length = (80 * areapot.indexValue) / maxValue + 20;
        }
        const markerOffet = 0 - length / 2;
        const middlePot = areapot.areaPoint;
        const key = `${index}_mark`;
        const offset = { x: markerOffet, y: markerOffet };
        const mark = {
          position: middlePot,
          title: areapot.enterpriseName,
          key,
          myIndex: index,
          indexValue: areapot.indexValue,
          offset,
          maxValue,
        };
        return mark;
      });
    }
    const clu = true;
    const element = (
      <Markers
        events={this.marksEvents}
        markers={data}
        useCluster={clu}
        render={this.renderMarkerLayout}
      />
    );
    return element;
  }

  circleMap() {
    const { maxValue } = this.cashData;
    const { areaPots } = this.state;
    if (areaPots !== null && areaPots.length > 0) {
      const element = areaPots.map((areapot, index) => {
        let length = 20;
        if (maxValue > 0) {
          length = (500 * areapot.areaTotalNum) / maxValue + 20;
        }
        const middlePot = areapot.areaPoint;
        const key = `${index}_circle`;
        const keydata = `${index}_data`;
        const data = {
          position: middlePot,
          key: keydata,
          indexValue: areapot.areaTotalNum,
          maxValue,
          enterPrise: areapot.showList,
        };
        const style = {
          strokeColor: '#ffffff',
          strokeWeight: 1.1,
          fillColor: '#ffc892',
          fillOpacity: 0.8,
        };
        const visible = true;
        return (
          <Circle
            key={key}
            center={middlePot}
            radius={length}
            events={this.circleEvents}
            visible={visible}
            style={style}
            draggable={false}
            extData={data}
          />
        );
      });
      return element;
    }

    return null;
  }

  refreshIndex() {
    // 指标格式化
    const { entepriseJjyxIndexListRes, entepriseEmableRes, entepriseGridListRes } = this.state;
    const treeData = [];
    const value = [];
    let valueText = '';
    for (let i = 0; i < entepriseJjyxIndexListRes.length; i += 1) {
      const originType = entepriseJjyxIndexListRes[i];
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
          valueText = origindatatype.indexName;
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
    const emables = entepriseEmableRes.data;
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
    const grid = entepriseGridListRes.data;
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
      valueText,
    });

    this.getmapinfo(selectEnterprise, selectGridKeys, value);
  }

  refreshFloatDivMap(response) {
    const areaPots = [];
    let sumValue = 0;
    for (let i = 0; i < response.length; i += 1) {
      const grid = response[i];
      areaPots.push(grid);
      sumValue += parseFloat(grid.areaTotalNum);
    }
    this.setState({
      areaPots,
    });
    this.cashData.maxValue = sumValue;
  }

  renderMarkerLayout = extData => {
    const value = extData.indexValue;
    const { maxValue } = extData;
    let length = 20;
    if (maxValue > 0) {
      length = (80 * value) / maxValue + 20;
    }
    const style = {
      padding: '0px',
      backgroundColor: '#ed742e',
      color: '#fff',
      border: '1px solid #fff',
      width: length,
      height: length,
      borderRadius: length / 2,
      textAlign: 'center',
      lineHeight: length,
    };
    return <div style={style}>{extData.title}</div>;
  };

  trOnClick = e => {
    const entkey = e.currentTarget.getAttribute('entkey');
    const state = { data: entkey };
    router.push({ pathname: '/company/portrait', state });
  };

  renderInfoWindow() {
    const { infoWindowPot, isVisiable, infoShowList, valueText } = this.state;
    const tableTrElement = infoShowList.map((infoShow, index) => {
      const key = infoShow.entId;
      const name = infoShow.enterpriseName;
      const onlyKey = `${key}-${index}-${name}`;
      return (
        <tr
          key={onlyKey}
          entkey={key}
          entname={name}
          onClick={e => {
            this.trOnClick(e);
          }}
        >
          <td> {infoShow.enterpriseName}</td>
          <td>{infoShow.indexValue}</td>
        </tr>
      );
    });

    const lableHtml = (
      <table border="1">
        <tbody>
          <tr>
            <th>公司</th>
            <th>{valueText}</th>
          </tr>
          {tableTrElement}
        </tbody>
      </table>
    );

    const height = infoShowList.length * 40 + 40;
    const isCustom = false;
    const element = (
      <InfoWindow
        position={infoWindowPot}
        visible={isVisiable}
        isCustom={isCustom}
        size={{ width: 300, height }}
        offset={[0, 0]}
        events={this.windowEvents}
      >
        <p />
        {lableHtml}
      </InfoWindow>
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
                  zoom={15}
                  center={mapCenter}
                  style={{ width: '100%', height: '100%' }}
                  // amapkey="7f02658d1acabe65b9629bb8b3132b86"
                  amapkey="d4430fc1b168a2bf0478eb64a3458b39"
                  ref={c => {
                    this.map = c;
                  }}
                  // events={this.amapEvents}
                >
                  {this.polygonMap()}
                  {/* {this.markerMap()} */}
                  {this.renderInfoWindow()}
                  {/* {this.mapInstance()} */}
                  {/* {this.MarksMap()} */}
                  {this.circleMap()}
                </Map>
              </div>
              {/* {this.renderDivFloat()} */}
            </Col>
            <Col span={4}>{this.renderEnterpriseTree()}</Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default EnterpriseGisMap;
