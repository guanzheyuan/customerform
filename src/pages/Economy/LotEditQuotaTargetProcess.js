import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, message, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './TableList.less';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ economyRule, loading }) => ({
  economyRule,
  loading: loading.models.rule,
}))
@Form.create()
class QuotaManageTableList extends PureComponent {
  state = {
    isRrfresh: true,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  cashData = {
    monthSelect: 1,
    yearDate: '1970',
    editList: [],
    editMap: {},
  };

  columns = [
    {
      title: '指标编码',
      dataIndex: 'uid',
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
      title: '',
      render: (text, record) => {
        const monthSelect = this.cashData.monthSelect + 1;
        const value = record[`actualProcessValue${monthSelect}`];
        const element = (
          <Fragment>
            <Input
              id={`${record.id}`}
              placeholder="请输入实际"
              onChange={e => {
                this.inputChangeFunction(e, record);
              }}
              value={value}
            />
          </Fragment>
        );
        return element;
      },
    },
  ];

  componentWillMount() {
    const { location } = this.props;
    const yearDate = location.yearDate !== undefined ? location.yearDate : {};
    this.cashData.yearDate = yearDate;
    const date = new Date();
    const monthr = date.getMonth();
    const selectMonth = monthr;
    this.cashData.monthSelect = selectMonth;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { year } = this.cashData;
    dispatch({
      type: 'economyRule/selectIndexTargetActualProcessList',
      payload: {
        yearDate: year,
      },
      callback: () => {},
    });
  }

  inputChangeFunction = (e, record) => {
    const valueText = e.target.value;
    const monthSelect = this.cashData.monthSelect + 1;
    // eslint-disable-next-line camelcase
    const r_record = record;
    // 修改的数据进行缓存
    const { editList, editMap } = this.cashData;
    const { targetId } = record;
    if (editMap[`${targetId}`]) {
      const map = editMap[`${targetId}`];
      map.value = valueText;
      map.monthParam = `ActualProcessValue${monthSelect}`;
      map.targetId = targetId;
      map.actualId = record.actualProcessId;
    } else {
      const map = {};
      map.value = valueText;
      map.monthParam = `ActualProcessValue${monthSelect}`;
      map.targetId = targetId;
      map.actualId = record.actualProcessId;
      editMap[`${targetId}`] = map;
      editList.push(map);
    }

    r_record[`actualProcessValue${monthSelect}`] = valueText;
    const { isRrfresh } = this.state;
    this.setState({
      isRrfresh: !isRrfresh,
    });
  };

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

  handleCancle = () => {
    router.goBack();
    // router.push('/Economy/QuotaTargetProcessManage');
  };

  backFunction = () => {
    router.goBack();
  };

  onSubmit = () => {
    const { editList } = this.cashData;
    const { dispatch } = this.props;
    dispatch({
      type: 'economyRule/lotUpdateIndexActualProcess',
      payload: { list: editList },
      callback: () => {
        router.goBack();
        // router.push('/Economy/QuotaTargetProcessManage');
        message.success('批量修改成功');
      },
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

  handleModalVisible = () => {
    router.push('/Economy/AddQuotaManage');
    // hashHistory.push('/Economy/AddQuotaManage');
  };

  //  修改某一行
  handleEditModalVisible = (flag, record) => {
    const pageState = 1;
    router.push({
      pathname: '/Economy/AddQuotaManage',
      record,
      pageState,
    });
  };

  monthSelectF = value => {
    const monthSelect = value;
    this.cashData.monthSelect = monthSelect;
    const { isRrfresh } = this.state;
    const { dispatch } = this.props;
    const { year } = this.cashData;
    dispatch({
      type: 'economyRule/selectIndexTargetActualProcessList',
      payload: {
        yearDate: year,
      },
      callback: () => {
        this.setState({ isRrfresh: !isRrfresh });
        this.cashData.editList = [];
        this.cashData.editMap = {};
      },
    });
  };

  processWrite = () => {
    const monthOptions = [
      '一月份',
      '二月份',
      '三月份',
      '四月份',
      '五月份',
      '六月份',
      '七月份',
      '八月份',
      '九月份',
      '十月份',
      '十一月份',
      '十二月份',
    ];
    const date = new Date();
    const monthr = date.getMonth();
    const monthn = monthOptions[monthr];

    const monthOptionsElement = monthOptions.map((month, index) => {
      const keyValue = `${index}`;
      const element = (
        <Option key={keyValue} value={index}>
          {month}
        </Option>
      );
      return element;
    });

    const element = (
      <div>
        <Row gutter={4}>
          <Col span={8}>
            <h1>
              填报频率（月）:
              <Select
                style={{ width: 120 }}
                placeholder="选择填报月"
                defaultValue={monthn}
                onChange={this.monthSelectF}
                ref={c => {
                  this.monthSelect = c;
                }}
              >
                {monthOptionsElement}
              </Select>
            </h1>
          </Col>
          <Col>
            <Button
              style={{ marginTop: 0, marginRight: 25, float: 'right' }}
              onClick={this.handleCancle}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 0, marginRight: 20, float: 'right' }}
              onClick={this.onSubmit}
            >
              提交
            </Button>
          </Col>
        </Row>
      </div>
    );
    return element;
  };

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
    return this.processWrite();
    // const { expandForm } = this.state;
    // return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      economyRule: { targetData },
      loading,
    } = this.props;
    // const {yearDate} = this.cashData;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="指标批量填报" backFunction={this.backFunction} backBtnShow>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
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
              data={targetData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="id"
              pagination={{ disabled: 'yes', pageSize: 100, hideOnSinglePage: 'yes' }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default QuotaManageTableList;
