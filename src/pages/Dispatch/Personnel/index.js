import React, { Component } from 'react';
import { Map, MouseTool, Markers, InfoWindow, Polyline } from 'react-amap';
import { Card, Row, Col, Button, Input, Form } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const markerImg = require('../../../assets/man1.png');
const fireImg = require('../../../assets/fire1.png');
const headImg = require('../../../assets/head.png');

const markerPosition = [
  [118.776643, 31.976561],
  [118.773188, 31.973549],
  [118.774583, 31.976727],
  [118.75130653381348, 31.951943758259702],
  [118.78658294677736, 31.944806466876795],
  [118.78199100494386, 31.99097056075921],
  [118.77774238586426, 31.978521648210428],
  [118.79499435424803, 31.96261224655504],
  [118.74008417129515, 31.96309466596962],
  [118.7440538406372, 31.958625362676848],
  [118.76533985137938, 31.996248098541745],
];

const randomMarker = len =>
  Array(len)
    .fill(true)
    .map((e, idx) => ({
      position: markerPosition[idx],
      label: {
        content: idx === 1 ? `陈超${idx}<img src= ${fireImg} /><span>12:30</span>` : `陈超${idx}`,
        direction: `top`,
      },
      name: `陈超${idx}`,
      state: idx === '1' ? `紧急调度中${idx}` : `在线${idx}`,
      department: `街道${idx}`,
      tel: `18756907177`,
      task: `任务${idx}`,
      address: `江苏省南京市雨花台区${idx}`,
    }));

class CommandDispatch extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      markers: randomMarker(5),
      PolylinePath1: [
        [118.776643, 31.976561],
        [118.777061, 31.976616],
        [118.778842, 31.973403],
        [118.774701, 31.973039],
        [118.774508, 31.974523],
      ],
      PolylinePath2: [
        [118.773188, 31.973549],
        [118.771515, 31.973494],
        [118.771225, 31.972156],
        [118.766054, 31.971984],
        [118.765903, 31.969481],
      ],
      PolylinePath3: [[118.774583, 31.976727], [118.774583, 31.993296], [118.786428, 31.992132]],
      PolylineVisible: false,
    };
    this.mapCenter = { longitude: 118.762941, latitude: 31.973993 };

    this.markersEvents = {
      click(e, marker) {
        // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData();
        const dataPosition = extData.position;

        const infoContent1 = `<div style='width: 300px;height: 300px;'><h4 style='border-bottom: 1px solid;'>
          ${extData.name}
            /网格员</h4><div class="headPic" style="width:100px;height:150px;float:left;border:1px solid #ccc;" ><img alt="example" style="margin:20px;" src=
          ${headImg}
           /></div><div class="info" style="width:200px;height:150px;float:left;"><p style="margin: 0;">状态：
          ${extData.state}
          </p><p style="margin: 0;">部门：
          ${extData.department}
          </p> <p style="margin: 0;">联系电话：
          ${extData.tel}
          </p><p style="margin: 0;">任务：
          ${extData.task}
          </p><p style="margin: 0;">所在位置：
          ${extData.address}
          </p>
                                </div>
                                <div>
                                  <p style="margin: 0;">短信内容</p>
                                  <textarea id="msgText" style="width:300px" disabled>
                                  </textarea>
                                  <button class="messageSave msgbtn" style="display:none;" onClick = "saveMsg">保存</button>
                                  <button class-"messageCancel msgbtn" style="display:none;" onClick = "saveCancel">取消</button></br>
                                  <button>电话调度</button>
                                  <button onClick = "sendMsg">短信调度</button>
                                </div>
                              </div>`;
        const content1 = extData.name;

        that.setState({
          infoPosition: dataPosition,
          infoVisible: true,
          infoContent: infoContent1,
          content: content1,
          PolylineVisible: false,
        });
      },
    };

    this.moveAlong = {
      onload() {
        that.setState({
          PolylineVisible: false,
        });
      },
    };

    this.pathStyle = {
      strokeColor: '#3366FF', // 线颜色
      strokeWeight: '8', // 线宽
    };

    this.visibleWindow = {
      onload() {
        that.setState({
          infoVisible: true,
        });
      },
    };
  }

  sendMsg = () => {
    //
  };

  handleChange = event => {
    // const  target  = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      PolylineVisible: value,
    });
    const that = this;
    // console.log("cc ",that.cc)
    if (that.cc) {
      if (that.cc.markersCache && that.cc.markersCache.length > 0 && value === true) {
        const dd1 = that.cc.markersCache[0];
        dd1.moveAlong(that.state.PolylinePath1, 100);

        dd1.on('moving', function(e) {
          that.pp1.myMapComponent.polyline.setPath(e.passedPath);
        });
        const dd2 = that.cc.markersCache[1];
        dd2.moveAlong(that.state.PolylinePath2, 100);

        dd2.on('moving', function(e) {
          that.pp2.myMapComponent.polyline.setPath(e.passedPath);
        });
        const dd3 = that.cc.markersCache[2];
        dd3.moveAlong(that.state.PolylinePath3, 100);

        dd3.on('moving', function(e) {
          that.pp3.myMapComponent.polyline.setPath(e.passedPath);
        });
      } else {
        const dd1 = that.cc.markersCache[0];
        dd1.stopMove();
        const dd2 = that.cc.markersCache[1];
        dd2.stopMove();
        const dd3 = that.cc.markersCache[2];
        dd3.stopMove();
      }
    }
  };

  renderMarkerLayout = () => {
    return (
      <div>
        <img alt="example" src={markerImg} />
      </div>
    );
  };

  onSearchAddress = () => {
    const address = '汉中门';
    fetch(
      `https://restapi.amap.com/v3/geocode/geo?key="d4430fc1b168a2bf0478eb64a3458b39"&address=${address}`
    ).then(res => {
      if (res.ok) {
        res.json().then(data => {
          const that = this;
          that.state.dict = data;
          this.setState();
          // const list = that.state.dict.geocodes;

          if (data.status) {
            // this.mLng = parseFloat(geocodes[0]); // 经度
            // this.mLat = parseFloat(geocodes[1]); // 维度
            // this.setState({
            //   longitude:this.mLng,
            //   latitude:this.mLat,
            // })
          } else {
            //  ("未获得坐标信息");
          }
        });
      }
    });
  };

  render() {
    const {
      markers,
      infoPosition,
      infoVisible,
      size,
      infoContent,
      PolylineVisible,
      PolylinePath1,
      PolylinePath2,
      PolylinePath3,
    } = this.state;

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

    return (
      <PageHeaderWrapper title="人员调度">
        <Card>
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col span={6}>
                <Form.Item label="部门">
                  <Input placeholder="请输入部门" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="姓名">
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="状态">
                  <Input placeholder="状态" />
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginTop: 4 }}>
                <span>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }}>重置</Button>
                </span>
              </Col>
              <Col span={24} style={{ marginTop: 10 }}>
                <span>
                  <input type="checkbox" name="locus" value="show" onChange={this.handleChange} />
                  显示轨迹
                </span>
              </Col>
            </Row>
          </Form>

          <div style={{ width: '100%', height: 600, position: 'relative' }}>
            <div
              className="input-card"
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
            />

            <Map
              amapkey="d4430fc1b168a2bf0478eb64a3458b39"
              zoom={16}
              pitch={50}
              viewMode="3D"
              center={[118.776643, 31.976561]}
              plugins={plugins}
            >
              <MouseTool events={this.toolEvents} />
              <Markers
                ref={ref => {
                  // console.log('ref', ref);
                  this.cc = ref;
                }}
                markers={markers}
                visible="true"
                events={this.markersEvents}
                render={this.renderMarkerLayout}
                // animation={PolylinePath}
                // useCluster
              />

              <InfoWindow
                position={infoPosition}
                content={infoContent}
                size={size}
                closeWhenClickMap
                visible={infoVisible}
              />

              <Polyline
                ref={ref => {
                  // console.log('ref', ref);
                  this.pp1 = ref;
                }}
                path={PolylinePath1}
                visible={PolylineVisible}
                events={this.moveAlong}
                style={this.pathStyle}
              />
              <Polyline
                ref={ref => {
                  // console.log('ref', ref);
                  this.pp2 = ref;
                }}
                path={PolylinePath2}
                visible={PolylineVisible}
                events={this.moveAlong}
                style={this.pathStyle}
              />
              <Polyline
                ref={ref => {
                  // console.log('ref', ref);
                  this.pp3 = ref;
                }}
                path={PolylinePath3}
                visible={PolylineVisible}
                events={this.moveAlong}
                style={this.pathStyle}
              />
            </Map>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CommandDispatch;
