import React, { Component, Fragment } from 'react';
import { Button, Steps, Divider } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import Steps1 from './Steps1';
import Steps2 from './Steps2';
import Steps3 from './Steps3';
import Steps4 from './Steps4';

const { Step } = Steps;

const steps = [
  {
    title: '填写标签信息',
  },
  {
    title: '标签规则设置',
  },
  {
    title: '手动添加企业',
  },
  {
    title: '提交',
  },
];

@connect(({ labelMgr, loading }) => ({
  labelMgr,
  loading: loading.effects['labelMgr/saveLabelData'],
}))
class AddCompanyLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      firstSteps: [],
      SecondSteps: [],
      thirdSteps: [],
      nextCurrent: '',
      targetContent: [],
      mockData: [],
      targetKeys: [],
      ruleId: '',
      labelId: '',
      ruleType: '',
      editRuleResult: [],
      editRuleResultContent: [],
      editRuleResultContentText: '',
      // nextStep:true,
      saveRuleDataText: '',
      saveRuleDataList: [],
    };
  }

  firstChild = ref => {
    this.child = ref;
  };

  handleSubmit = e => {
    const { dispatch, pageNumCount, handleAdd, labelData } = this.props;
    const { labelId } = this.state;
    let listStatus = '';
    if (labelData.labelStatus === '0') {
      listStatus = 0;
    } else {
      listStatus = 1;
    }
    e.preventDefault();
    if (labelId) {
      dispatch({
        type: 'labelMgr/updateStatusChange',
        payload: {
          labelId,
          labelStatus: listStatus,
        },
        callback: () => {
          dispatch({
            type: 'labelMgr/queryLabelList',
            payload: {
              pageNum: pageNumCount,
              pageSize: 10,
            },
          });
        },
      });
    }
    handleAdd();
  };

  getMock = () => {
    const {
      labelMgr: { qyLeftList, qyRightList },
    } = this.props;
    this.setState({
      targetContent: qyRightList.list,
    });
    const newData = qyLeftList.list.concat(qyRightList.list);
    const targetKeys = [];
    const mockData = [];
    qyRightList.list.forEach(item => {
      targetKeys.push(item.id);
    });
    newData.forEach(item => {
      const data = {
        key: item.id,
        content: item.enterpriseName,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    });
    this.setState({ mockData, targetKeys });
  };

  next() {
    const { current } = this.state;
    const { labelType, dispatch, pageNumCount, labelData } = this.props;
    if (current === 0) {
      const firstData = this.child.nextStep();
      if (firstData === false) {
        return;
      }
      this.setState({
        firstSteps: firstData,
      });

      if (labelType === 'edit') {
        dispatch({
          type: 'labelMgr/queryEditRule',
          payload: {
            id: labelData.id,
          },
          callback: result => {
            this.setState({
              editRuleResult: result.data,
              editRuleResultContent: result.data.ruleContentList,
              editRuleResultContentText: result.data.ruleContentText,
            });
          },
        });
      }
      const setCurrent = current + 1;
      this.setState({ current: setCurrent });
    } else if (current === 1) {
      const secondData = this.child.nextStep2();
      if (secondData === false) {
        return;
      }
      secondData.then(() => {
        const subData = this.child.getData();
        if (!subData.flag) {
          return;
        }
        console.log('222');
        this.setState({
          SecondSteps: subData,
        });
        const {
          firstSteps,
          editRuleResultContentText,
          editRuleResultContent,
          saveRuleDataText,
          saveRuleDataList,
          ruleType,
          ruleId,
          labelId,
        } = this.state;
        if (labelType === 'new') {
          const newArray = {
            id: labelId,
            labelName: firstSteps.labelName,
            labelStartDate: firstSteps.labelStartDate,
            labelEndDate: firstSteps.labelEndDate,
            updateFreq: firstSteps.updateFreq,
            labelDescribe: firstSteps.labelDescribe,
          };
          if (ruleType === 'add' || ruleType === 'upd') {
            dispatch({
              type: 'labelMgr/editQyLabelAndRule',
              payload: {
                params: {
                  emLabelDo: newArray,
                  id: ruleId,
                  labelId,
                  operatorRegions: subData.operatorRegions,
                  ruleContentText:
                    subData.textAreaValue === '' ? saveRuleDataText : subData.textAreaValue,
                  ruleContentList:
                    subData.qyRuleList.length === 0 ? saveRuleDataList : subData.qyRuleList,
                },
              },
              callback: data => {
                this.setState({
                  ruleId: data.labelRuleId,
                  labelId: data.labelId,
                  ruleType: data.operType,
                });
                dispatch({
                  type: 'labelMgr/queryQyLeftList',
                  payload: {
                    labelId: data.labelId,
                    pageNum: 0,
                    pageSize: 10,
                  },
                  callback: () => {
                    dispatch({
                      type: 'labelMgr/queryQyRightList',
                      payload: {
                        labelId: data.labelId,
                        pageNum: 0,
                        pageSize: 10,
                      },
                      callback: () => {
                        this.getMock();
                      },
                    });
                  },
                });
                dispatch({
                  type: 'labelMgr/queryLabelList',
                  payload: {
                    pageNum: pageNumCount,
                    pageSize: 10,
                  },
                });
              },
            });
          }
          if (ruleType === '') {
            dispatch({
              type: 'labelMgr/addQyLabelAndRule',
              payload: {
                params: {
                  emLabelDo: newArray,
                  operatorRegions: subData.operatorRegions,
                  ruleContentText:
                    subData.textAreaValue === '' ? saveRuleDataText : subData.textAreaValue,
                  ruleContentList:
                    subData.qyRuleList.length === 0 ? saveRuleDataList : subData.qyRuleList,
                },
              },
              callback: data => {
                this.setState({
                  ruleId: data.labelRuleId,
                  labelId: data.labelId,
                  ruleType: data.operType,
                });
                dispatch({
                  type: 'labelMgr/queryQyLeftList',
                  payload: {
                    labelId: data.labelId,
                    pageNum: 0,
                    pageSize: 10,
                  },
                  callback: () => {
                    dispatch({
                      type: 'labelMgr/queryQyRightList',
                      payload: {
                        labelId: data.labelId,
                        pageNum: 0,
                        pageSize: 10,
                      },
                      callback: () => {
                        this.getMock();
                      },
                    });
                  },
                });
                dispatch({
                  type: 'labelMgr/queryLabelList',
                  payload: {
                    pageNum: pageNumCount,
                    pageSize: 10,
                  },
                });
              },
            });
          }
        } else if (labelType === 'edit') {
          const { editRuleResult } = this.state;
          const newArray = {
            id: labelData.id,
            labelName: firstSteps.labelName,
            labelStartDate: firstSteps.labelStartDate,
            labelEndDate: firstSteps.labelEndDate,
            updateFreq: firstSteps.updateFreq,
            labelDescribe: firstSteps.labelDescribe,
          };
          const newRuleContentList =
            subData.qyRuleList.length === 0 ? editRuleResultContent : subData.qyRuleList;
          dispatch({
            type: 'labelMgr/editQyLabelAndRule',
            payload: {
              params: {
                emLabelDo: newArray,
                id: editRuleResult.id,
                labelId: editRuleResult.labelId,
                operatorRegions: secondData.operatorRegions,
                ruleContentText:
                  subData.qyRuleList.length === 0
                    ? editRuleResultContentText
                    : subData.textAreaValue,
                ruleContentList: newRuleContentList === '' ? [] : newRuleContentList,
              },
            },
            callback: data => {
              this.setState({
                ruleId: data.labelRuleId,
                labelId: data.labelId,
              });
              dispatch({
                type: 'labelMgr/queryQyLeftList',
                payload: {
                  labelId: data.labelId,
                  pageNum: 0,
                  pageSize: 10,
                },
                callback: () => {
                  dispatch({
                    type: 'labelMgr/queryQyRightList',
                    payload: {
                      labelId: data.labelId,
                      pageNum: 0,
                      pageSize: 10,
                    },
                    callback: () => {
                      this.getMock();
                    },
                  });
                },
              });
              dispatch({
                type: 'labelMgr/queryLabelList',
                payload: {
                  pageNum: pageNumCount,
                  pageSize: 10,
                },
              });
            },
          });
        }
        const setCurrent = current + 1;
        this.setState({ current: setCurrent });
      });
    } else if (current === 2 || current === 3) {
      const setCurrent = current + 1;
      this.setState({ current: setCurrent });
    }
  }

  prev() {
    const { current, editRuleResultContentText, SecondSteps, saveRuleDataList } = this.state;
    if (current === 2) {
      this.setState({
        saveRuleDataText: SecondSteps.textAreaValue,
        saveRuleDataList:
          SecondSteps.qyRuleList.length === 0 ? saveRuleDataList : SecondSteps.qyRuleList,
        editRuleResultContentText:
          SecondSteps.qyRuleList.length === 0
            ? editRuleResultContentText
            : SecondSteps.textAreaValue,
      });
    }
    this.setState({
      nextCurrent: current,
    });
    const setCurrent = current - 1;
    this.setState({ current: setCurrent });
  }

  render() {
    const {
      current,
      firstSteps,
      SecondSteps,
      thirdSteps,
      nextCurrent,
      mockData,
      targetKeys,
      targetContent,
      editRuleResult,
      saveRuleDataList,
      editRuleResultContent,
      editRuleResultContentText,
      labelId,
    } = this.state;
    const { labelType, labelData, pageNumCount, handleAdd, updatafreq, paramList } = this.props;
    const steps1Props = {
      labelType,
      labelData,
      pageNumCount,
      handleAdd,
      updatafreq,
      nextCurrent,
      firstSteps,
      current,
      exceptLabel: () => {
        this.setState({
          current: 0,
        });
      },
    };
    const steps2Props = {
      labelType,
      labelData,
      pageNumCount,
      handleAdd,
      paramList,
      editRuleResult,
      saveRuleDataList,
      editRuleResultContent,
      editRuleResultContentText,
      nextCurrent,
      SecondSteps,
      deleteTextArea: () => {
        this.setState({
          editRuleResultContentText: '',
          editRuleResultContent: [],
        });
      },
      checkRule: () => {
        this.setState({
          current: 1,
        });
      },
    };
    const steps3Props = {
      labelId,
      mockData,
      targetKeys,
      targetContent,
      getNewMock: () => {
        this.getMock();
      },
    };
    const steps4Props = {
      firstSteps,
      thirdSteps,
      updatafreq,
    };
    return (
      <Fragment>
        <Steps current={current} style={{ marginBottom: 20 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        {current === 0 && <Steps1 {...steps1Props} onRef={this.firstChild} />}
        {current === 1 && <Steps2 {...steps2Props} onRef={this.firstChild} />}
        {current === 2 && <Steps3 {...steps3Props} threeRef={this.thirdChild} />}
        {current === 3 && <Steps4 {...steps4Props} />}
        <div className={styles.addAction}>
          {/* {current > 0 && current < steps.length - 1 && (
            <span className={styles.skipStep} style={{ cursor: 'pointer' }}>
              跳过
            </span>
          )} */}
          {current > 0 && (
            <Button style={{ marginLeft: 20 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          )}
        </div>
        {current === 1 && (
          <div>
            <Divider style={{ margin: '40px 0 24px' }} />
            <div>
              <h3>说明</h3>
              <h4>编辑规则表达式</h4>
              <p>
                如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
              </p>
              <h4>与/或/非</h4>
              <p>
                如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
              </p>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
export default AddCompanyLabel;
