/* eslint-disable no-restricted-syntax */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, List, Tag, Icon, Row, Col, Button, Input } from 'antd';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardFormRow from '@/components/StandardFormRow';
import TagSelect from '@/components/TagSelect';
import { FormattedMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;
const pageSize = 5;
let currentNum = 0;

const mapDispatchToProps = dispatch => {
  return {
    querySearchtype: () => {
      dispatch({
        type: 'inquiry/querySearchtype',
      });
    },
    queryLablelist: () => {
      dispatch({
        type: 'inquiry/queryLablelist',
      });
    },
    queryEnterprise: (pageNum, searchParam) => {
      dispatch({
        type: 'inquiry/queryEnterprise',
        payload: { pageNum, pageSize, searchParam },
      });
    },
  };
};

@Form.create()
@connect(
  ({ inquiry }) => ({ inquiry }),
  mapDispatchToProps
)
class Inquiry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { querySearchtype, queryLablelist } = this.props;
    querySearchtype();
    queryLablelist();
    this.handleSearch();
  }

  handleSelected = () => {
    setTimeout(this.handleSearch, 100);
  };

  handleSearch = () => {
    const { form, queryEnterprise } = this.props;
    const exactDynSearchIds = {};
    currentNum = 0;

    form.validateFields((err, fieldsValue) => {
      for (const key in fieldsValue) {
        if (
          key.indexOf('type') > -1 &&
          typeof fieldsValue[key] !== 'undefined' &&
          fieldsValue[key].length > 0
        ) {
          const name = key.substr(4);
          exactDynSearchIds[name] = fieldsValue[key];
        }
      }
      const param = {
        searchParam: fieldsValue.name,
        exactDynSearchIds,
        exactLabelSearchIds: fieldsValue.label,
      };
      queryEnterprise(currentNum, param);
    });
  };

  fetchMore = () => {
    const { form, queryEnterprise } = this.props;
    currentNum = Number(currentNum) + 1;
    form.validateFields((err, fieldsValue) => {
      const param = {
        searchParam: fieldsValue.name,
        exactDynSearchIds: {},
        exactLabelSearchIds: fieldsValue.label,
      };
      queryEnterprise(currentNum, param);
    });
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.handleSearch();
  };

  renderSearchList() {
    const {
      form: { getFieldDecorator },
      inquiry: { searchTypeList, labelList },
    } = this.props;

    const actionsTextMap = {
      expandText: <FormattedMessage id="component.tagSelect.expand" defaultMessage="Expand" />,
      collapseText: (
        <FormattedMessage id="component.tagSelect.collapse" defaultMessage="Collapse" />
      ),
      selectAllText: <FormattedMessage id="component.tagSelect.all" defaultMessage="All" />,
    };
    const list = searchTypeList.map(searchItem => (
      <StandardFormRow
        key={searchItem.typeId}
        title={searchItem.typeName}
        block
        style={{ paddingBottom: 11 }}
      >
        <FormItem>
          {getFieldDecorator(`type${searchItem.typeId}`)(
            <TagSelect expandable actionsText={actionsTextMap} onChange={this.handleSelected}>
              {searchItem.dictData.map(item => (
                <TagSelect.Option key={item.dictCode} value={item.dictCode}>
                  {item.treeNames}
                </TagSelect.Option>
              ))}
            </TagSelect>
          )}
        </FormItem>
      </StandardFormRow>
    ));
    const labelSearch = labelList.map(item => (
      <TagSelect.Option key={item.id} value={item.id} onChange={this.handleSelected}>
        {item.labelName}
      </TagSelect.Option>
    ));
    return (
      <Fragment>
        {list}
        <StandardFormRow title="企业标签" block style={{ paddingBottom: 11 }}>
          <FormItem>
            {getFieldDecorator('label')(
              <TagSelect expandable actionsText={actionsTextMap} onChange={this.handleSelected}>
                {labelSearch}
              </TagSelect>
            )}
          </FormItem>
        </StandardFormRow>
      </Fragment>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <Row>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="">
              {getFieldDecorator('name')(
                <Input placeholder="企业名称/统一社会信用代码/法人名称" />
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            &nbsp;&nbsp;
            <Button onClick={this.resetForm}>重置</Button>
            &nbsp;&nbsp;
            <Button>下载查询结果</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      inquiry: { enterpriseList },
    } = this.props;

    const loadMore =
      enterpriseList.total > enterpriseList.list.length ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    return (
      <PageHeaderWrapper title="企业档案">
        <Fragment>
          <Card bordered={false}>
            <div>{this.renderAdvancedForm()}</div>
            <Form layout="inline">{this.renderSearchList()}</Form>
            <List
              size="large"
              loading={enterpriseList.list.length === 0 ? loading : false}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={enterpriseList.list}
              renderItem={item => (
                <List.Item key={item.id} actions={[]} extra={<div />}>
                  <List.Item.Meta
                    title={
                      <Link to={{ pathname: '/company/portrait', state: { data: item.id } }}>
                        {item.enterprise_name}
                      </Link>
                    }
                    description={
                      <span>
                        {item.label_names.map(labelItem => (
                          <Tag key={labelItem.id}>{labelItem.labelName}</Tag>
                        ))}
                      </span>
                    }
                  />
                  <Row>
                    {item.single_datas.map(data => (
                      <Col
                        key={data.id}
                        span={(Number(data.content_grid_col) + Number(data.label_grid_col)) * 2}
                      >
                        {data.label_cname}：{data.label_value}
                      </Col>
                    ))}
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default Inquiry;
