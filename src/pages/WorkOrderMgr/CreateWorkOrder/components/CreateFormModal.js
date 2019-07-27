import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Modal, Form, Input, Row, Col, Select, DatePicker, Upload, Button, Icon } from 'antd';

const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class CreateFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  saveHandle = () => {
    const { form, handleSave } = this.props;
    const fieldsValue = form.getFieldsValue();
    const { fileList } = this.state;
    const params = {
      ...fieldsValue,
    };
    if (fieldsValue.taskBeginTime) {
      params.taskBeginTime = moment(fieldsValue.taskBeginTime.valueOf()).format('YYYY-MM-DD');
    }
    if (fieldsValue.taskEndTime) {
      params.taskEndTime = moment(fieldsValue.taskEndTime.valueOf()).format('YYYY-MM-DD');
    }
    params.attachementIds = fileList.map(file => file.id).join(',');
    // delete params.userId;
    handleSave(params);
  };

  okHandle = () => {
    const { form, handleSubmit } = this.props;
    const { fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      confirm({
        title: '确认',
        content: '确认提交?',
        onOk: () => {
          form.resetFields();
          const params = {
            ...fieldsValue,
            taskBeginTime: moment(fieldsValue.taskBeginTime.valueOf()).format('YYYY-MM-DD'),
            taskEndTime: moment(fieldsValue.taskEndTime.valueOf()).format('YYYY-MM-DD'),
          };
          params.attachementIds = fileList.map(file => file.response.data.id).join(',');
          delete params.userId;
          handleSubmit(params);
        },
      });
    });
  };

  cancelHandle = () => {
    this.setState({
      fileList: [],
    });
    const { hideAddFormModal } = this.props;
    hideAddFormModal();
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

  checkAccount = (rule, value, callback) => {
    // const { form } = this.props;
    const regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
    if (value) {
      if (regex.test(value)) {
        callback();
      } else {
        callback('请输入正确的手机号码！');
      }
    } else {
      // 这里的callback函数会报错
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      workTaskTypeList,
      orgUserData,
    } = this.props;
    const { fileList } = this.state;
    let buttonList = null;
    buttonList = (
      <Fragment>
        <Button onClick={this.cancelHandle}>取消</Button>
        <Button type="primary" onClick={this.saveHandle}>
          保存草稿
        </Button>
        <Button type="primary" onClick={this.okHandle}>
          提交
        </Button>
      </Fragment>
    );

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title="新建工单"
        visible
        width="60vw"
        centered
        onCancel={this.cancelHandle}
        footer={buttonList}
        bodyStyle={{ maxHeight: '60vh', overflowY: 'scroll' }}
      >
        <Form layout="vertical">
          <Row gutter={{ md: 48 }}>
            <Col md={24}>
              <FormItem label="标题">
                {getFieldDecorator('title', {
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
                  initialValue: orgUserData ? orgUserData.userInfo.phone : '',
                  rules: [
                    {
                      required: true,
                      message: '请填写联系电话',
                    },
                    {
                      message: '联系电话格式不正确',
                      pattern: /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/,
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={8}>
              <FormItem label="工单类型">
                {getFieldDecorator('taskType', {
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
                  initialValue: moment(),
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
                  rules: [
                    {
                      required: true,
                      message: '请选择任务要求完成时间',
                    },
                    /* {
                      validator: (rule, endTime, cb) => {
                        const {
                          form: { getFieldsValue },
                        } = this.props;
                        const beginTime = getFieldsValue(['taskBeginTime']);
                        if (!endTime || !beginTime.taskEndTime) {
                          return cb();
                        }
                        if (beginTime.taskBeginTime.isAfter(endTime)) {
                          return cb('发起时间必须小于结束时间');
                        }
                        return cb();
                      },
                    }, */
                  ],
                })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={24}>
              <FormItem label="工作内容">
                {getFieldDecorator('workContent', {
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
      </Modal>
    );
  }
}

export default CreateFormModal;
