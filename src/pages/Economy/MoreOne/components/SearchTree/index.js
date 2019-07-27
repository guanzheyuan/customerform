import React, { Component } from 'react';
import { Tree } from 'antd';
import { connect } from 'dva';

const { TreeNode } = Tree;
@connect(({ moreOne, loading }) => ({
  moreOne,
  loading: loading.effects['moreOne/queryGrid'],
}))
class SearchTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoTopExpandParent: true,
      expandedTopKeys: ['0'],
      expandedDownKeys: ['0'],
      autoDownExpandParent: true,
      checkedTopKeys: [],
      // selectedTopKeys: [],
      checkedDownKeys: [],
      // selectedDownKeys: [],
    };
  }

  onTopExpand = expandedKeys => {
    this.setState({
      expandedTopKeys: expandedKeys,
      autoTopExpandParent: false,
    });
  };

  onDownExpand = expandedKeys => {
    this.setState({
      expandedDownKeys: expandedKeys,
      autoDownExpandParent: false,
    });
  };

  onTopCheck = (checkedKeys, info) => {
    if (info.halfCheckedKeys.length === 0) {
      checkedKeys.splice(0, 1);
    }
    this.setState({ checkedTopKeys: checkedKeys });
    const { checkedDownKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'moreOne/queryGridArea',
      payload: {
        gridIdList: checkedKeys,
      },
    });
    dispatch({
      type: 'moreOne/queryGrid',
      payload: {
        gridIdList: checkedKeys,
        projectStatus: checkedDownKeys,
      },
    });
  };

  onDownCheck = (checkedKeys, info) => {
    if (info.halfCheckedKeys.length === 0) {
      checkedKeys.splice(0, 1);
    }
    this.setState({ checkedDownKeys: checkedKeys });
    const { checkedTopKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'moreOne/queryGrid',
      payload: {
        gridIdList: checkedTopKeys,
        projectStatus: checkedKeys,
      },
    });
  };

  renderTopTreeNodes = data =>
    data.map(item => {
      if (item) {
        return <TreeNode title={item.gridName} key={item.id} dataRef={item} />;
      }
      return <TreeNode {...item} />;
    });

  renderDownTreeNodes = data =>
    data.map(item => {
      if (item) {
        return <TreeNode title={item.treeNames} key={item.dictCode} dataRef={item} />;
      }
      return <TreeNode {...item} />;
    });

  render() {
    const {
      expandedTopKeys,
      expandedDownKeys,
      autoDownExpandParent,
      autoTopExpandParent,
      checkedTopKeys,
      checkedDownKeys,
    } = this.state;
    const { gridTopList, gridDownList } = this.props;

    return (
      <div>
        {gridTopList.success && (
          <Tree
            checkable
            onExpand={this.onTopExpand}
            expandedKeys={expandedTopKeys}
            autoExpandParent={autoTopExpandParent}
            onCheck={this.onTopCheck}
            checkedKeys={checkedTopKeys}
            onSelect={this.onTopSelect}
            // selectedKeys={selectedTopKeys}
          >
            <TreeNode title={gridTopList.data.levelName} key={gridTopList.data.levelId}>
              {this.renderTopTreeNodes(gridTopList.data.levelData)}
            </TreeNode>
          </Tree>
        )}
        {gridDownList.success && (
          <Tree
            checkable
            onExpand={this.onDownExpand}
            expandedKeys={expandedDownKeys}
            autoExpandParent={autoDownExpandParent}
            onCheck={this.onDownCheck}
            checkedKeys={checkedDownKeys}
            // selectedKeys={selectedDownKeys}
          >
            <TreeNode title={gridDownList.data.levelName} key={gridDownList.data.levelId}>
              {this.renderDownTreeNodes(gridDownList.data.levelData)}
            </TreeNode>

            {/* {loop(gridList)} */}
          </Tree>
        )}
      </div>
    );
  }
}

export default SearchTree;
