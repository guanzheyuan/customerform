import React, { Component } from 'react';
import { Transfer, Pagination, Form, Input } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const pageSize = 10;
const FormItem = Form.Item;
const { Search } = Input;
@Form.create()
@connect(({ labelMgr, loading }) => ({
  labelMgr,
  loading: loading.effects['labelMgr/queryQyLeftList'],
}))
class Steps3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumCount: 0,
    };
  }

  renderFooter = () => (
    <div size="small" style={{ float: 'right', margin: 5 }} onClick={this.handlePage}>
      &nbsp;
    </div>
  );

  handleSerSource = () => {
    const { pageNumCount } = this.state;
    const { form, dispatch, labelId } = this.props;
    form.validateFields((err, fieldsValue) => {
      const enterpriseName = {
        enterpriseName:
          typeof fieldsValue.enterpriseName === 'undefined' ? '' : fieldsValue.enterpriseName,
      };
      dispatch({
        type: 'labelMgr/queryQyLeftList',
        payload: {
          labelId,
          pageNum: pageNumCount,
          pageSize,
          enterpriseName,
        },
        callback: () => {
          const { getNewMock } = this.props;
          getNewMock();
        },
      });
    });
  };

  handleChange = (targetKeys, nextTargetKeys, direction) => {
    const { pageNumCount } = this.state;
    const { targetContent, labelId, dispatch, form } = this.props;
    const newDirection = [];
    targetContent.forEach(item => {
      direction.forEach(target => {
        if (item.id === target) {
          newDirection.push(item.refId);
        }
      });
    });
    // const addOrRemove = targetLength > targetKeys.length;
    form.validateFields((err, fieldsValue) => {
      const enterpriseName = {
        enterpriseName:
          typeof fieldsValue.enterpriseName === 'undefined' ? '' : fieldsValue.enterpriseName,
      };
      if (nextTargetKeys === 'right') {
        const newArray = {
          labelId,
          enterpriseIds: direction,
        };
        dispatch({
          type: 'labelMgr/addQyData',
          payload: {
            params: newArray,
          },
          callback: () => {
            dispatch({
              type: 'labelMgr/queryQyRightList',
              payload: {
                labelId,
                pageNum: pageNumCount,
                pageSize,
              },
              callback: () => {
                dispatch({
                  type: 'labelMgr/queryQyLeftList',
                  payload: {
                    labelId,
                    pageNum: pageNumCount,
                    pageSize,
                    enterpriseName,
                  },
                  callback: () => {
                    const { getNewMock } = this.props;
                    getNewMock();
                  },
                });
              },
            });
          },
        });
      }
      if (nextTargetKeys === 'left') {
        const newArray = {
          relIds: newDirection,
        };
        dispatch({
          type: 'labelMgr/deleteQyData',
          payload: {
            params: newArray,
          },
          callback: () => {
            dispatch({
              type: 'labelMgr/queryQyRightList',
              payload: {
                labelId,
                pageNum: pageNumCount,
                pageSize,
              },
              callback: () => {
                dispatch({
                  type: 'labelMgr/queryQyLeftList',
                  payload: {
                    labelId,
                    pageNum: pageNumCount,
                    pageSize,
                    enterpriseName,
                  },
                  callback: () => {
                    const { getNewMock } = this.props;
                    getNewMock();
                  },
                });
              },
            });
          },
        });
      }
    });

    // this.setState({ targetKeys });
  };

  handleChangeRightPage = pageNumber => {
    const { dispatch, labelId } = this.props;
    dispatch({
      type: 'labelMgr/queryQyRightList',
      payload: {
        labelId,
        pageNum: pageNumber - 1,
        pageSize,
      },
      callback: () => {
        const { getNewMock } = this.props;
        getNewMock();
      },
    });
    this.setState({
      pageNumCount: pageNumber - 1,
    });
  };

  handleChangeLeftPage = pageNumber => {
    const { dispatch, labelId } = this.props;
    dispatch({
      type: 'labelMgr/queryQyLeftList',
      payload: {
        labelId,
        pageNum: pageNumber - 1,
        pageSize,
      },
      callback: () => {
        const { getNewMock } = this.props;
        getNewMock();
      },
    });
    this.setState({
      pageNumCount: pageNumber - 1,
    });
  };

  render() {
    const {
      labelMgr: { qyLeftList, qyRightList },
      form: { getFieldDecorator },
      mockData,
      targetKeys,
    } = this.props;
    // const { mockData, targetKeys } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <div style={{ position: 'relative' }}>
        <Form {...formItemLayout} style={{ width: '350px', marginLeft: '60px', marginTop: '30px' }}>
          <FormItem label="搜索">
            {getFieldDecorator('enterpriseName')(
              <Search placeholder="请输入企业名称" onSearch={this.handleSerSource} />
            )}
          </FormItem>
        </Form>
        <Transfer
          className={styles.steps3}
          dataSource={mockData}
          titles={['未选择企业名单', '已选择企业名单']}
          locale={{ itemUnit: '家企业', itemsUnit: '家企业' }}
          listStyle={{
            width: 350,
            height: 300,
            marginBottom: 40,
          }}
          operations={['添加企业', '移除企业']}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          render={item => item.content}
          // footer={<div onClick={this.handlePage}>123</div>}
          footer={this.renderFooter}
        />
        <Pagination
          size="small"
          defaultCurrent={1}
          pageSize={pageSize}
          total={qyLeftList.total}
          className={styles.leftPage}
          onChange={this.handleChangeLeftPage}
        />
        <Pagination
          size="small"
          defaultCurrent={1}
          pageSize={pageSize}
          total={qyRightList.total}
          className={styles.rightPage}
          onChange={this.handleChangeRightPage}
        />
      </div>
    );
  }
}
export default Steps3;
