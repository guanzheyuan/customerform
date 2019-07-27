/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const mapDispatchToProps = dispatch => {
  return {
    getEditTask: id => {
      dispatch({
        type: 'companyinfo/getEditTask',
        payload: { id },
      });
    },
  };
};

@Form.create()
@connect(
  ({ companyinfo }) => ({ companyinfo }),
  mapDispatchToProps
)
class ShowCompanyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      getEditTask,
      location: {
        state: { data },
      },
    } = this.props;
    getEditTask(data);
  }

  backFunction = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  switchItem = item => {
    const { eleType } = item;
    switch (eleType.toLowerCase()) {
      case 'int':
        return item.value;
      case 'input':
        return item.value;
      case 'datepicker':
        return item.value;
      case 'select':
        return item.content;
      default:
        return item.value;
    }
  };

  render() {
    const {
      companyinfo: { editTask },
    } = this.props;
    return (
      <PageHeaderWrapper title={editTask.formName} backFunction={this.backFunction} backBtnShow>
        <Card>
          <Row>
            {editTask.formElements.map((item, index) => (
              <Fragment key={index}>
                <Col
                  span={Number(item.labelGridCol) * 2}
                  style={{ fontWeight: 'bold', marginBottom: 5 }}
                >
                  {item.label}:
                </Col>
                <Col span={Number(item.contentGridCol) * 2} style={{ marginBottom: 5 }}>
                  {this.switchItem(item)}
                </Col>
              </Fragment>
            ))}
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ShowCompanyInfo;
