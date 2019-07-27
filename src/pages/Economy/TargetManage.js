import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './TableList.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '指标编码',
      dataIndex: 'uid',
      // render: text => <Link to={`/profile/basic/${text.replace(/\s+/gi, '-')}`}>{text}</Link>,
    },
    {
      title: '指标名称',
      dataIndex: 'indexName',
    },
    {
      title: '指标等级',
      dataIndex: 'indexLevel',
    },
    {
      title: '指标类型',
      dataIndex: 'indexType',
    },
    {
      title: '责任单位',
      dataIndex: 'respDept',
    },
    {
      title: '目标值',
      dataIndex: 'targetValue',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '年度',
      dataIndex: 'yearDate',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除？"
            okText="是"
            cancelText="否"
            onConfirm={() => this.handleDeleteModalVisible(true, record)}
          >
            <a href="#">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleLookModalVisible(true, record)}>查看</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/selectTargetYearList',
      payload: {},
      callback: () => {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/selectTargetYearList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/selectTargetYearList',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'rule/selectTargetYearList',
        payload: values,
      });
    });
  };

  // handleModalVisible = flag => {
  //   router.push('/Economy/AddTargetManage');
  //   this.setState({
  //     // eslint-disable-next-line react/no-unused-state
  //     modalVisible: !!flag,
  //   });
  // };

  //  修改某一行
  handleEditModalVisible = (flag, record) => {
    const pageState = 1;
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/selectTargetProcessList',
      payload: {
        indexTargetId: record.targetId,
      },
      callback: response => {
        router.push({
          pathname: '/Economy/AddTargetManage',
          record,
          pageState,
          response,
        });
      },
    });
  };

  //  查看某一行
  handleLookModalVisible = (flag, record) => {
    const pageState = 2;
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/selectTargetProcessList',
      payload: {
        indexTargetId: record.targetId,
      },
      callback: response => {
        router.push({
          pathname: '/Economy/AddTargetManage',
          record,
          pageState,
          response,
        });
      },
    });
  };

  //  删除某一行
  handleDeleteModalVisible = (flag, record) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'rule/deleteJjyxidexTargetYear',
      payload: record,
      callback: response => {
        if (response === 1) {
          form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
              ...fieldsValue,
              updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };
            this.setState({
              formValues: values,
            });
            dispatch({
              type: 'rule/selectTargetYearList',
              payload: values,
            });
          });
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
      },
    });
  };

  // 新建指标目标功能
  newTargetHandle = () => {
    const pageState = 0;
    router.push({
      pathname: '/Economy/AddTargetManage',
      pageState,
    });
  };

  // handleUpdateModalVisible = (flag, record) => {
  //   this.setState({
  //     // eslint-disable-next-line react/no-unused-state
  //     updateModalVisible: !!flag,
  //     // eslint-disable-next-line react/no-unused-state
  //     stepFormValues: record || {},
  //   });
  // };

  // handleAdd = fields => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'rule/add',
  //     payload: {
  //       desc: fields.desc,
  //     },
  //   });

  //   message.success('添加成功');
  //   this.handleModalVisible();
  // };

  // handleUpdate = fields => {
  //   const { dispatch } = this.props;
  //   const { formValues } = this.state;
  //   dispatch({
  //     type: 'rule/update',
  //     payload: {
  //       query: formValues,
  //       body: {
  //         name: fields.name,
  //         desc: fields.desc,
  //         key: fields.key,
  //       },
  //     },
  //   });

  //   message.success('配置成功');
  //   this.handleUpdateModalVisible();
  // };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={6}>
            <FormItem label="指标名称">
              {getFieldDecorator('indexName')(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="年份">
              {getFieldDecorator('yearDate')(<Input placeholder="请输入年份" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="责任单位">
              {getFieldDecorator('respDept')(<Input placeholder="责任单位" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={6}>
            <FormItem label="专项类型">
              {getFieldDecorator('indexName')(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="年份">
              {getFieldDecorator('yearDate')(<Input placeholder="请输入年份" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="所属部门">
              {getFieldDecorator('respDept')(<Input placeholder="责任单位" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="指标等级">
              {getFieldDecorator('indexLevel')(
                <Input placeholder="请输入等级" />
                // <DatePicker style={{ width: '100%' }} placeholder="请输入等级" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={6}>
            <FormItem label="指标类型">
              {getFieldDecorator('indexType')(<Input placeholder="请输入类型" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      rule: { targetData },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="指标目标管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.newTargetHandle()}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={targetData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
