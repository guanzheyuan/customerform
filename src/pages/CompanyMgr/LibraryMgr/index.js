import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Form, Card, Row, Col, Button, Input, Dropdown, Menu, Icon, List, Modal } from 'antd';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Library.less';

const FormItem = Form.Item;
const pageSize = 10;

const mapDispatchToProps = dispatch => {
  return {
    queryLibrarylist: (pageNum, searchParam) => {
      dispatch({
        type: 'library/queryLibrarylist',
        payload: { pageNum, pageSize, searchParam },
      });
    },
  };
};

@Form.create()
@connect(
  ({ library }) => ({ library }),
  mapDispatchToProps
)
class LibraryMgr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = () => {
    const { form, queryLibrarylist } = this.props;
    form.validateFields((err, fieldsValue) => {
      const searchParam = typeof fieldsValue.name === 'undefined' ? '' : fieldsValue.name;
      queryLibrarylist(0, searchParam);
    });
  };

  handleChange = pageNum => {
    const { form, queryLibrarylist } = this.props;
    form.validateFields((err, fieldsValue) => {
      const searchParam = typeof fieldsValue.name === 'undefined' ? '' : fieldsValue.name;
      queryLibrarylist(pageNum, searchParam);
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
              {getFieldDecorator('name')(
                <Input placeholder="企业名称/统一社会信用代码/法人名称" />
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24} style={{ textAlign: 'right' }}>
            <Button className={styles.advancedBtn} type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button className={styles.advancedBtn}>导入企业</Button>
            <Button className={styles.advancedBtn}>导入网格员</Button>
            <Button>导出更新变化内容</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      library: { libraryList },
    } = this.props;
    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="relation">关联企业</Menu.Item>
            <Menu.Item key="unrelation">解除关联</Menu.Item>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const ListContent = ({ data: { phone, email, address } }) => (
      <Row>
        <Col lg={8} md={8} sm={24}>
          联系方式：{phone}
        </Col>
        <Col lg={8} md={8} sm={24}>
          邮箱： {email}
        </Col>
        <Col lg={8} md={8} sm={24}>
          地址： {address}
        </Col>
      </Row>
    );

    const paginationProps = {
      pageSize,
      total: libraryList.total,
      onChange: page => {
        this.handleChange(page - 1);
      },
    };

    return (
      <PageHeaderWrapper title="企业库更新权限">
        <Fragment>
          <Card bordered={false}>
            <div>{this.renderAdvancedForm()}</div>
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              pagination={paginationProps}
              dataSource={libraryList.list}
              renderItem={item => (
                <List.Item actions={[<a>编辑</a>, <MoreBtn current={item} />]}>
                  <div className={styles.listContent}>
                    <Row>
                      <div className={styles.listTitle}>{item.enterpriseName}</div>
                      <Link to={{ pathname: '/company/portrait', state: { data: item.id } }}>
                        查看详情
                      </Link>
                    </Row>
                    <ListContent data={item} />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default LibraryMgr;
