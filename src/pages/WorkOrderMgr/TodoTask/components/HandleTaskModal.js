import React, { Component, Fragment } from 'react';
import moment from 'moment';
import {
  Button,
  Modal,
  message,
  Tabs,
  Select,
  Form,
  Input,
  Radio,
  Row,
  Col,
  Checkbox,
  Table,
  DatePicker,
  Upload,
  Icon,
  List,
  TreeSelect,
  InputNumber,
} from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import request from '@/utils/request';

import AddRemarksModal from './AddRemarksModal';

import styles from '../index.less';

import HistoryList from './HistoryList';

const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    md: { span: 4 },
  },
  wrapperCol: {
    md: { span: 16 },
  },
};
@Form.create()
@connect()
class HandleTaskModal extends Component {
  constructor(props) {
    super(props);
    const workerList = props.allPersonList.map(worker => {
      return {
        userId: worker.userId,
        userName: worker.userName,
        gridList: worker.gridList,
        selectedList: _.map(worker.gridList, 'gridId').map(gridId => `${gridId}`),
      };
    });
    this.state = {
      selectedRowKeys: [],
      processUserList: [],
      processWorkerList: workerList,
      reportPagination: { pageSize: 5, pageNum: 1 },
      evaluateId: undefined,
      checkStatus: '',
      workFinishSituation: undefined,
      workFinishQuality: undefined,
      workSatisfaction: undefined,
      workScore: undefined,
      evaluateDesc: undefined,
      currentEvaluatePerson: undefined,
      currentEvaluateDept: undefined,
      addRemarksVisible: false,
      currentReport: undefined,
      checkSituation: 'block',
      isRequiredWGB: true,
      fileList: props.attachmentList.map(file => {
        return {
          id: file.id,
          uid: file.id,
          name: file.srcFileName,
          url: `/api/${file.url}`,
        };
      }),
    };
  }

  okHandle = () => {
    const { record } = this.props;
    const { isRequiredWGB } = this.state;
    if (record.tacheCode === 'leader_audit') {
      this.leaderAuditSubmit();
    } else if (record.tacheCode === 'wgb' && isRequiredWGB) {
      this.wgbSubmit();
    } else if (record.tacheCode === 'wgb' && !isRequiredWGB) {
      this.wgbSubmitTd();
    } else if (record.tacheCode.startsWith('td_from')) {
      this.tdFromLeaderSubmit();
    } else if (record.tacheCode.startsWith('wgzx')) {
      this.wgzxSubmit();
    } else if (record.tacheCode.startsWith('wgy')) {
      this.zzwgySubmit();
    } else if (record.tacheCode.startsWith('qs')) {
      this.wgzxqsSubmit();
    }
  };

  // 领导退单环节提交
  tdFromLeaderSubmit = () => {
    const { form, handleSubmit, record } = this.props;
    const { fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const params = {
        ...fieldsValue,
        taskBeginTime: moment(fieldsValue.taskBeginTime.valueOf()).format('YYYY-MM-DD'),
        taskEndTime: moment(fieldsValue.taskEndTime.valueOf()).format('YYYY-MM-DD'),
      };
      params.attachementIds = fileList.map(file => file.id).join(',');
      delete params.userId;
      if (record.id) {
        params.id = record.id;
      }
      const submitParam = {
        workOrder: params,
        workOrderId: params.id,
        closeOrSubmit: 'submit',
      };
      handleSubmit(submitParam);
    });
  };

  // 领导退单环节关闭工单
  closeSubmit = () => {
    const { handleSubmit, record } = this.props;
    const params = {
      workOrderId: record.id,
      workOrder: {
        id: record.id,
        workOrderNo: record.workOrderNo,
      },
      closeOrSubmit: 'close',
    };
    handleSubmit(params);
  };

  // 领导审核环节提交
  leaderAuditSubmit = () => {
    const { form, handleSubmit, record } = this.props;
    form.validateFields(['procResult', 'procAdvise'], (err, fieldsValue) => {
      if (err) {
        return;
      }
      const params = {
        workOrderId: record.id,
        audit: fieldsValue,
      };
      handleSubmit(params);
    });
  };

  // 保存人员工作评价
  addPersonEvaluate = () => {
    const { record } = this.props;
    const {
      workFinishQuality,
      workFinishSituation,
      workSatisfaction,
      evaluateDesc,
      workScore,
      currentEvaluatePerson,
      evaluateId,
    } = this.state;
    if (!currentEvaluatePerson) {
      Modal.info({
        title: '请选择被评价的人员',
      });
      return;
    }
    const params = {
      workFinishQuality,
      workFinishSituation,
      workSatisfaction,
      evaluateDesc,
      workScore,
      workOrderId: record.id,
      beEvaluatePerson: currentEvaluatePerson,
    };
    if (evaluateId) {
      params.id = evaluateId;
    }

    request(`/ecogrid/workEvaluate/addOrEdit`, {
      method: 'post',
      data: params,
    }).then(result => {
      this.setState({
        evaluateId: result.id,
      });
      message.info('评价成功');
    });
  };

  // 保存部门工作评价
  addDeptEvaluate = () => {
    const { record } = this.props;
    const {
      workFinishQuality,
      workFinishSituation,
      workSatisfaction,
      evaluateDesc,
      workScore,
      currentEvaluateDept,
      evaluateId,
    } = this.state;
    if (!currentEvaluateDept) {
      Modal.info({
        title: '请选择被评价的部门',
      });
      return;
    }
    const params = {
      workFinishQuality,
      workFinishSituation,
      workSatisfaction,
      evaluateDesc,
      workScore,
      workOrderId: record.id,
      beEvaluateDept: currentEvaluateDept,
    };
    if (evaluateId) {
      params.id = evaluateId;
    }
    request(`/ecogrid/workEvaluate/addOrEdit`, {
      method: 'post',
      data: params,
    }).then(result => {
      this.setState({
        evaluateId: result.id,
      });
      message.info('评价成功');
    });
  };

  // 获取人员评价详情
  queryPersonEvaluateDetail = userId => {
    this.setState({
      currentEvaluatePerson: userId,
    });
    const { record } = this.props;
    request(`/ecogrid/workEvaluate/getEvaluateByPersonId`, {
      method: 'post',
      data: {
        workOrderId: record.id,
        beEvaluatePerson: userId,
      },
    }).then(result => {
      this.setState({
        evaluateId: result.id,
        workFinishQuality: result.workFinishQuality,
        workFinishSituation: result.workFinishSituation,
        workSatisfaction: result.workSatisfaction,
        evaluateDesc: result.evaluateDesc,
        workScore: result.workScore,
      });
    });
  };

  queryOrgEvaluateDetail = orgId => {
    this.setState({
      currentEvaluateDept: orgId,
    });
    const { record } = this.props;
    request(`/ecogrid/workEvaluate/getEvaluateByDeptId`, {
      method: 'post',
      data: {
        workOrderId: record.id,
        beEvaluateDept: orgId,
      },
    }).then(result => {
      this.setState({
        evaluateId: result.id,
        workFinishQuality: result.workFinishQuality,
        workFinishSituation: result.workFinishSituation,
        workSatisfaction: result.workSatisfaction,
        evaluateDesc: result.evaluateDesc,
        workScore: result.workSatisfaction,
      });
    });
  };

  // 网格办审核环节提交
  wgbSubmit = () => {
    const { form, handleSubmit, record } = this.props;
    const { processUserList } = this.state;
    form.validateFields(
      ['procResult', 'title', 'acceptDepts', 'procAdvise'],
      (err, fieldsValue) => {
        if (err) {
          return;
        }
        const taskList = processUserList.map(user => {
          return {
            respPersonId: user.responsePersonId,
            respDept: user.respDeptId,
            respGrids: user.respGrids.join(','),
          };
        });

        const params = {
          workOrderId: record.id,
          audit: {
            title: fieldsValue.title,
            procResult: fieldsValue.procResult,
            procAdvise: fieldsValue.procAdvise,
            acceptDepts: fieldsValue.acceptDepts.join(','),
          },
          taskList,
        };
        handleSubmit(params);
      }
    );
  };

  // 网格办审核环节退单
  wgbSubmitTd = () => {
    const { form, handleSubmit, record } = this.props;
    form.validateFields(['procResult', 'procAdvise'], (err, fieldsValue) => {
      if (err) {
        return;
      }
      const params = {
        workOrderId: record.id,
        audit: {
          procResult: fieldsValue.procResult,
          procAdvise: fieldsValue.procAdvise,
        },
        taskList: [],
      };
      handleSubmit(params);
    });
  };

  // 网格中心审核环节提交
  wgzxSubmit = () => {
    const { form, handleSubmit, record } = this.props;
    const { processWorkerList } = this.state;
    form.validateFields(['procResult', 'title', 'procAdvise'], (err, fieldsValue) => {
      if (err) {
        return;
      }
      const taskList = processWorkerList.map(user => {
        return {
          respPersonId: user.userId,
          respGrids: user.selectedList.join(','),
        };
      });

      const params = {
        workOrderId: record.id,
        audit: {
          title: fieldsValue.title,
          procResult: fieldsValue.procResult,
          procAdvise: fieldsValue.procAdvise,
        },
        taskList,
      };
      handleSubmit(params);
    });
  };

  // 专职网格员环节提交
  zzwgySubmit = () => {
    const { form, handleSubmit, record } = this.props;
    form.validateFields(['procResult', 'procAdvise'], (err, fieldsValue) => {
      if (err) {
        return;
      }
      const params = {
        workOrderId: record.id,
        audit: fieldsValue,
      };
      handleSubmit(params);
    });
  };

  // 网格中心签收环节提交
  wgzxqsSubmit = () => {
    const { form, handleSubmit, record } = this.props;
    form.validateFields(['procResult', 'procAdvise'], (err, fieldsValue) => {
      if (err) {
        return;
      }
      const params = {
        workOrderId: record.id,
        audit: fieldsValue,
      };
      handleSubmit(params);
    });
  };

  cancelHandle = () => {
    this.setState({
      processUserList: [],
      fileList: [],
    });
    const { handleCancel } = this.props;
    handleCancel();
  };

  uploadChange = info => {
    let fileList = [...info.fileList];

    fileList = fileList.map(file => {
      const copyFile = file;
      if (file.response) {
        copyFile.id = file.response.data.id;
        copyFile.url = `/api/${file.response.data.url}`;
      }
      return copyFile;
    });
    this.setState({ fileList });
  };

  // 可修改详情
  renderDetailFormTD = () => {
    const {
      workOrderBaseInfo,
      form: { getFieldDecorator },
      workTaskTypeList,
      orgUserData,
    } = this.props;
    const { fileList } = this.state;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 48 }}>
          <Col md={24}>
            <FormItem label="标题">
              {getFieldDecorator('title', {
                initialValue: workOrderBaseInfo.title,
                rules: [
                  {
                    required: true,
                    message: '请填写标题',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8}>
            {getFieldDecorator('taskBeginDeptId', {
              initialValue: orgUserData ? orgUserData.parentOrg.orgId : '',
              rules: [{ required: true }],
            })(<Input type="hidden" />)}
            <FormItem label="任务发起人部门名称">
              {getFieldDecorator('deptName', {
                initialValue: orgUserData ? orgUserData.parentOrg.orgName : '',
                rules: [{ required: false }],
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col md={8}>
            {getFieldDecorator('taskDeptSectionId', {
              initialValue: orgUserData ? orgUserData.currentOrg.orgId : '',
              rules: [{ required: true }],
            })(<Input type="hidden" />)}
            <FormItem label="任务发起人子部门">
              {getFieldDecorator('sectionName', {
                initialValue: orgUserData ? orgUserData.currentOrg.orgName : '',
                rules: [{ required: false }],
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务发起人">
              {getFieldDecorator('userId', {
                initialValue: orgUserData ? orgUserData.userInfo.userName : '',
                rules: [{ required: false }],
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="联系电话">
              {getFieldDecorator('contractPhone', {
                initialValue: workOrderBaseInfo.contractPhone,
                rules: [
                  {
                    required: true,
                    message: '请填写联系电话',
                  },
                  {
                    message: '电话号码格式不正确',
                    pattern: /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="工单类型">
              {getFieldDecorator('taskType', {
                initialValue: workOrderBaseInfo.taskType ? +workOrderBaseInfo.taskType : null,
                rules: [
                  {
                    required: true,
                    message: '请选择工单类型',
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {workTaskTypeList.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.workType}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务发起时间">
              {getFieldDecorator('taskBeginTime', {
                initialValue: workOrderBaseInfo.taskBeginTime
                  ? moment(workOrderBaseInfo.taskBeginTime)
                  : null,
                rules: [
                  {
                    required: true,
                    message: '请选择任务发起时间',
                  },
                  {
                    validator: (rule, beginTime, cb) => {
                      const {
                        form: { getFieldsValue },
                      } = this.props;
                      const endTime = getFieldsValue(['taskEndTime']);
                      if (!beginTime || !endTime.taskEndTime) {
                        return cb();
                      }
                      if (endTime.taskEndTime.isBefore(beginTime)) {
                        return cb('发起时间必须小于结束时间');
                      }
                      return cb();
                    },
                  },
                ],
              })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务要求完成时间">
              {getFieldDecorator('taskEndTime', {
                initialValue: workOrderBaseInfo.taskEndTime
                  ? moment(workOrderBaseInfo.taskEndTime)
                  : null,
                rules: [
                  {
                    required: true,
                    message: '请选择任务要求完成时间',
                  },
                ],
              })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem label="工作内容">
              {getFieldDecorator('workContent', {
                initialValue: workOrderBaseInfo.workContent,
                rules: [
                  {
                    required: true,
                    message: '请填写工作内容',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem label="工作要求">
              {getFieldDecorator('workRequest', {
                initialValue: workOrderBaseInfo.workRequest,
                rules: [
                  {
                    required: true,
                    message: '请填写工作要求',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem label="任务完成提交形式">
              {getFieldDecorator('taskFinishType', {
                initialValue: workOrderBaseInfo.taskFinishType,
                rules: [
                  {
                    required: true,
                    message: '请填写任务完成提交形式',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24}>
            <Upload
              action="/api/ecogrid/file/upload"
              fileList={fileList}
              onChange={this.uploadChange}
            >
              <Button>
                <Icon type="upload" /> 上传
              </Button>
            </Upload>
          </Col>
        </Row>
      </Form>
    );
  };

  renderDetailForm = (record, attachmentList) => {
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 48 }}>
          <Col md={24}>
            <FormItem label="标题">
              <Input disabled defaultValue={record.title} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务发起人部门名称">
              <Input disabled defaultValue={record.deptName} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务发起人子部门">
              <Input disabled defaultValue={record.sectionName} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务发起人">
              <Input disabled defaultValue={record.createByName} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="联系电话">
              <Input disabled defaultValue={record.contractPhone} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="工单类型">
              <Input disabled defaultValue={record.workType} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务发起时间">
              <Input disabled defaultValue={record.taskBeginTime} />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="任务要求完成时间">
              <Input disabled defaultValue={record.taskEndTime} />
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem label="工作内容">
              <TextArea disabled rows={4} defaultValue={record.workContent} />
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem label="工作要求">
              <TextArea disabled rows={4} defaultValue={record.workRequest} />
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem label="任务完成提交形式">
              <TextArea disabled rows={4} defaultValue={record.taskFinishType} />
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
    );
  };

  // 专项网格员领导审核
  renderLeaderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form {...formItemLayout}>
        <FormItem label="处理结果">
          {getFieldDecorator('procResult', {
            initialValue: '1',
            rules: [{ required: true }],
          })(
            <Radio.Group>
              <Radio value="1">通过</Radio>
              <Radio value="0">不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="处理意见">
          {getFieldDecorator('procAdvise', {
            rules: [
              {
                required: true,
                message: '请填写处理意见',
              },
            ],
          })(<TextArea rows={5} />)}
        </FormItem>
      </Form>
    );
  };

  acceptDeptChange = orgIdList => {
    const processUserList = [];
    const promiseList = [];
    orgIdList.forEach(orgId => {
      const promise = request(`/ecogrid/audit/getDeptResponseInfo/${orgId}`).then(({ data }) => {
        processUserList.push({
          respGrids: _.map(data.gridList, 'gridId').map(grid => `${grid}`),
          respDeptId: data.respDeptId,
          respDeptName: data.respDeptName,
          responsePersonId: data.responsePersonId,
          responsePersonName: data.responsePersonName,
        });
      });
      promiseList.push(promise);
    });
    Promise.all(promiseList).then(() => {
      this.setState({
        processUserList,
      });
    });
  };

  wgbGridChange = (responsePersonId, value) => {
    const { processUserList } = this.state;
    processUserList.forEach(user => {
      const copyUser = user;
      if (user.responsePersonId === responsePersonId) {
        copyUser.respGrids = value;
      }
    });
    this.setState({
      processUserList,
    });
  };

  wgzxGridChange = (userId, value) => {
    const { processWorkerList } = this.state;
    processWorkerList.forEach(user => {
      const copyUser = user;
      if (user.userId === userId) {
        copyUser.selectedList = value;
      }
    });
    this.setState({
      processWorkerList,
    });
  };

  // 网格办派发工单
  renderWGBForm = () => {
    const {
      form: { getFieldDecorator },
      orgList,
      gridList,
    } = this.props;
    const { processUserList, checkSituation, isRequiredWGB } = this.state;
    const acceptDeptList = orgList.map(org => ({
      label: org.orgName,
      value: org.orgId,
    }));
    const columns = [
      {
        title: '责任人',
        dataIndex: 'responsePersonName',
      },
      {
        title: '责任部门',
        dataIndex: 'respDeptName',
      },
      {
        title: '责任区域',
        width: '50%',
        render: (text, record) => {
          return (
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择"
              value={record.respGrids}
              onChange={value => {
                this.wgbGridChange(record.responsePersonId, value);
              }}
            >
              {gridList.map(grid => {
                return <Select.Option key={grid.id}>{grid.gridName}</Select.Option>;
              })}
            </Select>
          );
        },
      },
      /* {
        title: '操作',
        width: 150,
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => this.openHandleModal(record)}>编辑</a>
              &nbsp;&nbsp;
              <a onClick={() => this.openHandleModal(record)}>保存</a>
              &nbsp;&nbsp;
              <a onClick={() => this.openHandleModal(record)}>取消</a>
            </Fragment>
          );
        }
      } */
    ];
    return (
      <Form {...formItemLayout} style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <FormItem label="处理结果">
          {getFieldDecorator('procResult', {
            initialValue: '1',
            rules: [{ required: true }],
          })(
            <Radio.Group onChange={this.checkWGB}>
              <Radio value="1">通过</Radio>
              <Radio value="0">不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem style={{ display: checkSituation }} label="标题">
          {getFieldDecorator('title', {
            rules: [{ required: isRequiredWGB }],
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: checkSituation }} label="接收部门">
          {getFieldDecorator('acceptDepts', {
            rules: [
              {
                required: isRequiredWGB,
                message: '请选择接收部门',
              },
            ],
          })(<Checkbox.Group options={acceptDeptList} onChange={this.acceptDeptChange} />)}
        </FormItem>
        <FormItem label="内容">
          {getFieldDecorator('procAdvise', {
            rules: [
              {
                required: true,
                message: '请填写内容',
              },
            ],
          })(<TextArea rows={5} />)}
        </FormItem>
        <FormItem style={{ display: checkSituation }} label="责任划分">
          <Table
            rowKey="responsePersonId"
            columns={columns}
            dataSource={processUserList}
            pagination={false}
          />
        </FormItem>
      </Form>
    );
  };

  checkWGB = radioId => {
    // const { checkSituation } = this.state;
    if (radioId.target.value === '0') {
      this.setState({
        checkSituation: 'none',
        isRequiredWGB: false,
      });
    } else {
      this.setState({
        checkSituation: 'block',
        isRequiredWGB: true,
      });
    }
  };

  removeWorker = userId => {
    const { processWorkerList } = this.state;
    processWorkerList.forEach((worker, index) => {
      if (worker.userId === userId) {
        processWorkerList.splice(index, 1);
      }
    });
    this.setState({
      processWorkerList,
    });
  };

  // 网格中心派发工单
  renderWGZXForm = () => {
    const {
      form: { getFieldDecorator },
      gridList,
    } = this.props;
    const { processWorkerList } = this.state;
    const treeData = gridList.map(grid => {
      return {
        title: grid.gridName,
        value: `${grid.id}`,
        children: grid.childList.map(childGrid => {
          return {
            title: childGrid.gridName,
            value: `${childGrid.id}`,
          };
        }),
      };
    });

    const treeProps = {
      treeData,
      treeCheckable: true,
    };
    const columns = [
      {
        title: '责任人',
        dataIndex: 'userName',
        width: 200,
      },
      {
        title: '责任区域',
        render: (text, record) => {
          return (
            <TreeSelect
              {...treeProps}
              value={record.selectedList}
              onChange={value => {
                this.wgzxGridChange(record.userId, value);
              }}
              dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
            />
          );
        },
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => this.removeWorker(record.userId)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return (
      <Form {...formItemLayout}>
        <FormItem style={{ display: 'none' }} label="处理结果">
          {getFieldDecorator('procResult', {
            initialValue: '1',
            rules: [{ required: true }],
          })(
            <Radio.Group>
              <Radio value="1">通过</Radio>
              <Radio value="0">不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }} label="标题">
          {getFieldDecorator('title', {
            // rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} label="内容">
          {getFieldDecorator('procAdvise', {
            rules: [
              {
                // required: true,
                message: '请填写内容',
              },
            ],
          })(<TextArea rows={5} />)}
        </FormItem>
        <FormItem label="责任划分">
          <Table
            rowKey="userId"
            columns={columns}
            dataSource={processWorkerList}
            pagination={false}
          />
        </FormItem>
      </Form>
    );
  };

  batchCheck = () => {
    const { selectedRowKeys, reportPagination, checkStatus } = this.state;
    const { dispatch, record, handleReportTableChange } = this.props;
    if (selectedRowKeys.length === 0) {
      Modal.info({
        title: '请选择要核实的企业',
      });
      return;
    }
    dispatch({
      type: 'todoTask/batchCheck',
      params: {
        workOrderId: record.id,
        reportIds: selectedRowKeys.join(','),
      },
    }).then(() => {
      message.info('核实成功');
      handleReportTableChange(reportPagination, checkStatus);
      // 核实后清空已选数据
      this.setState({
        selectedRowKeys: [],
      });
    });
  };

  batchCheckAll = () => {
    const { reportPagination, checkStatus } = this.state;
    const { dispatch, record, handleReportTableChange } = this.props;
    confirm({
      title: '确认',
      content: '确认核实所有企业吗?',
      onOk: () => {
        dispatch({
          type: 'todoTask/batchCheck',
          params: {
            workOrderId: record.id,
          },
        }).then(() => {
          message.info('核实成功');
          handleReportTableChange(reportPagination, checkStatus);
          // 核实后清空已选数据
          this.setState({
            selectedRowKeys: [],
          });
        });
      },
    });
  };

  cancelAddRemarksModal = () => {
    this.setState({
      addRemarksVisible: false,
    });
  };

  showAddRemarksModal = report => {
    this.setState({
      currentReport: report,
      addRemarksVisible: true,
    });
  };

  addRemarks = remarks => {
    const { currentReport, reportPagination, checkStatus } = this.state;
    const { dispatch, handleReportTableChange } = this.props;
    const params = {
      id: currentReport.id,
      remarks,
    };
    dispatch({
      type: 'todoTask/addRemarks',
      params,
    }).then(() => {
      message.info('添加备注成功');
      handleReportTableChange(reportPagination, checkStatus);
      this.cancelAddRemarksModal();
    });
  };

  checkStatusChange = e => {
    const checkStatus = e.target.value;
    const { handleReportTableChange } = this.props;
    const { reportPagination } = this.state;
    this.setState(
      {
        checkStatus,
        selectedRowKeys: [],
      },
      () => {
        handleReportTableChange(reportPagination, checkStatus);
      }
    );
  };

  // 专职网格员
  renderZZWGYForm = () => {
    const {
      reportList,
      handleReportTableChange,
      form: { getFieldDecorator },
    } = this.props;
    const { checkStatus, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: keys => {
        this.setState({
          selectedRowKeys: keys,
        });
      },
    };
    const columns = [
      {
        dataIndex: 'enterpriseName',
        title: '企业名称',
      },
      {
        dataIndex: 'checkStatus',
        title: '处理状态',
        width: 100,
      },
      // {
      //   dataIndex: 'gridName',
      //   title: '网格名称',
      // },
      // {
      //   dataIndex: 'reportStatus',
      //   title: '填报状态',
      // },
      {
        dataIndex: 'legalPerson',
        title: '企业信息员',
        width: 150,
      },
      {
        dataIndex: 'legalPhone',
        title: '联系方式',
        width: 150,
      },
      {
        dataIndex: 'remarks',
        title: '备注',
        width: 100,
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
          return (
            <Fragment>
              <a>详情</a>
              &nbsp;&nbsp;
              <a
                onClick={() => {
                  this.showAddRemarksModal(record);
                }}
              >
                备注
              </a>
              {/* &nbsp;&nbsp;
              <a>催报</a> */}
            </Fragment>
          );
        },
      },
    ];
    return (
      <Fragment>
        <Form {...formItemLayout}>
          <FormItem style={{ display: 'none' }} label="处理结果">
            {getFieldDecorator('procResult', {
              initialValue: '1',
              rules: [{ required: true }],
            })(
              <Radio.Group>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem style={{ display: 'none' }} label="处理意见">
            {getFieldDecorator('procAdvise', {
              rules: [
                {
                  // required: true,
                  message: '请填写内容',
                },
              ],
            })(<TextArea rows={5} />)}
          </FormItem>
        </Form>
        <Row>
          <Col md={12}>
            <Button type="primary" onClick={this.batchCheck}>
              批量核实
            </Button>
            &nbsp;&nbsp;
            {/* <Button type="primary" onClick={this.batchCheckAll}>
              核实所有
            </Button> */}
            {/* &nbsp;&nbsp;
            <Button type="primary">批量下载</Button>
            &nbsp;&nbsp;
            <Button type="primary">处理完成</Button> */}
          </Col>
          <Col md={12}>
            <Radio.Group onChange={this.checkStatusChange} value={checkStatus}>
              <Radio value="">全部</Radio>
              <Radio value="1">已处理</Radio>
              <Radio value="0">未处理</Radio>
            </Radio.Group>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={reportList.list}
          pagination={{ total: reportList.total, pageSize: reportList.pageSize }}
          rowSelection={rowSelection}
          scroll={{ x: 900 }}
          onChange={pagination => {
            this.setState({
              selectedRowKeys: [],
              reportPagination: {
                pageSize: pagination.pageSize,
                pageNum: pagination.current,
              },
            });
            handleReportTableChange(
              { pageSize: pagination.pageSize, pageNum: pagination.current },
              checkStatus
            );
          }}
        />
      </Fragment>
    );
  };

  // 网格中心签收
  renderWGZXQSForm = () => {
    const {
      form: { getFieldDecorator },
      wgzxReportList,
      evaluatePersonList,
      evaluateDict,
      handleZxwgyReportTableChange,
    } = this.props;
    const {
      workFinishSituation,
      workFinishQuality,
      workSatisfaction,
      evaluateDesc,
      workScore,
      currentEvaluatePerson,
    } = this.state;
    const columns = [
      // {
      //   dataIndex: 'gridName',
      //   title: '网格名称',
      // },
      {
        dataIndex: 'enterpriseName',
        // width:200,
        title: '企业名称',
      },
      {
        dataIndex: 'respPersonName',
        width: 200,
        title: '核实人',
      },
      {
        dataIndex: 'respPersonPhone',
        width: 200,
        title: '核实人联系方式',
      },
      // {
      //   dataIndex: 'checkStatus',
      //   title: '核实状态',
      // },
      // {
      //   dataIndex: 'reportStatus',
      //   title: '填报状态',
      // },

      // {
      //   dataIndex: 'checkDate',
      //   title: '核实时间',
      // },
      {
        title: '操作',
        width: 100,
        // fixed: 'right',
        render: () => {
          return (
            <Fragment>
              <a>详情</a>
            </Fragment>
          );
        },
      },
    ];
    return (
      <Fragment>
        <Table
          rowKey={(record, index) => index}
          columns={columns}
          title={() => '企业名录'}
          dataSource={wgzxReportList.list}
          pagination={{ total: wgzxReportList.total, pageSize: wgzxReportList.pageSize }}
          onChange={pagination => {
            handleZxwgyReportTableChange({
              pageSize: pagination.pageSize,
              pageNum: pagination.current,
            });
          }}
        />
        <Form {...formItemLayout}>
          <FormItem label="处理结果">
            {getFieldDecorator('procResult', {
              initialValue: '1',
              rules: [{ required: true }],
            })(
              <Radio.Group>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="处理意见">
            {getFieldDecorator('procAdvise', {
              rules: [
                {
                  required: true,
                  message: '请填写处理意见',
                },
              ],
            })(<TextArea rows={5} />)}
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
                  <Select
                    style={{ width: '80%' }}
                    placeholder="请选择"
                    value={workFinishSituation}
                    onChange={value => {
                      this.setState({
                        workFinishSituation: value,
                      });
                    }}
                  >
                    {evaluateDict.workFinishSituation.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>工作完成质量:&nbsp;</span>
                  <Select
                    style={{ width: '80%' }}
                    placeholder="请选择"
                    value={workFinishQuality}
                    onChange={value => {
                      this.setState({
                        workFinishQuality: value,
                      });
                    }}
                  >
                    {evaluateDict.workFinishQuality.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;满意度:&nbsp;
                  </span>
                  <Select
                    style={{ width: '80%' }}
                    placeholder="请选择"
                    value={workSatisfaction}
                    onChange={value => {
                      this.setState({
                        workSatisfaction: value,
                      });
                    }}
                  >
                    {evaluateDict.workSatisfaction.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价分数:&nbsp;</span>
                  <InputNumber
                    size="small"
                    min={0}
                    max={100}
                    value={workScore}
                    style={{ width: '80%' }}
                    onChange={value => {
                      this.setState({
                        workScore: value,
                      });
                    }}
                  />
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价描述:&nbsp;</span>
                  <TextArea
                    style={{ width: '80%' }}
                    rows={4}
                    value={evaluateDesc}
                    onChange={e => {
                      this.setState({
                        evaluateDesc: e.target.value,
                      });
                    }}
                  />
                </div>
                <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                  <Button type="primary" onClick={this.addPersonEvaluate}>
                    确定
                  </Button>
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
      zxwgyReportList,
      evaluateDeptList,
      evaluateDict,
      handleZxwgyReportTableChange,
    } = this.props;
    const {
      workFinishSituation,
      workFinishQuality,
      workSatisfaction,
      evaluateDesc,
      workScore,
      currentEvaluateDept,
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
          rowKey={(record, index) => index}
          columns={columns}
          title={() => '企业名录'}
          dataSource={zxwgyReportList.list}
          pagination={{ total: zxwgyReportList.total, pageSize: zxwgyReportList.pageSize }}
          scroll={{ x: 1000 }}
          onChange={pagination => {
            handleZxwgyReportTableChange({
              pageSize: pagination.pageSize,
              pageNum: pagination.current,
            });
          }}
        />
        <Form {...formItemLayout}>
          <FormItem label="处理结果">
            {getFieldDecorator('procResult', {
              initialValue: '1',
              rules: [{ required: true }],
            })(
              <Radio.Group>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="处理意见">
            {getFieldDecorator('procAdvise', {
              rules: [
                {
                  required: true,
                  message: '请填写处理意见',
                },
              ],
            })(<TextArea rows={5} />)}
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
                        this.queryOrgEvaluateDetail(item.orgId);
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
                  <Select
                    style={{ width: '80%' }}
                    placeholder="请选择"
                    value={workFinishSituation}
                    onChange={value => {
                      this.setState({
                        workFinishSituation: value,
                      });
                    }}
                  >
                    {evaluateDict.workFinishSituation.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>工作完成质量:&nbsp;</span>
                  <Select
                    style={{ width: '80%' }}
                    placeholder="请选择"
                    value={workFinishQuality}
                    onChange={value => {
                      this.setState({
                        workFinishQuality: value,
                      });
                    }}
                  >
                    {evaluateDict.workFinishQuality.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;满意度:&nbsp;
                  </span>
                  <Select
                    style={{ width: '80%' }}
                    placeholder="请选择"
                    value={workSatisfaction}
                    onChange={value => {
                      this.setState({
                        workSatisfaction: value,
                      });
                    }}
                  >
                    {evaluateDict.workSatisfaction.map(item => (
                      <Select.Option key={item.dict_value}>{item.dict_label}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价分数:&nbsp;</span>
                  <InputNumber
                    size="small"
                    min={0}
                    max={100}
                    style={{ width: '80%' }}
                    value={workScore}
                    onChange={value => {
                      this.setState({
                        workScore: value,
                      });
                    }}
                  />
                </div>
                <div>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价描述:&nbsp;</span>
                  <TextArea
                    style={{ width: '80%' }}
                    rows={4}
                    value={evaluateDesc}
                    onChange={e => {
                      this.setState({
                        evaluateDesc: e.target.value,
                      });
                    }}
                  />
                </div>
                <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                  <Button type="primary" onClick={this.addDeptEvaluate}>
                    确定
                  </Button>
                </div>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Fragment>
    );
  };

  // 非退单处理工单
  renderTabsDefult = () => {
    const {
      record,
      auditForm: { workOrderInfo, auditList },
    } = this.props;
    return (
      <Tabs defaultActiveKey="1" animated={false}>
        <TabPane tab="处理" key="1">
          {record.tacheCode === 'leader_audit' && this.renderLeaderForm()}
          {record.tacheCode === 'wgb' && this.renderWGBForm()}
          {record.tacheCode && record.tacheCode.startsWith('wgzx') && this.renderWGZXForm()}
          {record.tacheCode && record.tacheCode.startsWith('wgy') && this.renderZZWGYForm()}
          {record.tacheCode && record.tacheCode.startsWith('qs_wgzx') && this.renderWGZXQSForm()}
          {record.tacheCode && record.tacheCode.startsWith('qs_zxwgy') && this.renderZXWGYQSForm()}
        </TabPane>
        <TabPane tab="工单详情" key="2">
          {this.renderDetailForm(workOrderInfo.workOrderBaseInfo, workOrderInfo.attachmentList)}
        </TabPane>
        <TabPane tab="处理历史" key="3">
          <HistoryList historyList={auditList} />
        </TabPane>
      </Tabs>
    );
  };

  // 领导退单处理工单
  renderTabsWGY = () => {
    const {
      auditForm: { auditList },
    } = this.props;
    return (
      <Tabs defaultActiveKey="2" animated={false}>
        <TabPane tab="工单详情" key="2">
          {this.renderDetailFormTD()}
        </TabPane>
        <TabPane tab="处理历史" key="3">
          <HistoryList historyList={auditList} />
        </TabPane>
      </Tabs>
    );
  };

  render() {
    const {
      // modalVisible,
      record,
      // auditForm: { workOrderInfo, auditList },
    } = this.props;
    const { addRemarksVisible, currentReport } = this.state;
    const title = `处理-${record.title}`;
    const buttonDefult = (
      <div>
        <Button onClick={this.cancelHandle}>
          <span>取 消</span>
        </Button>
        {record.tacheCode && record.tacheCode.startsWith('td_from') && (
          <Button onClick={this.closeSubmit}>
            <span>关闭工单</span>
          </Button>
        )}
        <Button type="primary" onClick={this.okHandle}>
          <span>提 交</span>
        </Button>
      </div>
    );
    return (
      <Modal
        className={styles.todoTask}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title={title}
        footer={buttonDefult}
        visible
        // visible={modalVisible}
        // onOk={this.okHandle}
        onCancel={this.cancelHandle}
        // okText="提交"
        width="60vw"
        bodyStyle={{ maxHeight: '60vh', overflowY: 'scroll' }}
      >
        {record.tacheCode && record.tacheCode.startsWith('td_from') && this.renderTabsWGY()}
        {record.tacheCode && !record.tacheCode.startsWith('td_from') && this.renderTabsDefult()}
        {addRemarksVisible && (
          <AddRemarksModal
            cancelAddRemarksModal={this.cancelAddRemarksModal}
            handleAddRemarks={this.addRemarks}
            remarks={currentReport.remarks}
          />
        )}
      </Modal>
    );
  }
}

export default HandleTaskModal;
