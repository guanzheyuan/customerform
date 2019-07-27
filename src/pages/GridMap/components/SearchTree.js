/* eslint-disable prefer-destructuring */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-array-constructor */
/* eslint-disable array-callback-return */
import React, { Component, Fragment } from 'react';
import { Tree, Input, Row, Col, Modal, Tabs, Table, Form, message, Tooltip, Select } from 'antd';

import AddMap from './AddMap';
import AreaMap from './AreaMap';

import styles from '../gridmap.less';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

const FormItem = Form.Item;
const dataList = [];
const pageSize = 5;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i = Number(i) + 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
@Form.create()
class SearchTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      treeSelected: '',
      treeSelectedLevel: '',
      autoExpandParent: true,
      nodeDetailVisible: false,
      addGridVisible: false,
      editGridVisible: false,
      addAreaVisible: false,
      editAreaVisible: false,
      areaList: [],
      areaPosition: [],
    };
  }

  setAreaList = areaList => {
    this.setState({ areaList });
  };

  setAreaPosition = areaPosition => {
    this.setState({ areaPosition });
  };

  addGrid = e => {
    e.preventDefault();
    const { form } = this.props;
    form.resetFields();
    this.setState({ addGridVisible: true });
  };

  editGrid = e => {
    e.preventDefault();
    this.setState({ editGridVisible: true });
  };

  addArea = e => {
    e.preventDefault();
    const { form } = this.props;
    form.resetFields();
    this.setState({ addAreaVisible: true });
  };

  editArea = e => {
    e.preventDefault();
    const { form } = this.props;
    form.resetFields();
    this.setState({ editAreaVisible: true });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const {
      gridmap: { gridList },
    } = this.props;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gridList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (selectedKeys, info) => {
    const { queryGridDetail, setSelectedKeys } = this.props;
    if (selectedKeys.length !== 0) {
      this.setState({
        treeSelected: selectedKeys[0],
        treeSelectedLevel: info.node.props.dataRef.gridLevel,
      });
      setSelectedKeys(selectedKeys[0]);
      queryGridDetail(selectedKeys[0]);
    } else {
      this.setState({ treeSelected: '', treeSelectedLevel: '' });
      setSelectedKeys('');
    }
  };

  deleteNode = e => {
    const {
      deleteTreeNode,
      queryGridList,
      queryDefaultArea,
      queryDefaultGrid,
      setSelectedKeys,
    } = this.props;
    const { treeSelected } = this.state;
    const that = this;
    e.preventDefault();
    if (treeSelected.length === 0) {
      message.warn('请选择需要删除的项！');
      return;
    }
    confirm({
      title: '确定删除？',
      content: '',
      onOk() {
        deleteTreeNode(treeSelected, data => {
          if (data.success) {
            that.setState({ treeSelected: '' });
            setSelectedKeys('');
            queryGridList();
            queryDefaultGrid();
            queryDefaultArea();
            message.info('删除成功！');
          } else {
            message.error(data.msg);
          }
        });
      },
      onCancel() {},
    });
  };

  nodeDetail = e => {
    e.preventDefault();
    const { treeSelected } = this.state;
    if (treeSelected.length !== 0) {
      this.setState({
        nodeDetailVisible: true,
      });
    }
  };

  handlenodeDetailOk = e => {
    e.preventDefault();
    this.setState({
      nodeDetailVisible: false,
    });
  };

  companyPageChange = pageNumber => {
    const { queryGridCompany } = this.props;
    const { treeSelected } = this.state;
    queryGridCompany(treeSelected, pageNumber.current, pageNumber.pageSize);
  };

  handleGridModelCancel = e => {
    e.preventDefault();
    this.setState({
      addGridVisible: false,
      editGridVisible: false,
      addAreaVisible: false,
      editAreaVisible: false,
    });
  };

  handleAddGridOk = e => {
    e.preventDefault();
    const { areaList } = this.state;
    const {
      form,
      addGrid,
      queryGridList,
      queryDefaultGrid,
      gridmap: { gridRespPerson },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (typeof fieldsValue.gridName === 'undefined' || fieldsValue.gridName === '') {
        message.warn('网格名称不能为空');
        return;
      }

      const araeArray = new Array();
      areaList.map(item => {
        araeArray.push([item.lng, item.lat]);
      });

      let staffName = '';
      gridRespPerson.map(item => {
        if (item.staffId === fieldsValue.respAddGridPerson) {
          staffName = item.staffName;
        }
      });

      const postParam = {
        gridDo: {
          gridName: fieldsValue.gridName,
          eastTo: fieldsValue.eastTo,
          westTo: fieldsValue.westTo,
          southTo: fieldsValue.southTo,
          northTo: fieldsValue.northTo,
          staffUserDto: { staffId: fieldsValue.respAddGridPerson, staffName },
        },
        pointList: areaList.length === 0 ? null : JSON.stringify(araeArray),
        paramId: '',
      };

      addGrid(postParam, data => {
        if (data.success) {
          message.info(data.msg);
          this.setState({
            addGridVisible: false,
          });
          queryGridList();
          queryDefaultGrid();
        } else {
          message.warn(data.msg);
        }
      });
    });
  };

  handleEditGridOk = e => {
    e.preventDefault();
    const { areaList, treeSelected } = this.state;
    const {
      form,
      editGrid,
      queryGridList,
      queryDefaultGrid,
      queryGridDetail,
      gridmap: { gridRespPerson },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (typeof fieldsValue.gridName === 'undefined' || fieldsValue.gridName === '') {
        message.warn('网格名称不能为空');
        return;
      }
      const araeArray = new Array();
      areaList.map(item => {
        araeArray.push([item.lng, item.lat]);
      });

      let staffName = '';
      gridRespPerson.map(item => {
        if (item.staffId === fieldsValue.respPerson) {
          staffName = item.staffName;
        }
      });
      const postParam = {
        gridDo: {
          gridName: fieldsValue.gridName,
          eastTo: fieldsValue.eastTo,
          westTo: fieldsValue.westTo,
          southTo: fieldsValue.southTo,
          northTo: fieldsValue.northTo,
          staffUserDto: { staffId: fieldsValue.respPerson, staffName },
        },
        pointList: areaList.length === 0 ? null : JSON.stringify(araeArray),
        currentId: treeSelected,
      };
      editGrid(postParam, data => {
        if (data.success) {
          message.info(data.msg);
          this.setState({
            editGridVisible: false,
          });
          queryGridDetail(treeSelected);
          queryGridList();
          queryDefaultGrid();
        } else {
          message.warn(data.msg);
        }
      });
    });
  };

  handleAddAreaOk = e => {
    e.preventDefault();
    const { treeSelected, areaPosition } = this.state;
    const {
      form,
      addGrid,
      queryGridList,
      queryDefaultGrid,
      queryDefaultArea,
      gridmap: { gridRespPerson },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (
        typeof fieldsValue.areaAddGridName === 'undefined' ||
        fieldsValue.areaAddGridName === ''
      ) {
        message.warn('网格名称不能为空');
        return;
      }
      const pointList = new Array();
      if (areaPosition.hasOwnProperty('lng')) {
        pointList.push(areaPosition.lng);
      }
      if (areaPosition.hasOwnProperty('lat')) {
        pointList.push(areaPosition.lat);
      }

      let staffName = '';
      gridRespPerson.map(item => {
        if (item.staffId === fieldsValue.areaAddRespPerson) {
          staffName = item.staffName;
        }
      });

      const postParam = {
        gridDo: {
          address: fieldsValue.areaAddAddress,
          gridName: fieldsValue.areaAddGridName,
          gridNo: fieldsValue.areaAddGridNo,
          staffUserDto: { staffId: fieldsValue.areaAddRespPerson, staffName },
        },
        paramId: treeSelected,
        pointList: pointList.length === 0 ? null : JSON.stringify(pointList),
      };
      addGrid(postParam, data => {
        if (data.success) {
          message.info(data.msg);
          this.setState({
            addAreaVisible: false,
          });
          queryGridList();
          queryDefaultGrid();
          queryDefaultArea();
        } else {
          message.warn(data.msg);
        }
      });
    });
  };

  handleEditAreaOk = e => {
    e.preventDefault();
    const { treeSelected, areaPosition } = this.state;
    const {
      form,
      editGrid,
      queryGridList,
      queryDefaultGrid,
      queryGridDetail,
      queryDefaultArea,
      gridmap: { gridRespPerson },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (typeof fieldsValue.areaGridName === 'undefined' || fieldsValue.areaGridName === '') {
        message.warn('网格名称不能为空');
        return;
      }
      const pointList = new Array();
      if (areaPosition.hasOwnProperty('lng')) {
        pointList.push(areaPosition.lng);
      }
      if (areaPosition.hasOwnProperty('lat')) {
        pointList.push(areaPosition.lat);
      }

      let staffName = '';
      gridRespPerson.map(item => {
        if (item.staffId === fieldsValue.areaRespPerson) {
          staffName = item.staffName;
        }
      });

      const postParam = {
        gridDo: {
          address: fieldsValue.areaAddress,
          gridName: fieldsValue.areaGridName,
          gridNo: fieldsValue.areaGridNo,
          staffUserDto: { staffId: fieldsValue.areaRespPerson, staffName },
        },
        currentId: treeSelected,
        pointList: pointList.length === 0 ? null : JSON.stringify(pointList),
      };
      editGrid(postParam, data => {
        if (data.success) {
          message.info(data.msg);
          this.setState({
            editAreaVisible: false,
          });
          queryGridDetail(treeSelected);
          queryGridList();
          queryDefaultGrid();
          queryDefaultArea();
        } else {
          message.warn(data.msg);
        }
      });
    });
  };

  renderDetails() {
    const {
      gridmap: { gridDetails, gridCompanys },
    } = this.props;
    const { nodeDetailVisible } = this.state;
    if (gridDetails.gridLevel === '1') {
      return (
        <Modal
          visible={nodeDetailVisible}
          onOk={this.handlenodeDetailOk}
          onCancel={this.handlenodeDetailOk}
          width={700}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="详细信息" key="1">
              <Row>
                <Col span={24}>名称：{gridDetails.gridName}</Col>
              </Row>
              <Row>
                <Col span={12}>东至：{gridDetails.eastTo}</Col>
                <Col span={12}>西至：{gridDetails.westTo}</Col>
              </Row>
              <Row>
                <Col span={12}>南至：{gridDetails.southTo}</Col>
                <Col span={12}>北至：{gridDetails.northTo}</Col>
              </Row>
              <Row>
                <Col span={12}>负责人：{gridDetails.respPerson}</Col>
                <Col span={12}>
                  电话：
                  {typeof gridDetails.staffUserDto.phone === 'undefined'
                    ? ''
                    : gridDetails.staffUserDto.phone}
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Modal>
      );
    }
    if (gridDetails.gridLevel === '2') {
      const columns = [
        {
          title: '企业名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName',
        },
        {
          title: '企业地址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '企业信息员',
          dataIndex: 'legalPerson',
          key: 'legalPerson',
          width: 150,
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          key: 'phone',
          width: 150,
        },
      ];
      return (
        <Modal
          visible={nodeDetailVisible}
          onOk={this.handlenodeDetailOk}
          onCancel={this.handlenodeDetailOk}
          width={700}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="详细信息" key="1">
              <Row>
                <Col span={12}>名称：{gridDetails.gridName}</Col>
                <Col span={12}>编号：{gridDetails.gridNo}</Col>
              </Row>
              <Row>
                <Col span={12}>负责人：{gridDetails.respPerson}</Col>
                <Col span={12}>
                  电话：
                  {typeof gridDetails.staffUserDto.phone === 'undefined'
                    ? ''
                    : gridDetails.staffUserDto.phone}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  地址：{typeof gridDetails.address === 'undefined' ? '' : gridDetails.address}
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="企业信息" key="2">
              <Table
                dataSource={gridCompanys.list}
                rowKey={record => record.id}
                columns={columns}
                bordered
                pagination={{
                  pageSize,
                  currentPage: gridCompanys.pageNum,
                  total: gridCompanys.total,
                }}
                onChange={this.companyPageChange}
              />
            </TabPane>
          </Tabs>
        </Modal>
      );
    }
    return null;
  }

  renderEditGrid() {
    const {
      form: { getFieldDecorator },
      gridmap: { gridDetails, gridRespPerson },
    } = this.props;
    const visible = true;
    return (
      <Modal
        title="编辑网格"
        style={{ top: 20 }}
        width="80%"
        destroyOnClose
        visible={visible}
        onOk={this.handleEditGridOk}
        onCancel={this.handleGridModelCancel}
      >
        <Row>
          <Col span={6}>
            <h3>网格详情</h3>
            <Form layout="inline">
              <FormItem label="名称">
                {getFieldDecorator('gridName', { initialValue: gridDetails.gridName })(
                  <Input placeholder="网格名称" />
                )}
              </FormItem>
              <FormItem label="东至">
                {getFieldDecorator('eastTo', { initialValue: gridDetails.eastTo })(
                  <Input placeholder="东至" />
                )}
              </FormItem>
              <FormItem label="西至">
                {getFieldDecorator('westTo', { initialValue: gridDetails.westTo })(
                  <Input placeholder="西至" />
                )}
              </FormItem>
              <FormItem label="南至">
                {getFieldDecorator('southTo', { initialValue: gridDetails.southTo })(
                  <Input placeholder="南至" />
                )}
              </FormItem>
              <FormItem label="北至">
                {getFieldDecorator('northTo', { initialValue: gridDetails.northTo })(
                  <Input placeholder="北至" />
                )}
              </FormItem>
              <FormItem label="负责人">
                {getFieldDecorator('respPerson', {
                  initialValue: gridDetails.staffUserDto.staffId,
                })(
                  <Select placeholder="负责人" style={{ width: 158 }} mode="multiple">
                    {gridRespPerson.map(item => (
                      <Option key={item.staffId} value={item.staffId}>
                        {item.staffName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Col>
          <Col span={18}>
            <div style={{ width: '100%', height: '400px' }}>
              <AddMap
                {...this.props}
                setAreaList={this.setAreaList}
                areaList={typeof gridDetails.areaList === 'undefined' ? [] : gridDetails.areaList}
              />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }

  renderAddGrid() {
    const {
      form: { getFieldDecorator },
      gridmap: { gridRespPerson },
    } = this.props;
    const visible = true;
    return (
      <Modal
        title="添加网格"
        style={{ top: 20 }}
        width="80%"
        destroyOnClose
        visible={visible}
        onOk={this.handleAddGridOk}
        onCancel={this.handleGridModelCancel}
      >
        <Row>
          <Col span={6}>
            <h3>网格详情</h3>
            <Form layout="inline">
              <FormItem label="名称">
                {getFieldDecorator('gridName', { initialValue: '' })(
                  <Input placeholder="网格名称" />
                )}
              </FormItem>
              <FormItem label="东至">
                {getFieldDecorator('eastTo', { initialValue: '' })(<Input placeholder="东至" />)}
              </FormItem>
              <FormItem label="西至">
                {getFieldDecorator('westTo', { initialValue: '' })(<Input placeholder="西至" />)}
              </FormItem>
              <FormItem label="南至">
                {getFieldDecorator('southTo', { initialValue: '' })(<Input placeholder="南至" />)}
              </FormItem>
              <FormItem label="北至">
                {getFieldDecorator('northTo', { initialValue: '' })(<Input placeholder="北至" />)}
              </FormItem>
              <FormItem label="负责人">
                {getFieldDecorator('respAddGridPerson')(
                  <Select placeholder="负责人" style={{ width: 158 }}>
                    {gridRespPerson.map(item => (
                      <Option key={item.staffId} value={item.staffId}>
                        {item.staffName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Col>
          <Col span={18}>
            <div style={{ width: '100%', height: '400px' }}>
              <AddMap {...this.props} setAreaList={this.setAreaList} areaList={[]} />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }

  renderAddArea() {
    const {
      form: { getFieldDecorator },
      gridmap: { gridRespPerson },
    } = this.props;
    const visible = true;
    return (
      <Modal
        title="添加区域"
        style={{ top: 20 }}
        width="80%"
        destroyOnClose
        visible={visible}
        onOk={this.handleAddAreaOk}
        onCancel={this.handleGridModelCancel}
      >
        <Row>
          <Col span={6}>
            <h3>区域详情</h3>
            <Form layout="inline">
              <FormItem label="名称">
                {getFieldDecorator('areaAddGridName', { initialValue: '' })(
                  <Input placeholder="名称" />
                )}
              </FormItem>
              <FormItem label="编号">
                {getFieldDecorator('areaAddGridNo', { initialValue: '' })(
                  <Input placeholder="编号" />
                )}
              </FormItem>
              <FormItem label="地址">
                {getFieldDecorator('areaAddAddress', { initialValue: '' })(
                  <Input placeholder="地址" />
                )}
              </FormItem>
              <FormItem label="负责人">
                {getFieldDecorator('areaAddRespPerson')(
                  <Select placeholder="负责人" style={{ width: 158 }}>
                    {gridRespPerson.map(item => (
                      <Option key={item.staffId} value={item.staffId}>
                        {item.staffName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Col>
          <Col span={18}>
            <div style={{ width: '100%', height: '400px' }}>
              <AreaMap {...this.props} setAreaPosition={this.setAreaPosition} areaPosition={[]} />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }

  renderEditArea() {
    const {
      form: { getFieldDecorator },
      gridmap: { gridDetails, gridRespPerson },
    } = this.props;
    const visible = true;
    return (
      <Modal
        title="编辑区域"
        style={{ top: 20 }}
        width="80%"
        destroyOnClose
        visible={visible}
        onOk={this.handleEditAreaOk}
        onCancel={this.handleGridModelCancel}
      >
        <Row>
          <Col span={6}>
            <h3>区域详情</h3>
            <Form layout="inline">
              <FormItem label="名称">
                {getFieldDecorator('areaGridName', { initialValue: gridDetails.gridName })(
                  <Input placeholder="名称" />
                )}
              </FormItem>
              <FormItem label="编号">
                {getFieldDecorator('areaGridNo', { initialValue: gridDetails.gridNo })(
                  <Input placeholder="编号" />
                )}
              </FormItem>
              <FormItem label="地址">
                {getFieldDecorator('areaAddress', { initialValue: gridDetails.address })(
                  <Input placeholder="地址" />
                )}
              </FormItem>
              <FormItem label="负责人">
                {getFieldDecorator('areaRespPerson', {
                  initialValue: gridDetails.staffUserDto.staffId,
                })(
                  <Select placeholder="负责人" style={{ width: 158 }}>
                    {gridRespPerson.map(item => (
                      <Option key={item.staffId} value={item.staffId}>
                        {item.staffName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Col>
          <Col span={18}>
            <div style={{ width: '100%', height: '400px' }}>
              <AreaMap
                {...this.props}
                setAreaPosition={this.setAreaPosition}
                areaPosition={
                  typeof gridDetails.areaPoint === 'undefined' ? [] : gridDetails.areaPoint
                }
              />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }

  render() {
    const {
      searchValue,
      expandedKeys,
      autoExpandParent,
      treeSelected,
      treeSelectedLevel,
      addGridVisible,
      editGridVisible,
      addAreaVisible,
      editAreaVisible,
    } = this.state;
    const {
      gridmap: { gridList },
    } = this.props;

    const loop = data =>
      data.map(item => {
        if (typeof item !== 'undefined' && item.hasOwnProperty('gridName')) {
          const index = item.gridName.indexOf(searchValue);
          let title = '';
          if (item.gridLevel === '1') {
            title = (
              <span>
                {item.gridName}({item.childCount})
              </span>
            );
            if (item.childCount > 0) {
              return (
                <TreeNode key={item.id} title={title} dataRef={item}>
                  {loop(item.childList)}
                </TreeNode>
              );
            }
          } else if (index > -1) {
            title = (
              <span>
                {item.gridNo} {item.gridName}({item.childCount})
              </span>
            );
          }
          return <TreeNode key={item.id} title={title} dataRef={item} />;
        }
        return '';
      });
    return (
      <Fragment>
        <Row style={{ textAlign: 'right', marginTop: 10, marginBottom: 10 }}>
          <Tooltip title="添加网格">
            <span className={`${styles.optBtn} ${styles.addGrid}`} onClick={this.addGrid} />
          </Tooltip>
          {treeSelected.length !== 0 && treeSelectedLevel === '1' ? (
            <Fragment>
              <Tooltip title="编辑网格">
                <span className={`${styles.optBtn} ${styles.editGrid}`} onClick={this.editGrid} />
              </Tooltip>
              <Tooltip title="添加区">
                <span className={`${styles.optBtn} ${styles.addArea}`} onClick={this.addArea} />
              </Tooltip>
            </Fragment>
          ) : (
            ''
          )}
          {treeSelected.length !== 0 && treeSelectedLevel === '2' ? (
            <Tooltip title="编辑区">
              <span className={`${styles.optBtn} ${styles.editArea}`} onClick={this.editArea} />
            </Tooltip>
          ) : (
            ''
          )}
          {treeSelected.length !== 0 ? (
            <Fragment>
              <Tooltip title="删除">
                <span
                  className={`${styles.optBtn} ${styles.deleteNode}`}
                  onClick={this.deleteNode}
                />
              </Tooltip>
              <Tooltip title="详情">
                <span className={`${styles.optBtn} ${styles.detail}`} onClick={this.nodeDetail} />
              </Tooltip>
            </Fragment>
          ) : (
            ''
          )}
        </Row>
        <Search
          style={{ marginBottom: 8, marginLeft: 5 }}
          placeholder="搜索内容"
          onChange={this.onChange}
        />
        <div className={styles.searchTree}>
          <Tree
            showLine
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.onSelect}
          >
            {loop(gridList)}
          </Tree>
        </div>

        {this.renderDetails()}
        {addGridVisible && this.renderAddGrid()}
        {editGridVisible && this.renderEditGrid()}
        {addAreaVisible && this.renderAddArea()}
        {editAreaVisible && this.renderEditArea()}
      </Fragment>
    );
  }
}

export default SearchTree;
