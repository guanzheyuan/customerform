import React, { Component } from 'react';
import { Form, List, Input } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { TextArea } = Input;
const pageSize = 10;

@connect(({ labelMgr, loading }) => ({
  labelMgr,
  loading: loading.effects['labelMgr/queryQyRightList'],
}))
class Steps4 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onChange = pageNumber => {
    const {
      dispatch,
      labelMgr: { qyRuleId },
    } = this.props;
    dispatch({
      type: 'labelMgr/queryQyRightList',
      payload: {
        labelId: qyRuleId.data,
        pageNum: pageNumber - 1,
        pageSize,
      },
    });
  };

  render() {
    const {
      firstSteps,
      updatafreq,
      labelMgr: { qyRightList },
    } = this.props;
    const companyToatl = qyRightList.total;
    let newLabelPer = '';
    if (firstSteps.labelPer === '1') {
      newLabelPer = '仅自己可见';
    } else if (firstSteps.labelPer === '2') {
      newLabelPer = '仅部门可见';
    } else if (firstSteps.labelPer === '3') {
      newLabelPer = '全部可见';
    }
    let updateFreqContent = '';
    if (updatafreq) {
      updatafreq.forEach(item => {
        if (item.dictCode === firstSteps.updateFreq) {
          updateFreqContent = item.dictLabel;
        }
      });
    }

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
      <Form {...formItemLayout} className={styles.steps4}>
        <Form.Item label="标签名称">
          <span>{firstSteps.labelName}</span>
        </Form.Item>
        <Form.Item label="有效期">
          <span>{firstSteps.labelStartDate}</span>
          <span style={{ marginLeft: '10px', marginRight: '10px' }}>~</span>
          <span>{firstSteps.labelEndDate}</span>
        </Form.Item>
        <Form.Item label="标签描述">
          <TextArea value={firstSteps.labelDescribe} />
        </Form.Item>
        <Form.Item label="更新频率">
          <span>{updateFreqContent}</span>
          <Form.Item label="标签权限" className={styles.otherStep4Form}>
            <span>{newLabelPer}</span>
          </Form.Item>
        </Form.Item>
        <Form.Item label="标签提交人">
          <span>{firstSteps.userCode}</span>
          <Form.Item label="标签审核人" className={styles.otherStep4Form}>
            <span>{firstSteps.userCode}</span>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="企业名单"
          extra={
            <span style={{ position: 'absolute', left: '-90px', top: '30px' }}>
              共计{companyToatl}家企业
            </span>
          }
        >
          <List
            bordered
            dataSource={qyRightList.list}
            className={styles.companyList}
            renderItem={item => <List.Item>{item.enterpriseName}</List.Item>}
            pagination={{
              pageSize,
              total: qyRightList.total,
              currentPage: qyRightList.pageNum,
            }}
            onChange={this.onChange}
            // footer={<div><Pagination defaultCurrent={1} pageSize={pageSize} total={qyRightList.total} onChange={this.onChange} /></div>}
          />
        </Form.Item>
      </Form>
    );
  }
}
export default Steps4;
