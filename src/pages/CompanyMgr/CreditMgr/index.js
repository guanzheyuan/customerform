import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Row, Col, Input, Button } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const mapDispatchToProps = dispatch => {
  return {
    queryCreditList: (pageNum, pageSize, searchParam) => {
      dispatch({
        type: 'creditMgr/queryCreditList',
        payload: { pageNum, pageSize, searchParam },
      });
    },
  };
};
const pageSize = 10;

@Form.create()
@connect(
  ({ creditMgr }) => ({ creditMgr }),
  mapDispatchToProps
)
class CreditMgr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = () => {
    const { form, queryCreditList } = this.props;
    form.validateFields((err, fieldsValue) => {
      const searchParam = {
        searchParam: typeof fieldsValue.name === 'undefined' ? '' : fieldsValue.name,
      };
      queryCreditList(0, pageSize, searchParam);
    });
  };

  onChange = pageNumber => {
    const { form, queryCreditList } = this.props;
    form.validateFields((err, fieldsValue) => {
      const searchParam = {
        searchParam: typeof fieldsValue.name === 'undefined' ? '' : fieldsValue.name,
      };
      queryCreditList(pageNumber.current - 1, pageNumber.pageSize, searchParam);
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <Row>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="">
              {getFieldDecorator('name')(<Input placeholder="企业名称/统一社会信用代码" />)}
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            &nbsp;&nbsp;
            <Button>下载企业信用名单</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      creditMgr: { creditList },
    } = this.props;

    const columns = [
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'unitSocialCreditCode',
        key: 'unitSocialCreditCode',
      },
      {
        title: '企业信用等级',
        dataIndex: 'enterpriseLevel',
        key: 'enterpriseLevel',
      },
      {
        title: '是否有行政处罚记录',
        dataIndex: 'hasPunishRecord',
        key: 'hasPunishRecord',
      },
      {
        title: '是否有司法处置记录',
        dataIndex: 'hasLawPunishRecord',
        key: 'hasLawPunishRecord',
      },
    ];
    return (
      <PageHeaderWrapper title="企业信用">
        <Card bordered={false}>
          <div>{this.renderAdvancedForm()}</div>
          <Table
            dataSource={creditList.list}
            rowKey={record => record.id}
            columns={columns}
            pagination={{
              pageSize,
              currentPage: creditList.pageNum,
              total: creditList.total,
            }}
            onChange={this.onChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreditMgr;
