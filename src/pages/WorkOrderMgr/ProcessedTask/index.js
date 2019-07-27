import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProcessedList from './components/ProcessedList';

class ProcessedTask extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeaderWrapper title="已处理">
        <Card bordered={false}>
          <ProcessedList />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessedTask;
