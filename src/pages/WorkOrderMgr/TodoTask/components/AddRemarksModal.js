import React, { Component } from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

class AddRemarksModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remarks: props.remarks,
    };
  }

  handleOk = () => {
    const { handleAddRemarks } = this.props;
    const { remarks } = this.state;
    if (!remarks) {
      Modal.info({
        title: '请填写备注',
      });
      return;
    }
    handleAddRemarks(remarks);
  };

  remarksOnChange = e => {
    this.setState({
      remarks: e.target.value,
    });
  };

  render() {
    const { cancelAddRemarksModal } = this.props;
    const { remarks } = this.state;
    return (
      <Modal
        title="添加备注"
        visible
        onOk={this.handleOk}
        onCancel={cancelAddRemarksModal}
        okText="提交"
        cancelText="取消"
      >
        <TextArea onChange={this.remarksOnChange} rows={4} value={remarks} />
      </Modal>
    );
  }
}

export default AddRemarksModal;
