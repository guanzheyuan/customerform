import React, { Component } from 'react';
import { Card, Input, Table, Icon, Form, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import AddCompanyLabel from './components/AddCompanyLabel';
import DetailCompanyLabel from './components/DetailCompanyLabel';

const FormItem = Form.Item;
const pageSize = 10;
@Form.create()
@connect(({ labelMgr, loading }) => ({
  labelMgr,
  loading: loading.effects['labelMgr/queryLabelList'],
}))
class CompanyLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelVisible: false,
      detailVisible: false,
      pageNumCount: 0,
      labelTitle: '',
      labelType: '',
      labelData: [],
      detailId: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelMgr/queryLabelList',
      payload: {
        pageNum: 0,
        pageSize: 10,
      },
    });
    // this.handleSearch();
  }

  onChange = pageNumber => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      const searchParam = {
        searchParam: typeof fieldsValue.labelName === 'undefined' ? '' : fieldsValue.labelName,
      };
      dispatch({
        type: 'labelMgr/queryLabelList',
        payload: {
          pageNum: pageNumber.current - 1,
          pageSize: pageNumber.pageSize,
          searchParam,
        },
      });
    });
    this.setState({
      pageNumCount: pageNumber.current - 1,
    });
  };

  handleSearch = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      const labelName = {
        labelName: typeof fieldsValue.labelName === 'undefined' ? '' : fieldsValue.labelName,
      };
      dispatch({
        type: 'labelMgr/queryLabelList',
        payload: {
          pageNum: 0,
          pageSize,
          labelName,
        },
      });
    });
  };

  handlechange = record => {
    const { form, dispatch } = this.props;
    const { pageNumCount } = this.state;
    const renderStatus = record.labelStatus === '0' ? 1 : 0;
    form.validateFields((err, fieldsValue) => {
      const labelName = {
        labelName: typeof fieldsValue.labelName === 'undefined' ? '' : fieldsValue.labelName,
      };
      dispatch({
        type: 'labelMgr/updateStatusChange',
        payload: {
          labelId: record.id,
          labelStatus: renderStatus,
        },
        callback: () => {
          dispatch({
            type: 'labelMgr/queryLabelList',
            payload: {
              pageNum: pageNumCount,
              pageSize: 10,
              labelName,
            },
          });
        },
      });
    });
  };

  handleDelete = record => {
    const { form, dispatch } = this.props;
    const { pageNumCount } = this.state;
    form.validateFields((err, fieldsValue) => {
      const labelName = {
        labelName: typeof fieldsValue.labelName === 'undefined' ? '' : fieldsValue.labelName,
      };
      dispatch({
        type: 'labelMgr/deleteLabel',
        payload: {
          labelId: record.id,
        },
        callback: () => {
          dispatch({
            type: 'labelMgr/queryLabelList',
            payload: {
              pageNum: pageNumCount,
              pageSize: 10,
              labelName,
            },
          });
        },
      });
    });
  };

  handleDetailLabel = ({ id }) => {
    this.setState({
      detailVisible: true,
      detailId: id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'labelMgr/queryDetailLabel',
      payload: {
        labelId: id,
      },
      callback: () => {
        dispatch({
          type: 'labelMgr/queryAllLabelList',
          payload: {
            labelId: id,
            pageNum: 0,
            pageSize,
          },
        });
      },
    });
  };

  handleAddLabel = (type, record) => {
    this.setState({
      modelVisible: true,
      labelType: type,
      labelData: { ...record },
    });
    if (type === 'new') {
      this.setState({
        labelTitle: '新增企业标签',
      });
    } else if (type === 'edit') {
      this.setState({
        labelTitle: '编辑企业标签',
      });
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'labelMgr/queryUpdatafreq',
    });
    dispatch({
      type: 'labelMgr/queryParamList',
    });
  };

  render() {
    const {
      labelMgr: { labelList, labelDetail, paramList, updatafreq },
      form: { getFieldDecorator },
    } = this.props;
    const {
      modelVisible,
      detailVisible,
      labelTitle,
      labelType,
      labelData,
      detailId,
      pageNumCount,
    } = this.state;
    const detailCompanyLabelProps = {
      detailVisible,
      labelDetail,
      detailId,
      handleDetail: () => {
        this.setState({
          detailVisible: false,
        });
      },
    };
    const addCompanyLabelProps = {
      modelVisible,
      updatafreq,
      labelTitle,
      labelType,
      labelData,
      pageNumCount,
      paramList,
      handleAdd: () => {
        this.setState({
          modelVisible: false,
        });
      },
    };
    const columns = [
      {
        title: '标签编码',
        dataIndex: 'labelNo',
        key: 'labelNo',
      },
      {
        title: '标签名称',
        dataIndex: 'labelName',
        key: 'labelName',
        render: (text, record) => (
          <a
            onClick={() => {
              this.handleDetailLabel(record);
            }}
          >
            {text}
          </a>
        ),
      },
      {
        title: '标签规则',
        dataIndex: 'labelRule',
        key: 'labelRule',
      },
      {
        title: '更新频率',
        key: 'updateFreqName',
        dataIndex: 'updateFreqName',
      },
      {
        title: '标签有效期',
        // dataIndex: 'labelEndDate',
        key: 'labelEndDate',
        render: record => (
          <div>
            <span>{record.labelStartDate ? record.labelStartDate.substr(0, 10) : ''}</span>
            &nbsp;&nbsp;~&nbsp;&nbsp;
            <span>{record.labelEndDate ? record.labelEndDate.substr(0, 10) : ''}</span>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span className={styles.handleIcon}>
            <Icon
              type="unordered-list"
              title="详情"
              onClick={() => {
                this.handleDetailLabel(record);
              }}
            />
            <Icon
              type="edit"
              title="编辑"
              onClick={() => {
                this.handleAddLabel('edit', record);
              }}
            />
            {record.labelStatus === '1' && (
              <Popconfirm
                title="确定禁用吗？"
                onText="确定"
                cancelText="取消"
                onConfirm={() => this.handlechange(record)}
              >
                <Icon type="check-circle" title="启用" />
              </Popconfirm>
            )}
            {record.labelStatus === '0' && (
              <Popconfirm
                title="确定启用吗？"
                onText="确定"
                cancelText="取消"
                onConfirm={() => this.handlechange(record)}
              >
                <Icon type="stop" title="禁用" style={{ color: '#f00' }} />
              </Popconfirm>
            )}
            <Popconfirm
              title="确定删除吗？"
              onText="确定"
              cancelText="取消"
              onConfirm={() => this.handleDelete(record)}
            >
              <Icon type="delete" title="删除" />
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div>
        {modelVisible && <AddCompanyLabel {...addCompanyLabelProps} />}
        {labelDetail && labelDetail.data && <DetailCompanyLabel {...detailCompanyLabelProps} />}
        <Card
          className={styles.labelCard}
          title="企业标签"
          extra={
            <div className={styles.addLabel}>
              <a
                onClick={() => {
                  this.handleAddLabel('new');
                }}
              >
                新增标签
              </a>
              <Form>
                <FormItem label="">
                  {getFieldDecorator('labelName')(<Input placeholder="请输入标签名称" />)}
                </FormItem>
                <Button type="primary" onClick={this.handleSearch}>
                  搜索
                </Button>
              </Form>
            </div>
          }
          bordered={false}
        >
          <Table
            columns={columns}
            dataSource={labelList.list}
            className={styles.labelTable}
            rowKey={record => record.id}
            pagination={{ pageSize, currentPage: labelList.pageNum, total: labelList.total }}
            onChange={this.onChange}
          />
        </Card>
      </div>
    );
  }
}

export default CompanyLabel;
