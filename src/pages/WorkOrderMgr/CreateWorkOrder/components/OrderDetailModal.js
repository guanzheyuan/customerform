import React, { Component, Fragment } from 'react';
import { Modal, Form, Input, Row, Col, Tabs, Button } from 'antd';
import HistoryList from '../../TodoTask/components/HistoryList';

import styles from '../index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

class OrderDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      workOrderInfo: { workOrderBaseInfo, attachmentList },
      auditList,
      detailModalVisible,
      handleCancelDetailModal,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title="工单详情"
        visible={detailModalVisible}
        width="60vw"
        centered
        onCancel={handleCancelDetailModal}
        footer={
          <Button type="primary" onClick={handleCancelDetailModal}>
            关闭
          </Button>
        }
        bodyStyle={{ maxHeight: '60vh', overflowY: 'scroll' }}
      >
        <Tabs defaultActiveKey="1" animated={false}>
          <TabPane tab="工单详情" key="1">
            <Form layout="vertical">
              <Row gutter={{ md: 48 }}>
                <Col md={24}>
                  <FormItem label="标题">
                    <Input disabled defaultValue={workOrderBaseInfo.title} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="任务发起人部门名称">
                    <Input disabled defaultValue={workOrderBaseInfo.deptName} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="任务发起人子部门">
                    <Input disabled defaultValue={workOrderBaseInfo.sectionName} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="任务发起人">
                    <Input disabled defaultValue={workOrderBaseInfo.createByName} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="联系电话">
                    <Input disabled defaultValue={workOrderBaseInfo.contractPhone} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="工单类型">
                    <Input disabled defaultValue={workOrderBaseInfo.workType} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="任务发起时间">
                    <Input disabled defaultValue={workOrderBaseInfo.taskBeginTime} />
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="任务要求完成时间">
                    <Input disabled defaultValue={workOrderBaseInfo.taskEndTime} />
                  </FormItem>
                </Col>
                <Col md={24}>
                  <FormItem label="工作内容">
                    <TextArea disabled rows={4} defaultValue={workOrderBaseInfo.workContent} />
                  </FormItem>
                </Col>
                <Col md={24}>
                  <FormItem label="工作要求">
                    <TextArea disabled rows={4} defaultValue={workOrderBaseInfo.workRequest} />
                  </FormItem>
                </Col>
                <Col md={24}>
                  <FormItem label="任务完成提交形式">
                    <TextArea disabled rows={4} defaultValue={workOrderBaseInfo.taskFinishType} />
                  </FormItem>
                </Col>
                <Col md={24}>
                  <FormItem label="附件列表">
                    <Fragment>
                      {attachmentList.map(file => (
                        <div key={file.id} className={styles['file-gutter']}>
                          <a href={`/api/${file.url}`}>{file.srcFileName}</a>
                        </div>
                      ))}
                    </Fragment>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="处理历史" key="2">
            <HistoryList historyList={auditList} />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default OrderDetailModal;
