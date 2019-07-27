import React, { Component } from 'react';
import { Card, Row, Col, Modal } from 'antd';
import { connect } from 'dva';
import { Map, Markers, Polygon } from 'react-amap';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchTree from './components/SearchTree';
import TabsDetail from './components/TabsDetail';
import DataInfo from './components/DataInfo';

@connect(({ moreOne, loading }) => ({
  moreOne,
  loading: loading.effects['moreOne/queryTopGridList'],
}))
class MoreOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      gridInfo: '',
    };
    this.mapCenter = { longitude: 118.749941, latitude: 31.973993 };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'moreOne/queryTopGridList',
    });
    dispatch({
      type: 'moreOne/queryDownGridList',
    });
    dispatch({
      type: 'moreOne/queryGrid',
      payload: {
        gridIdList: '',
        projectStatus: '',
      },
    });
    dispatch({
      type: 'moreOne/queryGridArea',
      payload: {
        gridIdList: '',
      },
    });
  }

  renderMarker = data => {
    const { dispatch } = this.props;
    const events = {
      click: (e, marker) => {
        const extData = marker.getExtData();
        dispatch({
          type: 'moreOne/queryGridInfo',
          payload: {
            gridId: extData.id,
          },
          callback: dataInfo => {
            this.setState({
              detailVisible: true,
              gridInfo: dataInfo,
            });
          },
        });
      },
    };
    const gridLocation = [];
    if (data) {
      data.forEach(item => {
        const gridPosition = {};
        gridPosition.position = item.projectPoints;
        gridPosition.id = item.id;
        gridLocation.push(gridPosition);
      });
    }
    if (gridLocation) {
      return <Markers markers={gridLocation} events={events} />;
    }
    return '';
  };

  renderMarkerArea = data => {
    if (data) {
      return (
        <Polygon
          path={data}
          style={{ fillColor: '#1791fc', fillOpacity: 0.7, strokeColor: '#fff' }}
        />
      );
    }
    return '';
  };

  handleCancle = () => {
    this.setState({
      detailVisible: false,
    });
  };

  render() {
    const { detailVisible, gridInfo } = this.state;
    const {
      moreOne: { gridTopList, gridDownList, gridArea, gridDetails },
    } = this.props;
    const searchTreeProps = {
      gridTopList,
      gridDownList,
    };
    const dataInfoProps = {
      gridInfo,
    };
    const tabsDetailProps = {
      gridInfo,
    };
    return (
      <PageHeaderWrapper title="项目多图合一">
        <Card>
          <Row gutter={24}>
            <Col xl={18} lg={24} md={24} sm={24} xs={24}>
              <div style={{ width: '100%', height: 500 }}>
                <Map amapkey="d4430fc1b168a2bf0478eb64a3458b39" zoom={13} center={this.mapCenter}>
                  {this.renderMarker(gridDetails)}
                  {this.renderMarkerArea(gridArea)}
                  {/* <Polygon
                    path={gridArea}
                    style={{ fillColor: '#f00', fillOpacity: 0.7, strokeColor: '#fff' }}
                  /> */}
                </Map>
              </div>
            </Col>
            <Col xl={6} lg={24} md={24} sm={24} xs={24}>
              <SearchTree {...searchTreeProps} />
            </Col>
          </Row>
        </Card>
        {gridInfo && (
          <Modal
            title="项目信息"
            visible={detailVisible}
            footer={null}
            onCancel={this.handleCancle}
            width={1000}
          >
            <Row>
              <Col xl={11} lg={24} md={24} sm={24} xs={24} style={{ paddingRight: '20px' }}>
                <DataInfo {...dataInfoProps} />
              </Col>
              <Col xl={13} lg={24} md={24} sm={24} xs={24}>
                <TabsDetail {...tabsDetailProps} />
              </Col>
            </Row>
          </Modal>
        )}
      </PageHeaderWrapper>
    );
  }
}
export default MoreOne;
