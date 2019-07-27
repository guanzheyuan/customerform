import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TodoList from './components/TodoList';

class TodoTask extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeaderWrapper title="待处理">
        <Card bordered={false}>
          <TodoList />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TodoTask;
