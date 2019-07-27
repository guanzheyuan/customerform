import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Form, Card, Row, Col, Input, List, Radio } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './style.less';

const FormItem = Form.Item;
const searchImg = require('../../../assets/search.png');

@Form.create()
@connect(({ information, loading }) => ({
  information,
  loading: loading.effects['information/fetchInformation'],
}))
class CompanyInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 0,
      pageSize: 10,
      status: -1,
    };
  }

  componentDidMount() {
    const { pageNum, pageSize } = this.state;
    this.fetch(pageNum, pageSize);
  }

  fetch = (pageNum, pageSize) => {
    const { dispatch, form } = this.props;
    const result = form.getFieldsValue();
    const { status } = this.state;
    let payload;
    if (status === '-1') {
      payload = {
        page: { pageNum, pageSize },
        ...result,
      };
    } else {
      payload = {
        page: { pageNum, pageSize },
        ...result,
      };
    }
    dispatch({
      type: 'information/fetchInformation',
      payload,
    });
  };

  handleChange = page => {
    const { pageSize } = this.state;
    const currPagenNum = page - 1;
    this.fetch(currPagenNum, pageSize);
    this.setState({
      pageNum: currPagenNum,
    });
  };

  handleModeChange = e => {
    const { pageSize } = this.state;
    this.setState({
      status: e.target.value,
    });
    this.fetch(0, pageSize);
    this.setState({ pageNum: 0 });
  };

  handleSearch = () => {
    const { pageSize } = this.state;
    this.fetch(0, pageSize);
    this.setState({ pageNum: 0 });
  };

  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <Row>
          <Col lg={8} md={8} sm={24}>
            <span className={styles.titleName}>任务列表</span>
          </Col>
          <Col lg={8} md={8} sm={24} style={{ textAlign: 'right' }}>
            <FormItem>
              <Radio.Group
                onChange={this.handleModeChange}
                defaultValue="-1"
                style={{ marginBottom: 8, marginRight: 8 }}
                name="status"
              >
                <Radio.Button value="-1">全部</Radio.Button>
                <Radio.Button value="1">已提交</Radio.Button>
                <Radio.Button value="0">未提交</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Col>
          <Col lg={8} md={8} sm={24}>
            <FormItem>
              <div style={{ position: 'relative' }}>
                {getFieldDecorator('conditionOfName')(
                  <Input placeholder="请输入" style={{ paddingLeft: 8 }} />
                )}
                <img
                  alt="搜索"
                  className={styles.searchIcon}
                  src={searchImg}
                  onClick={this.handleSearch}
                />
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  setStatus = (status, id) => {
    switch (status) {
      case '0':
        return <Link to={{ pathname: '/company/fillinfo', state: { data: id } }}>编辑</Link>;
      case '1':
        return <Link to={{ pathname: '/company/showinfo', state: { data: id } }}>详情</Link>;
      default:
        return <Link to={{ pathname: '/company/showinfo', state: { data: id } }}>详情</Link>;
    }
  };

  render() {
    const {
      information: { informationList },
    } = this.props;

    const { pageNum } = this.state;
    const paginationProps = {
      defaultCurrent: 1,
      current: pageNum + 1,
      total: informationList.total,
      onChange: this.handleChange,
    };

    return (
      <PageHeaderWrapper title="企业信息申报">
        <Fragment>
          <Card bordered={false}>
            <div>{this.renderAdvancedForm()}</div>
            <List
              size="large"
              rowKey="id"
              pagination={paginationProps}
              dataSource={informationList.list}
              renderItem={item => (
                <List.Item actions={[<Fragment>{this.setStatus(item.status, item.id)}</Fragment>]}>
                  <List.Item.Meta
                    title={<span className={styles.header}>标题名称</span>}
                    description={item.taskName}
                  />
                  <List.Item.Meta
                    title={<span className={styles.header}>网格员</span>}
                    description={item.gridAdmin}
                  />
                  <List.Item.Meta
                    title={<span className={styles.header}>联系方式</span>}
                    description={item.gridAdminPhone}
                  />
                  <List.Item.Meta
                    title={<span className={styles.header}>任务剩余天数</span>}
                    description={(() => {
                      if (item.lastDay <= 3) {
                        return (
                          <div className={styles.exDiv1}>
                            <span className={styles.redCircle} />
                            <span>{item.lastDay}天</span>
                          </div>
                        );
                      }
                      if (item.expiredBy <= 7) {
                        return (
                          <div className={styles.exDiv2}>
                            <span className={styles.yellowCircle} />
                            <span>{item.lastDay}天</span>
                          </div>
                        );
                      }
                      return (
                        <div className={styles.exDiv3}>
                          <span className={styles.dotCircle} />
                          <span>{item.lastDay}天</span>
                        </div>
                      );
                    })()}
                  />
                  <List.Item.Meta
                    title={<span className={styles.header}>填报状态</span>}
                    description={(() => {
                      switch (item.status) {
                        case '0':
                          return (
                            <div className={styles.sDiv1}>
                              <span className={styles.dotCircle} />
                              <span>未提交</span>
                            </div>
                          );
                        case '1':
                          return (
                            <div className={styles.sDiv2}>
                              <span className={styles.greenCircle} />
                              <span>已提交</span>
                            </div>
                          );
                        case '2':
                          return (
                            <div className={styles.sDiv3}>
                              <span className={styles.dotCircle} />
                              <span>已填报</span>
                            </div>
                          );
                        default:
                          return <div className={styles.sDiv1} />;
                      }
                    })()}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default CompanyInformation;
