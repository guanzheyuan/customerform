import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Row,
  Col,
  Button,
  Input,
  Table,
  //   Select,
  DatePicker,
  Divider,
  Popconfirm,
  //   message,
} from 'antd';
import Link from 'umi/link';

// import styles from './style.less';

const FormItem = Form.Item;
// const { Option } = Select;

@Form.create()
@connect(({ companyArchive }) => ({
  companyArchive,
  // loading: loading.effects['companyArchive/fetchArchive'],
}))
class CompanyArchive extends Component {
  columns = [
    {
      title: '标签编码',
      dataIndex: 'labelEname',
    },
    {
      title: '标签名称',
      dataIndex: 'labelCname',
    },
    {
      title: '内容类型',
      dataIndex: 'type',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        const stringA = a.type.toUpperCase(); // ignore upper and lowercase
        const stringB = b.type.toUpperCase(); // ignore upper and lowercase
        if (stringA < stringB) {
          return -1;
        }
        if (stringA > stringB) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateDate',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Fragment>
            <a
              onClick={() => {
                this.changeArchiveState(record);
              }}
            >
              {record.isValid === '1' ? '禁用' : '启用'}
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.updateArchive(record, false)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={() => {
                this.handleDelete(record.id);
              }}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        pageNum: 0,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'companyArchive/fetchContentType',
    // });
    // this.fetch();
  }

  fetch = () => {
    const { form } = this.props;
    const result = form.getFieldsValue();
    this.setState({
      searchParam: result,
    });
    const { pagination, searchParam } = this.state;
    const params = {
      ...pagination,
      ...searchParam,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'companyArchive/fetchArchive',
      params,
    });
  };

  handleTableChange = page => {
    this.setState(
      {
        pagination: { pageNum: page.current - 1, pageSize: page.pageSize },
      },
      this.fetch
    );
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companyArchive/deleteArchive',
      id,
      callback: this.fetch,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const result = form.getFieldsValue();
    const { pagination } = this.state;
    this.setState(
      {
        searchParam: result,
        pagination,
      },
      console.log(result)
      //   this.fetch
    );
  };

  changeArchiveState = record => {
    const { dispatch } = this.props;
    const isValid = record.isValid === '1' ? 0 : 1;
    const param = { id: record.id, isValid };
    dispatch({
      type: 'companyArchive/changeArchiveState',
      payload: param,
      callback: this.fetch,
    });
  };

  // 渲染搜索条件区域
  renderForm() {
    const {
      form: { getFieldDecorator },
      //   companyArchive: { archiveContentTypeList },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem>
              {getFieldDecorator('name')(<Input allowClear placeholder="事项名称" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <Form.Item>
              {getFieldDecorator('beginTime')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间" />
              )}
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item>
              {getFieldDecorator('endTime')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间" />
              )}
            </Form.Item>
          </Col>
          <Col md={6} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      companyArchive: {
        archiveListResult: { list, total },
      },
      loading,
    } = this.props;
    const {
      pagination: { pageSize },
    } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
    };
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Link to={{ pathname: '/company/addcompanydetail', state: {} }}>
              <Button icon="plus" type="primary">
                新建标签
              </Button>
            </Link>
          </div>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={list}
            columns={this.columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default CompanyArchive;
