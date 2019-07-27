import React, { Component } from 'react';
import { Modal } from 'antd';
import AddSteps from './AddSteps';

class AddCompanyLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancle = () => {
    const { handleAdd } = this.props;
    handleAdd();
  };

  render() {
    const {
      modelVisible,
      labelTitle,
      labelType,
      labelData,
      pageNumCount,
      handleAdd,
      updatafreq,
      paramList,
    } = this.props;
    const addStepsProps = {
      labelType,
      labelData,
      pageNumCount,
      handleAdd,
      updatafreq,
      paramList,
    };
    return (
      <div>
        <Modal
          visible={modelVisible}
          title={labelTitle}
          width={985}
          onCancel={this.handleCancle}
          footer={null}
        >
          <AddSteps {...addStepsProps} />
        </Modal>
      </div>
    );
  }
}
export default AddCompanyLabel;
