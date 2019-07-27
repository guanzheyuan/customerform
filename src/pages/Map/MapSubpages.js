/* eslint-disable  */
import React, { Component } from 'react';
import { Map, MouseTool, Markers, InfoWindow, Polygon, PolyEditor } from 'react-amap';
import { Button, Col, Row, Input, Icon, Popconfirm, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BasicTable from './components/BasicTable';
import { relative } from 'path';
import { Router, Route, hashHistory, browserHistory, Redirect } from 'react-router';

const markerImg = require('../../assets/company.png');
const parkImg = require('../../assets/park.png');

const deleteImg = require('../../assets/delete.png');
const areaImg = require('../../assets/area.png');
const iconImg = require('../../assets/icon.png');
const pentagonImg = require('../../assets/Pentagon.png');

const markerPosition = [
  [118.76203536987303, 31.97772078314799],
  [118.76950263977051, 31.98645711514868],
  [118.77413749694824, 31.972187342675905],
  [118.75130653381348, 31.951943758259702],
  [118.78658294677736, 31.944806466876795],
  [118.78199100494386, 31.99097056075921],
];

const randomMarker = len =>
  Array(len)
    .fill(true)
    .map((e, idx) => ({
      position: markerPosition[idx],
      name: `陈超${idx}`,
    }));

const inPrame = [];

class MapSubpages extends Component {
  constructor() {
    super();
    const that = this;
    const self = this;
    this.state = {
      markers: randomMarker(5),
      infoPosition: '',
      infoVisible: false,
      polygonActive: false,
      editIconItem: {},
      arr: [],
    };

    this.toolEvents = {
      created: tool => {
        console.log(tool);
        self.tool = tool;
        // let { points } = self.props;
        //   points = points.map((item, index) => {
        //     return new window.AMap.LngLat(item.longitude, item.latitude);
        //   });
        //   self.P=new AMap.Polygon({
        //     map:self.instance,
        //     path:points,
        //   })
        //   self.tool.polygon({
        //     path:points
        //   })
        //   console.log(self.tool)
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };
    // this.randomMarkers = this.randomMarkers.bind(this);
    this.markersEvents = {
      click(e, marker) {
        // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData();
        const dataPosition = extData.position;
        that.setState({ infoPosition: dataPosition, infoVisible: true });
      },
    };

    this.polygonPath = [
      [
        [118.79555225372313, 31.98951463482615],
        [118.7881922721863, 31.98645711514868],
        [118.78591775894165, 31.985856518951767],
        [118.78091812133789, 31.984491512972703],
        [118.77735614776613, 31.98396370521624],
        [118.77769947052002, 31.981725038568598],
        [118.77735614776613, 31.977465960980627],
        [118.77735614776613, 31.9728426359349],
        [118.7836217880249, 31.97382556705184],
        [118.7898015975952, 31.975427358169952],
        [118.7955093383789, 31.977174734780107],
      ],
    ];

    this.mapCenter = { longitude: 118.749941, latitude: 31.973993 };

    this.divState = {
      // display:'none'
    };

    this.saveClick = this.saveClick.bind(this);
  }

  selectInfo(id) {
    var url = 'http://10.45.28.119:8099/sop/grid/getGridDetails/' + id;
    let data;
    var option = {
      methods: 'get',
      async: false,
    };
    fetch(url, option).then(res => {
      // 请求到的数据
      console.log(res);
      this.state({
        arr: res,
      });
    });
  }

  saveClick() {
    let data = [];

    data = this.getInputValue();
    console.log(data);
    let inPrame = {
      parentId: '',
      data,
    };
    var url = 'http://10.45.28.119:8099/sop/grid/insertGrid';
    var option = {
      methods: 'post',
      data: inPrame,
    };

    fetch(url, option).then(res => {
      // 请求到的数据
      console.log(res);
      // 修改state
      this.state({
        arr: res,
      });
      // 打印输出
      console.log(this.state.arr);
    });
  }

  updateClick() {
    let data = [];

    data = this.getInputValue();
    console.log(data);

    let inPrame = {
      parentId: '',
      data,
    };

    var url = 'http://10.45.28.119:8099/sop/grid/updateGrid';
    var option = {
      methods: 'post',
      data: inPrame,
    };

    fetch(url, option).then(res => {
      // 请求到的数据
      console.log(res);
      // 修改state
      this.state({
        arr: res,
      });
      // 打印输出
      console.log(this.state.arr);
    });
  }

  getInputValue() {
    var els = document.getElementsByClassName('inputVal');
    var data = {};
    for (var i = 0, j = els.length; i < j; i++) {
      data[els[i].name] = els[i].value;
    }
    return data;
  }

  drawWhat = () => {};

  addPolygon = () => {
    this.tool.polygon();
  };

  savePolygon = () => {
    this.divState.display = 'block';
  };

  deletePloyee = () => {};

  addMarker = () => {};

  saveMarker = () => {
    this.divState.display = 'block';
  };

  deleteMarker = () => {};

  renderMarkerLayout = () => {
    return (
      <div>
        <img alt="example" src={parkImg} />
      </div>
    );
  };

  renderMarker() {
    const { markers, infoPosition, infoVisible, polygonActive, arr } = this.state;
    let gridLevel = { arr }[gridLevel];
    if (gridLevel === '2') {
      return (
        <Markers
          markers={markers}
          events={this.markersEvents}
          render={this.renderMarkerLayout}
          useCluster
        />
      );
    }
    if (gridLevel === '1') {
      return (
        <Polygon
          path={this.polygonPath}
          style={{ fillColor: '#1791fc', fillOpacity: 0.7, strokeColor: '#fff' }}
        ></Polygon>
      );
    }
    if (gridLevel === -1) {
      return (
        <Polygon
          path={this.polygonPath}
          style={{ fillColor: '#1791fc', fillOpacity: 0.7, strokeColor: '#fff' }}
        ></Polygon>
      );
    }
    return '';
  }

  render() {
    const that = this;
    const data = that.props.location.dataObj;
    const level = 2; //1网格 2园区
    let dataObj = this.selectInfo(2);

    const plugins = [
      'MapType',
      'Scale',
      'OverView',
      {
        name: 'ToolBar',
        options: {
          visible: true, // 不设置该属性默认就是 true
          onCreated(ins) {
            console.log(ins);
          },
        },
      },
    ];

    let inputHtml;
    let toolBarHtml;

    // console.log(dataObj.obj);
    let arr = {
      gridName: 'aaa',
      eastTo: 'aaa',
      westTo: 'aaa',
      southTo: 'aaa',
      northTo: 'aaa',
      respPerson: 'aaa',
    };

    if (level) {
      inputHtml = (
        <div>
          <Col span={18} push={2}>
            <Input
              placeholder=""
              name="gridName"
              onChange={this._changeValue}
              value={arr.gridName}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={18}>
            <label htmlFor="name">名称:</label>
          </Col>
          <Col span={8} push={2}>
            <Input
              placeholder=""
              name="eastTo"
              onChange={this._changeValue}
              value={arr.eastTo}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={8}>
            <label htmlFor="name">东至:</label>
          </Col>
          <Col span={8} push={2}>
            <Input
              placeholder=""
              name="westTo"
              onChange={this._changeValue}
              value={arr.westTo}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={8}>
            <label htmlFor="name">西至:</label>
          </Col>
          <Col span={8} push={2}>
            <Input
              placeholder=""
              name="southTo"
              onChange={this._changeValue}
              value={arr.southTo}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={8}>
            <label htmlFor="name">南至:</label>
          </Col>
          <Col span={8} push={2}>
            <Input
              placeholder=""
              name="northTo"
              onChange={this._changeValue}
              value={arr.northTo}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={8}>
            <label htmlFor="name">北至:</label>
          </Col>
          <Col span={18} push={2}>
            <Input
              placeholder=""
              name="respPerson"
              onChange={this._changeValue}
              value={arr.respPerson}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={18}>
            <label htmlFor="name">负责人:</label>
          </Col>
        </div>
      );

      toolBarHtml = (
        <div>
          <div class="input-item">
            <img
              alt="example"
              src={pentagonImg}
              style={{ width: 25, margin: 10 }}
              onClick={() => this.addPolygon()}
            />
          </div>

          <div class="input-item">
            <img
              alt="example"
              src={areaImg}
              style={{ width: 25, margin: 10 }}
              onClick={() => this.savePolygon()}
            />
          </div>

          <div class="input-item">
            <img
              alt="example"
              src={deleteImg}
              style={{ width: 25, margin: 10 }}
              onClick={() => this.deletePloyee()}
            />
          </div>
        </div>
      );
    } else {
      inputHtml = (
        <div>
          <Col span={7} push={2}>
            <Input
              placeholder=""
              name="gridNo"
              onChange={this._changeValue}
              value={arr.gridNo}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={7}>
            <label htmlFor="name">编号:</label>
          </Col>
          <Col span={7} push={2}>
            <Input
              placeholder=""
              name="gridName"
              onChange={this._changeValue}
              value={arr.gridName}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={7}>
            <label htmlFor="name">名称:</label>
          </Col>
          <Col span={18} push={2}>
            <Input
              placeholder=""
              name="address"
              onChange={this._changeValue}
              value={arr.address}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={18}>
            <label htmlFor="name">地址:</label>
          </Col>
          <Col span={18} push={2}>
            <Input
              placeholder=""
              name="respPerson"
              onChange={this._changeValue}
              value={arr.respPerson}
              className="inputVal"
              style={{ marginBottom: 2 }}
            />
          </Col>
          <Col span={2} pull={18}>
            <label htmlFor="name">负责人:</label>
          </Col>
        </div>
      );

      toolBarHtml = (
        <div>
          <div class="input-item">
            <img
              alt="example"
              src={iconImg}
              style={{ width: 25, margin: 10 }}
              onClick={() => this.addMarker()}
            />
          </div>

          <div class="input-item">
            <img
              alt="example"
              src={areaImg}
              style={{ width: 25, margin: 10 }}
              onClick={() => this.saveMarker()}
            />
          </div>

          <div class="input-item">
            <img
              alt="example"
              src={deleteImg}
              style={{ width: 25, margin: 10 }}
              onClick={() => this.deleteMarker()}
            />
          </div>
        </div>
      );
    }

    return (
      <PageHeaderWrapper title="网格地图-子页面">
        <Card>
          <div>
            <Row gutter={24} type="flex" justify="left">
              {inputHtml}

              <div style={{ width: '100%', height: 500, position: 'relative' }}>
                <div
                  class="input-card"
                  style={{
                    width: 50,
                    top: 145,
                    right: 20,
                    bottom: 'auto',
                    position: 'absolute',
                    background: '#fff',
                    zIndex: 99,
                    border: '1px solid #777',
                  }}
                >
                  {toolBarHtml}
                </div>
                <div
                  className="m-test"
                  style={{
                    display: this.divState.display,
                    background: '#fff',
                    background: ' rgb(255, 255, 255)',
                    zIndex: 99,
                    position: 'absolute',
                    top: 200,
                    right: 70,
                  }}
                >
                  <div
                    style={{
                      float: 'left',
                      padding: '2px 10px',
                      background: ' rgb(255, 255, 255)',
                      border: '1px solid #777',
                    }}
                    onClick={this.saveClick}
                  >
                    保存
                  </div>
                  <div
                    style={{
                      float: 'left',
                      padding: '2px 10px',
                      background: ' rgb(255, 255, 255)',
                      border: '1px solid #777',
                    }}
                  >
                    取消
                  </div>
                </div>

                <Map
                  amapkey="d4430fc1b168a2bf0478eb64a3458b39"
                  zoom={13}
                  center={this.mapCenter}
                  plugins={plugins}
                >
                  <MouseTool events={this.toolEvents} />
                  {this.renderMarker()}
                </Map>
              </div>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default MapSubpages;
