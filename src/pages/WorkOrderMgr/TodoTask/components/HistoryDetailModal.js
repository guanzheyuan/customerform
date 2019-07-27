import React, { Component, Fragment } from 'react';
import { Button, Modal, Form, Input, Radio, Checkbox, Table, Select, Row, Col, List } from 'antd';
import { stringify } from 'qs';
import request from '@/utils/request';

import styles from '../index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    md: { span: 4 },
  },
  wrapperCol: {
    md: { span: 16 },
  },
};

@Form.create()
class HistoryDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: undefined,
      reportList: {},
      evaluatePersonList: [],
      evaluateDeptList: [],
      currentEvaluatePerson: undefined,
      currentEvaluateDept: undefined,
      evaluateDict: {
        workFinishSituation: [],
        workSatisfaction: [],
        workFinishQuality: [],
      },
      workFinishSituation: undefined,
      workFinishQuality: undefined,
      workSatisfaction: undefined,
      evaluateDesc: undefined,
      workScore: undefined,
    };
  }

  componentDidMount() {
    this.queryHistoryDetail();
  }

  queryHistoryDetail = () => {
    const { record } = this.props;
    request(`/ecogrid/audit/getStageAuditDetail`, {
      method: 'post',
      data: record,
    }).then(result => {
      this.setState(
        {
          detailData: result.data,
        },
        () => {
          // 网格员查询企业名录
          if (result.data.audit.tacheCode.startsWith('wgy')) {
            this.handleReportTableChange({
              pageNum: 1,
              pageSize: 10,
            });
          }
          // 网格中心签收：查询企业名录、评价人员列表
          else if (result.data.audit.tacheCode.startsWith('qs_wgzx')) {
            this.handleWGZXReportTableChange({
              pageNum: 1,
              pageSize: 5,
            });
            this.queryEvaluateDict();
            this.getRespPersonList(result.data.audit.workOrderId, result.data.audit.createBy);
          }
          // 专项网格员签收：查询企业名录、评价人员列表
          else if (result.data.audit.tacheCode.startsWith('qs_zxwgy')) {
            this.handleZXWGYReportTableChange({
              pageNum: 1,
              pageSize: 5,
            });
            this.queryEvaluateDict();
            this.getRespDeptList(result.data.audit.workOrderId);
          }
        }
      );
    });
  };

  handleReportTableChange = pagination => {
    const { detailData } = this.state;
    const { record } = this.props;
    this.queryReportList({
      workOrderId: detailData.audit.workOrderId,
      respPersonId: record.createBy,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    }).then(result => {
      this.setState({
        reportList: result.data,
      });
    });
  };

  handleWGZXReportTableChange = pagination => {
    const { detailData } = this.state;
    const { record } = this.props;
    this.queryReportList({
      workOrderId: detailData.audit.workOrderId,
      wgzxLeaderId: record.createBy,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    }).then(result => {
      this.setState({
        reportList: result.data,
      });
    });
  };

  handleZXWGYReportTableChange = pagination => {
    const { detailData } = this.state;
    this.queryReportList({
      workOrderId: detailData.audit.workOrderId,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    }).then(result => {
      this.setState({
        reportList: result.data,
      });
    });
  };

  // 获取网格员企业名录
  queryReportList = params => {
    return request(`/ecogrid/enterpriseinfo/getEnterReportDetail?${stringify(params)}`);
  };

  // 查询评价相关字典
  queryEvaluateDict = () => {
    return request(`/ecogrid/workEvaluate/queryDictValues`).then(result => {
      this.setState({
        evaluateDict: result,
      });
    });
  };

  // 获取被评价人列表
  getRespPersonList = (workOrderId, createBy) => {
    const params = {
      workOrderId,
      createBy,
    };
    request(`/ecogrid/task/getRespPersonListOfWgzxQs?${stringify(params)}`).then(result => {
      this.setState({
        evaluatePersonList: result,
      });
    });
  };

  // 获取被评价部门列表
  getRespDeptList = workOrderId => {
    request(`/ecogrid/task/getRespDeptList/${workOrderId}`).then(result => {
      this.setState({
        evaluateDeptList: result,
      });
    });
  };

  // 获取人员评价详情
  queryPersonEvaluateDetail = userId => {
    this.setState({
      currentEvaluatePerson: userId,
    });
    const { detailData } = this.state;
    request(`/ecogrid/workEvaluate/getEvaluateByPersonId`, {
      method: 'post',
      data: {
        workOrderId: detailData.audit.workOrderId,
        beEvaluatePerson: userId,
      },
    }).then(result => {
      this.setState({
        workFinishQuality: result.workFinishQuality,
        workFinishSituation: result.workFinishSituation,
        workSatisfaction: result.workSatisfaction,
        evaluateDesc: result.evaluateDesc,
        workScore: result.workScore,
      });
    });
  };

  // 获取部门评价详情
  queryDeptEvaluateDetail = orgId => {
    this.setState({
      currentEvaluateDept: orgId,
    });
    const { detailData } = this.state;
    request(`/ecogrid/workEvaluate/getEvaluateByDeptId`, {
      method: 'post',
      data: {
        workOrderId: detailData.audit.workOrderId,
        beEvaluateDept: orgId,
      },
    }).then(result => {
      this.setState({
        workFinishQuality: result.workFinishQuality,
        workFinishSituation: result.workFinishSituation,
        workSatisfaction: result.workSatisfaction,
        evaluateDesc: result.evaluateDesc,
        workScore: result.workScore,
      });
    });
  };

  // 领导审核
  renderLeaderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { detailData } = this.state;
    return (
      <Form {...formItemLayout}>
        <FormItem label="处理结果">
          {getFieldDecorator('procResult', {
            initialValue: detailData.audit.procResult,
            rules: [{ required: true }],
          })(
            <Radio.Group disabled>
              <Radio value="1">通过</Radio>
              <Radio value="0">不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="处理意见">
          {getFieldDecorator('procAdvise', {
            initialValue: detailData.audit.procAdvise,
            rules: [
              {
                required: true,
                message: '请填写处理意见',
              },
            ],
          })(<TextArea rows={5} disabled />)}
        </FormItem>
      </Form>
    );
  };

  // 网格办派单
  renderWGBForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { detailData } = this.state;
    const acceptDeptList = detailData.taskList.map(org => ({
      label: org.respDeptName,
      value: org.respDeptName,
    }));
    const columns = [
      {
        title: '责任人',
        dataIndex: 'respPersonName',
      },
      {
        title: '责任部门',
        dataIndex: 'respDeptName',
      },
      {
        title: '责任区域',
        width: '50%',
        render: (text, record) => {
          return record.respGridNameList.join(' ， ');
        },
      },
    ];
    return (
      <Form {...formItemLayout}>
        <FormItem label="处理结果">
          {getFieldDecorator('procResult', {
            initialValue: detailData.audit.procResult,
            rules: [{ required: true }],
          })(
            <Radio.Group disabled>
              <Radio value="1">通过</Radio>
              <Radio value="0">不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="标题">
          {getFieldDecorator('title', {
            initialValue: detailData.audit.title,
            rules: [{ required: true }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="接收部门">
          {getFieldDecorator('acceptDepts', {
            initialValue: acceptDeptList.map(org => org.value),
            rules: [
              {
                required: true,
                message: '请选择接收部门',
              },
            ],
          })(<Checkbox.Group options={acceptDeptList} onChange={this.acceptDeptChange} disabled />)}
        </FormItem>
        <FormItem label="内容">
          {getFieldDecorator('procAdvise', {
            initialValue: detailData.audit.procAdvise,
            rules: [
              {
                required: true,
                message: '请填写内容',
              },
            ],
          })(<TextArea rows={5} disabled />)}
        </FormItem>
        <FormItem label="责任划分">
          <Table
            rowKey="respPersonName"
            columns={columns}
            dataSource={detailData.taskList}
            pagination={false}
          />
        </FormItem>
      </Form>
    );
  };

  // 网格中心派单
  renderWGZXForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { detailData } = this.state;
    const columns = [
      {
        title: '责任人',
        dataIndex: 'respPersonName',
      },
      {
        title: '责任区域',
        render: (text, record) => {
          return record.respGridNameList.join(' ， ');
        },
      },
    ];
    return (
      <Form {...formItemLayout}>
        <FormItem label="处理结果">
          {getFieldDecorator('procResult', {
            initialValue: detailData.audit.procResult,
            rules: [{ required: true }],
          })(
            <Radio.Group disabled>
              <Radio value="1">通过</Radio>
              <Radio value="0">不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="标题">
          {getFieldDecorator('title', {
            initialValue: detailData.audit.title,
            rules: [{ required: true }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="内容">
          {getFieldDecorator('procAdvise', {
            initialValue: detailData.audit.procAdvise,
            rules: [
              {
                required: true,
                message: '请填写内容',
              },
            ],
          })(<TextArea rows={5} disabled />)}
        </FormItem>
        <FormItem label="责任划分">
          <Table
            rowKey="respPersonName"
            columns={columns}
            dataSource={detailData.taskList}
            pagination={false}
          />
        </FormItem>
      </Form>
    );
  };

  // 网格员处理
  renderZZWGYForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { detailData, reportList } = this.state;
    const columns = [
      {
        dataIndex: 'enterpriseName',
        title: '企业名称',
      },
      {
        dataIndex: 'gridName',
        title: '网格名称',
      },
      {
        dataIndex: 'reportStatus',
        title: '填报状态',
      },
      {
        dataIndex: 'checkStatus',
        title: '核实状态',
      },
      {
        dataIndex: 'checkDate',
        title: '核实时间',
      },
      {
        dataIndex: 'legalPerson',
        title: '企业信息员',
      },
      {
        dataIndex: 'remarks',
        title: '备注',
      },
    ];
    return (
      <Fragment>
        <Form {...formItemLayout}>
          <FormItem label="处理结果">
            {getFieldDecorator('procResult', {
              initialValue: detailData.audit.procResult,
              rules: [{ required: true }],
            })(
              <Radio.Group disabled>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="处理意见">
            {getFieldDecorator('procAdvise', {
              initialValue: detailData.audit.procAdvise,
              rules: [
                {
                  required: true,
                  message: '请填写内容',
                },
              ],
            })(<TextArea rows={5} disabled />)}
          </FormItem>
        </Form>
        <Table
          rowKey="id"
          title={() => '企业名录'}
          columns={columns}
          dataSource={reportList.list}
          pagination={{ total: reportList.total, pageSize: reportList.pageSize }}
          scroll={{ x: 1000 }}
          onChange={pagination => {
            this.handleReportTableChange({
              pageSize: pagination.pageSize,
              pageNum: pagination.current,
            });
          }}
        />
      </Fragment>
    );
  };

  // 网格中心签收
  renderWGZXQSForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      detailData,
      reportList,
      currentEvaluatePerson,
      evaluatePersonList,
      evaluateDict,
      workFinishSituation,
      workFinishQuality,
      workSatisfaction,
      evaluateDesc,
      workScore,
    } = this.state;
    const columns = [
      {
        dataIndex: 'enterpriseName',
        title: '企业名称',
      },
      {
        dataIndex: 'gridName',
        title: '网格名称',
      },
      {
        dataIndex: 'reportStatus',
        title: '填报状态',
      },
      {
        dataIndex: 'checkStatus',
        title: '核实状态',
      },
      {
        dataIndex: 'checkDate',
        title: '核实时间',
      },
      {
        dataIndex: 'remarks',
        title: '备注',
      },
    ];
    return (
      <Fragment>
        <Table
          rowKey="id"
          title={() => '企业名录'}
          columns={columns}
          dataSource={reportList.list}
          pagination={{ total: reportList.total, pageSize: reportList.pageSize }}
          scroll={{ x: 1000 }}
          onChange={pagination => {
            this.handleWGZXReportTableChange({
              pageSize: pagination.pageSize,
              pageNum: pagination.current,
            });
          }}
        />
        <Form {...formItemLayout}>
          <FormItem label="处理结果">
            {getFieldDecorator('procResult', {
              initialValue: detailData.audit.procResult,
              rules: [{ required: true }],
            })(
              <Radio.Group disabled>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="处理意见">
            {getFieldDecorator('procAdvise', {
              initialValue: detailData.audit.procAdvise,
              rules: [
                {
                  required: true,
                  message: '请填写内容',
                },
              ],
            })(<TextArea rows={5} disabled />)}
          </FormItem>
          <FormItem label="人员评价">
            <Row gutter={24}>
              <Col md={6}>
                <List
                  size="small"
                  header={<div>被评价人员列表</div>}
                  bordered
                  dataSource={evaluatePersonList}
                  renderItem={item => (
                    <List.Item
                      className={`${
                        item.userId === currentEvaluatePerson ? styles['list-active'] : ''
                      } ${styles['list-item']}`}
                      onClick={() => {
                        this.queryPersonEvaluateDetail(item.userId);
                      }}
                    >
                      {item.userName}
                    </List.Item>
                  )}
                />
              </Col>
              <Col md={18}>
                <div>
                  <span>工作完成情况:&nbsp;</span>
                  <Select style={{ width: '80%' }} value={workFinishSituation} disabled>
                    {evaluateDict.workFinishSituation.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>工作完成质量:&nbsp;</span>
                  <Select style={{ width: '80%' }} value={workFinishQuality} disabled>
                    {evaluateDict.workFinishQuality.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;满意度:&nbsp;
                  </span>
                  <Select style={{ width: '80%' }} value={workSatisfaction} disabled>
                    {evaluateDict.workSatisfaction.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价分数:&nbsp;</span>
                  <Input style={{ width: '80%' }} rows={4} value={workScore} disabled />
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价描述:&nbsp;</span>
                  <TextArea style={{ width: '80%' }} rows={4} value={evaluateDesc} disabled />
                </div>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Fragment>
    );
  };

  // 专项网格员签收
  renderZXWGYQSForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      detailData,
      reportList,
      currentEvaluateDept,
      evaluateDeptList,
      evaluateDict,
      workFinishSituation,
      workFinishQuality,
      workSatisfaction,
      evaluateDesc,
      workScore,
    } = this.state;
    const columns = [
      {
        dataIndex: 'enterpriseName',
        title: '企业名称',
      },
      {
        dataIndex: 'gridName',
        title: '网格名称',
      },
      {
        dataIndex: 'reportStatus',
        title: '填报状态',
      },
      {
        dataIndex: 'checkStatus',
        title: '核实状态',
      },
      {
        dataIndex: 'checkDate',
        title: '核实时间',
      },
      {
        dataIndex: 'remarks',
        title: '备注',
      },
    ];
    return (
      <Fragment>
        <Table
          rowKey="id"
          title={() => '企业名录'}
          columns={columns}
          dataSource={reportList.list}
          pagination={{ total: reportList.total, pageSize: reportList.pageSize }}
          scroll={{ x: 1000 }}
          onChange={pagination => {
            this.handleZXWGYReportTableChange({
              pageSize: pagination.pageSize,
              pageNum: pagination.current,
            });
          }}
        />
        <Form {...formItemLayout}>
          <FormItem label="处理结果">
            {getFieldDecorator('procResult', {
              initialValue: detailData.audit.procResult,
              rules: [{ required: true }],
            })(
              <Radio.Group disabled>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="处理意见">
            {getFieldDecorator('procAdvise', {
              initialValue: detailData.audit.procAdvise,
              rules: [
                {
                  required: true,
                  message: '请填写内容',
                },
              ],
            })(<TextArea rows={5} disabled />)}
          </FormItem>
          <FormItem label="部门评价">
            <Row gutter={24}>
              <Col md={6}>
                <List
                  size="small"
                  header={<div>被评价部门列表</div>}
                  bordered
                  dataSource={evaluateDeptList}
                  renderItem={item => (
                    <List.Item
                      className={`${
                        item.orgId === currentEvaluateDept ? styles['list-active'] : ''
                      } ${styles['list-item']}`}
                      onClick={() => {
                        this.queryDeptEvaluateDetail(item.orgId);
                      }}
                    >
                      {item.orgName}
                    </List.Item>
                  )}
                />
              </Col>
              <Col md={18}>
                <div>
                  <span>工作完成情况:&nbsp;</span>
                  <Select style={{ width: '80%' }} value={workFinishSituation} disabled>
                    {evaluateDict.workFinishSituation.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>工作完成质量:&nbsp;</span>
                  <Select style={{ width: '80%' }} value={workFinishQuality} disabled>
                    {evaluateDict.workFinishQuality.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;满意度:&nbsp;
                  </span>
                  <Select style={{ width: '80%' }} value={workSatisfaction} disabled>
                    {evaluateDict.workSatisfaction.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价分数:&nbsp;</span>
                  <Input style={{ width: '80%' }} rows={4} value={workScore} disabled />
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价描述:&nbsp;</span>
                  <TextArea style={{ width: '80%' }} rows={4} value={evaluateDesc} disabled />
                </div>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Fragment>
    );
  };

  render() {
    const { record, cancelDetailModal } = this.props;
    const { detailData } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={`${record.processStage}-详情`}
        visible
        onCancel={cancelDetailModal}
        footer={
          <Button type="primary" onClick={cancelDetailModal}>
            关闭
          </Button>
        }
        width="60vw"
        bodyStyle={{ maxHeight: '60vh', overflowY: 'scroll' }}
      >
        {detailData && detailData.audit.tacheCode === 'leader_audit' && this.renderLeaderForm()}
        {detailData && detailData.audit.tacheCode === 'wgb' && this.renderWGBForm()}
        {detailData && detailData.audit.tacheCode.startsWith('wgzx') && this.renderWGZXForm()}
        {detailData && detailData.audit.tacheCode.startsWith('wgy') && this.renderZZWGYForm()}
        {detailData && detailData.audit.tacheCode.startsWith('qs_wgzx') && this.renderWGZXQSForm()}
        {detailData &&
          detailData.audit.tacheCode.startsWith('qs_zxwgy') &&
          this.renderZXWGYQSForm()}
      </Modal>
    );
  }
}

export default HistoryDetailModal;
