import React, { Component } from 'react';
import { Modal, List, Form } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
// import FormItem from 'antd/lib/form/FormItem';
const pageSize = 10;
@connect(({ labelMgr, loading }) => ({
  labelMgr,
  loading: loading.effects['labelMgr/queryAllLabelList'],
}))
class DetailCompanyLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // const { dispatch, detailId } = this.props;
    // dispatch({
    //   type: 'labelMgr/queryAllLabelList',
    //   payload: {
    //     labelId: detailId,
    //     pageNum: 0,
    //     pageSize,
    //   },
    // });
  }

  handleOK = () => {
    const { handleDetail } = this.props;
    handleDetail();
  };

  handleCancle = () => {
    const { handleDetail } = this.props;
    handleDetail();
  };

  onChange = pageNumber => {
    const { detailId, dispatch } = this.props;
    dispatch({
      type: 'labelMgr/queryAllLabelList',
      payload: {
        labelId: detailId,
        pageNum: pageNumber.current - 1,
        pageSize: pageNumber.pageSize,
      },
    });
  };

  render() {
    const {
      detailVisible,
      labelDetail,
      labelMgr: { allLabelList },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <div>
        <Modal title="详情" visible={detailVisible} footer={null} onCancel={this.handleCancle}>
          <Form {...formItemLayout}>
            <Form.Item label="标签名称">
              <span>{labelDetail.data.labelInfo.labelName}</span>
            </Form.Item>
            <Form.Item label="有效期">
              <span>{labelDetail.data.labelInfo.labelStartDate}</span>
              <span style={{ marginLeft: '10px', marginRight: '10px' }}>~</span>
              <span>{labelDetail.data.labelInfo.labelEndDate}</span>
            </Form.Item>
            <Form.Item label="标签描述">
              <span>{labelDetail.data.labelInfo.labelDescribe}</span>
            </Form.Item>
            <Form.Item label="更新频率">
              <span>{labelDetail.data.labelInfo.updateFreqName}</span>
            </Form.Item>
            <Form.Item label="企业名单">
              <List
                bordered
                dataSource={allLabelList.list}
                className={styles.detailList}
                renderItem={item => <List.Item>{item.enterpriseName}</List.Item>}
                pagination={{
                  pageSize,
                  currentPage: allLabelList.pageNum,
                  total: allLabelList.total,
                }}
                onChange={this.onChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default DetailCompanyLabel;
