import React, { Component } from 'react';
import { Descriptions } from 'antd';

class DataInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { gridInfo } = this.props;
    const gridProjectInfo = gridInfo.project_info;
    return (
      <div>
        <Descriptions title="项目名称">
          <Descriptions.Item label="项目名称">{gridProjectInfo.project_name}</Descriptions.Item>
          <Descriptions.Item label="项目一级分类">
            {gridProjectInfo.project_class_1}
          </Descriptions.Item>
          <Descriptions.Item label="项目二级分类">
            {gridProjectInfo.project_class_2}
          </Descriptions.Item>
          <Descriptions.Item label="项目性质">{gridProjectInfo.project_type}</Descriptions.Item>
          <Descriptions.Item label="责任部门">{gridProjectInfo.charge_dept}</Descriptions.Item>
          <Descriptions.Item label="牵头领导">{gridProjectInfo.project_header}</Descriptions.Item>
          <Descriptions.Item label="项目建设内容与规模">
            {gridProjectInfo.project_scope}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="年度目标">
          <Descriptions.Item label="计划总投资(区）">
            {gridProjectInfo.invest_total}
          </Descriptions.Item>
          <Descriptions.Item label="当年投资(区）">
            {gridProjectInfo.current_invest}
          </Descriptions.Item>
          <Descriptions.Item label="年度建设计划一季度">
            {gridProjectInfo.invest_season_1}
          </Descriptions.Item>
          <Descriptions.Item label="年度建设计划二季度">
            {gridProjectInfo.invest_season_2}
          </Descriptions.Item>
          <Descriptions.Item label="年度建设计划三季度">
            {gridProjectInfo.invest_season_3}
          </Descriptions.Item>
          <Descriptions.Item label="年度建设计划四季度">
            {gridProjectInfo.invest_season_4}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="项目进度">
          <Descriptions.Item label="月份">{gridProjectInfo.process_month}</Descriptions.Item>
          <Descriptions.Item label="固投目标进度">
            {gridProjectInfo.invest_process_goal}
          </Descriptions.Item>
          <Descriptions.Item label="固投实际进度">
            {gridProjectInfo.invest_process}
          </Descriptions.Item>
          <Descriptions.Item label="项目进度">{gridProjectInfo.project_process}</Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

export default DataInfo;
