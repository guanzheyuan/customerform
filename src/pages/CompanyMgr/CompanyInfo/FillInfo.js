/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Button, message } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormElement from './components/FormElement';

const mapDispatchToProps = dispatch => {
  return {
    getTaskFormInfoById: param => {
      dispatch({
        type: 'companyinfo/getTaskFormInfoById',
        payload: { param },
      });
    },
    getEditTask: id => {
      dispatch({
        type: 'companyinfo/getEditTask',
        payload: { id },
      });
    },
    saveFormInfo: (param, callback) => {
      dispatch({
        type: 'companyinfo/saveFormInfo',
        payload: { param },
        callback: data => {
          callback(data);
        },
      });
    },
  };
};

@Form.create()
@connect(
  ({ companyinfo }) => ({ companyinfo }),
  mapDispatchToProps
)
class FillInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getEditTask } = this.props;
    const {
      location: {
        state: { data },
      },
    } = this.props;
    getEditTask(data);
  }

  /** 保存提交 */
  saveForm = e => {
    e.preventDefault();
    const {
      form,
      companyinfo: { editTask },
      saveFormInfo,
      location: {
        state: { data },
      },
    } = this.props;
    const formInfo = editTask;
    form.validateFields((err, fieldsValue) => {
      formInfo.formElements.map((item, index) => {
        formInfo.formElements[index].value = fieldsValue[item.name];
      });
    });
    const postParam = { formInfo, id: data };
    saveFormInfo(postParam, respdata => {
      if (respdata.success) {
        message.info(respdata.msg);
      } else {
        message.warn(respdata.msg);
      }
    });
  };

  resetForm = e => {
    e.preventDefault();
    const { form } = this.props;
    form.resetFields();
  };

  backFunction = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  render() {
    const {
      companyinfo: { editTask },
    } = this.props;
    return (
      <PageHeaderWrapper title={editTask.formName} backFunction={this.backFunction} backBtnShow>
        <Card>
          <Form>
            <Row>
              {editTask.formElements.map((item, index) => (
                <FormElement key={index} {...this.props} item={item} />
              ))}
            </Row>
            <Row style={{ textAlign: 'center', marginTop: 40 }}>
              <Button onClick={this.resetForm}>重置</Button>&nbsp;&nbsp;
              <Button type="primary" onClick={this.saveForm}>
                草稿
              </Button>
              &nbsp;&nbsp;
              <Button type="primary" onClick={this.saveForm}>
                保存
              </Button>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default FillInfo;
