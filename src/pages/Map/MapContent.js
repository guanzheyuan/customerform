/* eslint-disable  */
import React, { Component } from 'react';
import { Map, MouseTool, Markers, InfoWindow, Polygon, PolyEditor } from 'react-amap';
import { Button, Col, Row, Input, Icon, Popconfirm, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BasicTable from './components/BasicTable';

const markerPosition = [
  [118.76203536987303, 31.97772078314799],
  [118.76950263977051, 31.98645711514868],
  [118.77413749694824, 31.972187342675905],
  [118.75130653381348, 31.951943758259702],
  [118.78658294677736, 31.944806466876795],
  [118.78199100494386, 31.99097056075921],
  [118.77774238586426, 31.978521648210428],
  [118.79499435424803, 31.96261224655504],
  [118.74008417129515, 31.96309466596962],
  [118.7440538406372, 31.958625362676848],
  [118.76533985137938, 31.996248098541745],
  [118.79327774047852, 31.989842220175888],
  [118.79053115844728, 31.999596447799632],
  [118.79855632781982, 31.982161855862067],
  [118.78951191902159, 31.976346555221593],
  [118.77273201942444, 32.00677496930155],
  [118.73969793319702, 31.986975808699988],
  [118.72143745422365, 31.961337918930735],
  [118.74366760253905, 32.002908281677215],
];

const randomMarker = len =>
  Array(len)
    .fill(true)
    .map((e, idx) => ({
      position: markerPosition[idx],
      name: `陈超${idx}`,
    }));

const markerImg = require('../../assets/company.png');
const parkImg = require('../../assets/park.png');

class MapContent extends Component {
  constructor() {
    super();
    const that = this;
    const self = this;
    this.state = {
      markers: randomMarker(20),
      infoPosition: '',
      infoVisible: false,
      polygonActive: false,
      editIconItem: {},
    };
    this.columns = [
      {
        title: '',
        dataIndex: 'girdName',
        key: 'girdName',
        width: '70%',
      },
      {
        title: '',
        width: '30%',
        render: (text, record) => {
          const { editIconItem } = this.state;
          if (record.id !== -1) {
            return (
              editIconItem === record.id && (
                <div>
                  <Icon
                    type="plus"
                    title="新增"
                    style={{ marginRight: 10 }}
                    onClick={() => this.handleEdit('edit', record)}
                  />
                  {record.screenCount > 0 ? (
                    <Popconfirm title="该目录存在大屏不可删除" okText="确定" cancelText="取消">
                      <Icon title="删除" type="delete" />
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="你确定删除该目录嘛?"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => this.handleDelete(record)}
                    >
                      <Icon title="删除" type="delete" />
                    </Popconfirm>
                  )}
                </div>
              )
            );
          } else {
            return (
              <div>
                <Icon
                  type="plus"
                  title="新增"
                  style={{ marginRight: 10 }}
                  onClick={() => this.handleEdit('add')}
                />
              </div>
            );
          }
        },
      },
    ];
    this.toolEvents = {
      created: tool => {
        console.log(tool);
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };
    this.randomMarkers = this.randomMarkers.bind(this);
    this.markersEvents = {
      click(e, marker) {
        // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData();
        const dataPosition = extData.position;
        that.setState({ infoPosition: dataPosition, infoVisible: true });
      },
    };
    this.editorEvents = {
      created: ins => {
        console.log(ins);
      },
      addnode: () => {
        console.log('polyeditor addnode');
      },
      adjust: () => {
        console.log('polyeditor adjust');
      },
      removenode: () => {
        console.log('polyeditor removenode');
      },
      end: () => {
        console.log('polyeditor end');
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
        [118.80087375640868, 31.97906768856403],
        [118.80053043365479, 31.980086955197645],
        [118.79941463470459, 31.982016250328638],
        [118.79756927490233, 31.985729119253016],
        [118.79555225372313, 31.98951463482615],
      ],
      [
        [118.77602577209474, 31.99431910270464],
        [118.76924514770506, 31.995338199900516],
        [118.76383781433105, 31.996866824461062],
        [118.76057624816895, 31.998177053804007],
        [118.75791549682617, 31.991844105226626],
        [118.75688552856444, 31.98594751862827],
        [118.75628471374513, 31.98012335736804],
        [118.75611305236815, 31.97735675126373],
        [118.76503944396973, 31.978303231159256],
        [118.77310752868652, 31.97881287013669],
        [118.77750635147093, 31.979340707522436],
        [118.77772092819214, 31.981834243086915],
        [118.77735614776613, 31.98398190553426],
        [118.77649784088133, 31.990934162892515],
        [118.77602577209474, 31.99431910270464],
      ],
      [
        [118.75615596771239, 31.977320347995896],
        [118.75602722167969, 31.974262421947298],
        [118.75607013702391, 31.969711748145873],
        [118.76302242279053, 31.970694712789115],
        [118.76890182495117, 31.97167766690686],
        [118.77731323242186, 31.97269701561497],
        [118.77735614776613, 31.974644668275186],
        [118.77735614776613, 31.977529666588815],
        [118.77748489379883, 31.97932250628381],
        [118.76984596252441, 31.97855805100174],
        [118.76272201538085, 31.97808481358823],
        [118.75615596771239, 31.977320347995896],
      ],
      [
        [118.76040458679199, 31.99824984377415],
        [118.75465393066406, 31.99905052963223],
        [118.74933242797852, 32.00043351601032],
        [118.74572753906249, 31.995483784289796],
        [118.74246597290038, 31.99148012937623],
        [118.74049186706542, 31.989369040961847],
        [118.74409675598145, 31.988131483785327],
        [118.74727249145508, 31.987476299697423],
        [118.75310897827148, 31.986384315819052],
        [118.75697135925294, 31.98594751862827],
        [118.75787258148193, 31.9918987014796],
        [118.76055479049681, 31.998213448796292],
        [118.76040458679199, 31.99824984377415],
      ],
      [
        [118.74049186706542, 31.98933264245968],
        [118.73727321624756, 31.985401519215277],
        [118.7347412109375, 31.98208905312423],
        [118.73276710510254, 31.980232563792523],
        [118.72941970825195, 31.977866395497347],
        [118.72787475585936, 31.976046224524246],
        [118.73062133789061, 31.974007590177635],
        [118.73611450195312, 31.9706583068789],
        [118.74229431152342, 31.969711748145873],
        [118.74804496765137, 31.96985737320162],
        [118.75611305236815, 31.96985737320162],
        [118.75596284866334, 31.97418961294245],
        [118.75611305236815, 31.97735675126373],
        [118.756263256073, 31.980287166956053],
        [118.75686407089233, 31.985911118768513],
        [118.75306606292725, 31.986402515656884],
        [118.74665021896361, 31.987640096158092],
        [118.7440538406372, 31.98816788276412],
        [118.74049186706542, 31.98933264245968],
      ],
      [
        [118.75611305236815, 31.969711748145873],
        [118.75679969787596, 31.963449652222046],
        [118.75679969787596, 31.95733277412908],
        [118.77190589904784, 31.95929895794907],
        [118.78263473510744, 31.96082818292941],
        [118.79636764526366, 31.963740921968277],
        [118.8069248199463, 31.9681098572862],
        [118.80340576171875, 31.974371635346284],
        [118.80083084106444, 31.97910409113876],
        [118.7934923171997, 31.976574077822892],
        [118.78804206848145, 31.97497230671777],
        [118.78351449966429, 31.97382556705184],
        [118.7735366821289, 31.972223747979676],
        [118.76924514770506, 31.971750477904262],
        [118.76233577728271, 31.97062190095428],
        [118.75611305236815, 31.969711748145873],
      ],
      [
        [118.7761116027832, 31.99431910270464],
        [118.77739906311035, 31.983690700012865],
        [118.77739906311035, 31.98398190553426],
        [118.78100395202637, 31.984491512972703],
        [118.7882137298584, 31.98645711514868],
        [118.7955093383789, 31.98951463482615],
        [118.79336357116699, 31.993663962813137],
        [118.79061698913574, 31.999268897289205],
        [118.787784576416, 31.99715798815511],
        [118.78220558166504, 31.99519261528015],
        [118.7761116027832, 31.99431910270464],
      ],
      [
        [118.72804641723634, 31.976191839530536],
        [118.72169494628906, 31.970803930433096],
        [118.71774673461914, 31.96730890137458],
        [118.71414184570311, 31.96308556373999],
        [118.72821807861328, 31.95871638935369],
        [118.74006271362305, 31.956823015897207],
        [118.75619888305663, 31.955657843600374],
        [118.75688552856444, 31.957478418818518],
        [118.75675678253172, 31.963486060990867],
        [118.75598430633545, 31.969748154431468],
        [118.74233722686766, 31.969748154431468],
        [118.73607158660889, 31.9706583068789],
        [118.73143672943115, 31.973461519717333],
        [118.72907638549805, 31.97517252963471],
        [118.72804641723634, 31.976191839530536],
      ],
    ];
    this.mapCenter = { longitude: 118.749941, latitude: 31.973993 };
  }

  info = position => {
    this.setState({ infoPosition: position, infoVisible: true });
  };

  drawWhat = () => {};

  drawPolygon = () => {
    if (this.tool) {
      this.tool.polygon();
    }
  };

  randomMarkers = () => {
    this.setState({
      markers: randomMarker(100),
    });
  };

  renderMarkerLayout = () => {
    return (
      <div>
        <img alt="example" src={markerImg} />
      </div>
    );
  };

  renderMarkerLayoutPark = () => {
    return (
      <div>
        <img alt="example" src={parkImg} />
      </div>
    );
  };

  handleMouseEnter = record => {
    this.setState({ editIconItem: record.id });
  };

  handleMouseLeave = () => {
    this.setState({ editIconItem: {} });
  };

  render() {
    const { markers, infoPosition, infoVisible, polygonActive } = this.state;
    const infoContent = `<div><h4>Greetings</h4><p>This is content of this info window</p><p>Click 'Change Value' Button: ${this.state.value}</p></div>`;
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

    const data = [
      {
        key: 1,
        girdName: '1号网格',
        age: 60,
        address: 'New York No. 1 Lake Park',
        children: [
          {
            key: 11,
            girdName: 'John Brown',
            age: 42,
            address: 'New York No. 2 Lake Park',
          },
          {
            key: 12,
            girdName: 'John Brown jr.',
            age: 30,
            address: 'New York No. 3 Lake Park',
            children: [
              {
                key: 121,
                girdName: 'Jimmy Brown',
                age: 16,
                address: 'New York No. 3 Lake Park',
              },
            ],
          },
          {
            key: 13,
            girdName: 'Jim Green sr.',
            age: 72,
            address: 'London No. 1 Lake Park',
            children: [
              {
                key: 131,
                girdName: 'Jim Green',
                age: 42,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 1311,
                    girdName: 'Jim Green jr.',
                    age: 25,
                    address: 'London No. 3 Lake Park',
                  },
                  {
                    key: 1312,
                    girdName: 'Jimmy Green sr.',
                    age: 18,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 2,
        girdName: '2号网格',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: 3,
        girdName: '3号网格',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: 3,
        girdName: '4号网格',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ];

    const dataSource = {
      list: data,
      pagination: false,
    };

    return (
      <PageHeaderWrapper title="网格地图">
        <Card>
          <div>
            <Row gutter={24} type="flex" justify="center">
              <Col md={6}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
                  <div>
                    <Input.Search
                      placeholder="请输入"
                      onSearch={value => this.handleSearch(value)}
                      enterButton
                    />
                  </div>
                  <BasicTable
                    data={dataSource}
                    columns={this.columns}
                    bordered={false}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                  />
                </div>
              </Col>
              <Col md={18}>
                <div style={{ width: '100%', height: '100%' }}>
                  <div style={{ width: '100%', height: 50 }}>
                    <Button type="primary" style={{ float: 'right', marginLeft: 15 }}>
                      编辑区域
                    </Button>
                    <Button
                      type="primary"
                      style={{ float: 'right' }}
                      onClick={() => {
                        this.drawPolygon();
                      }}
                    >
                      框选区域
                    </Button>
                  </div>
                  <div style={{ width: '100%', height: 500 }}>
                    <Map
                      amapkey="d4430fc1b168a2bf0478eb64a3458b39"
                      zoom={13}
                      center={this.mapCenter}
                      plugins={plugins}
                    >
                      <MouseTool events={this.toolEvents} />
                      <Markers
                        markers={markers}
                        events={this.markersEvents}
                        render={this.renderMarkerLayout}
                        useCluster
                      />
                      <InfoWindow
                        position={infoPosition}
                        visible={infoVisible}
                        content={infoContent}
                      />
                      <Polygon
                        path={this.polygonPath}
                        style={{ fillColor: '#1791fc', fillOpacity: 0.7, strokeColor: '#fff' }}
                      >
                        <PolyEditor active={polygonActive} events={this.editorEvents} />
                      </Polygon>
                    </Map>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default MapContent;
