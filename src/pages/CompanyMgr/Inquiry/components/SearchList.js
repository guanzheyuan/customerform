import React, { Component, Fragment } from 'react';
import { Form } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';
import StandardFormRow from '@/components/StandardFormRow';
import TagSelect from '@/components/TagSelect';

const FormItem = Form.Item;

@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
            <TagSelect expandable actionsText={actionsTextMap}>
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
      <TagSelect.Option key={item.id} value={item.id}>
        {item.labelName}
      </TagSelect.Option>
    ));
    return (
      <Fragment>
        {list}
        <StandardFormRow title="企业标签" block style={{ paddingBottom: 11 }}>
          <FormItem>
            {getFieldDecorator('label')(
              <TagSelect expandable actionsText={actionsTextMap}>
                {labelSearch}
              </TagSelect>
            )}
          </FormItem>
        </StandardFormRow>
      </Fragment>
    );
  }
}

export default SearchList;
