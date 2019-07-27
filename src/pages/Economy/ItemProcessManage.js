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
  // message,
  Divider,
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

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class ItemProcessManage extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      // render: text => <Link to={`/profile/basic/${text.replace(/\s+/gi, '-')}`}>{text}</Link>,
    },
    {
      title: '计划总投资亿(区)',
      dataIndex: 'planTotalInvest',
    },
    {
      title: '计划总投资中的政府资金(区)',
      dataIndex: 'areaPlanGovInvest',
    },
    {
      title: '当年投资计划政府资金(区)',
      dataIndex: 'areaPlanCurYearGovInvest',
    },
    {
      title: '年度建设计划一季度',
      dataIndex: 'firstSeasonWork',
    },
    {
      title: '年度建设计划二季度',
      dataIndex: 'secondSeasonWork',
    },
    {
      title: '年份',
      dataIndex: 'targetYear',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>填报</a>
          <Divider type="vertical" />
          {/* <a onClick={() => this.handleDeleteModalVisible(true, record)}>删除</a>
          <Divider type="vertical" /> */}
          <a onClick={() => this.handleLookModalVisible(true, record)}>查看</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/getProjectTargetYearList',
      payload: {},
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
      type: 'rule/getProjectTargetYearList',
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
      type: 'rule/getProjectTargetYearList',
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
        type: 'rule/getProjectTargetYearList',
        payload: values,
      });
    });
  };

  handelSelect = () => {};

  //  修改某一行
  handleEditModalVisible = (flag, record) => {
    const pageState = 1;

    const { dispatch } = this.props;
    dispatch({
      type: 'rule/getJjyxProjectActualProcess',
      payload: {
        projectYearTargetId: record.id,
      },
      callback: response => {
        router.push({
          pathname: '/Economy/EditItemProcess',
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
      type: 'rule/getJjyxProjectActualProcess',
      payload: {
        projectYearTargetId: record.id,
      },
      callback: response => {
        router.push({
          pathname: '/Economy/EditItemProcess',
          record,
          pageState,
          response,
        });
      },
    });
  };

  // handleModalVisible = flag => {
  //   this.setState({
  //     modalVisible: !!flag,
  //   });
  // };

  // handleUpdateModalVisible = (flag, record) => {
  //   this.setState({
  //     // eslint-disable-next-line react/no-unused-state
  //     updateModalVisible: !!flag,
  //     // eslint-disable-next-line react/no-unused-state
  //     stepFormValues: record || {},
  //   });
  //   router.push('/Economy/EditItemProcess');
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
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="年份">
              {getFieldDecorator('targetYear')(<Input placeholder="请输入年份" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="总投资">
              {getFieldDecorator('planTotalInvest')(<Input placeholder="投资额" />)}
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
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="年份">
              {getFieldDecorator('targetYear')(<Input placeholder="请输入年份" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="所属部门">
              {getFieldDecorator('planTotalInvest')(<Input placeholder="投资额" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="政府资金(区)">
              {getFieldDecorator('areaPlanGovInvest')(
                // <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                <Input placeholder="政府投资额" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={6}>
            <FormItem label="年政府投资额">
              {getFieldDecorator('areaPlanCurYearGovInvest')(<Input placeholder="年政府投资额" />)}
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
      rule: { projectTarget },
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
      <PageHeaderWrapper title="项目进度管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                全选
              </Button> */}
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
              data={projectTarget}
              columns={this.columns}
              // rowSelection={rowSelection}
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

export default ItemProcessManage;
