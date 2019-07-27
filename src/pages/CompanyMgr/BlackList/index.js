import React from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import BlackList from './components/BlackList';
import AddNewCompany from './components/AddNewCompany';

const { Search } = Input;

@connect(({ blackList }) => ({ blackList }))
class CompanyCredit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShown: false,
      inputText: '',
    };
  }

  searchCompany = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blackList/List',
      payload: {
        pageNum: 0,
        pageSize: 10,
        enterpriseName: value,
      },
    });
  };

  addCompany = () => {
    this.setState({
      modalShown: true,
    });
  };

  changeCompany = e => {
    this.setState({
      inputText: e.target.value,
    });
  };

  render() {
    const { modalShown } = this.state;
    const addNewCompanyProps = {
      modalShown,
      turnHidden: () => {
        this.setState({
          modalShown: false,
        });
      },
    };
    const { inputText } = this.state;
    const blackListProps = {
      inputText,
    };

    return (
      <div>
        <div className={styles.blackListSpace}>
          <div className={styles.headCircle} />
          <div className={styles.headTitle}>企业黑名单</div>
          {/* <a onClick={() => this.addCompany()} className={styles.headHerf}>新增企业</a> */}
          <Search
            placeholder="企业名称"
            enterButton="搜索"
            className={styles.blackListList}
            onSearch={value => this.searchCompany(value)}
            onChange={e => this.changeCompany(e)}
          />
          <BlackList {...blackListProps} />
        </div>
        <AddNewCompany {...addNewCompanyProps} />
      </div>
    );
  }
}
export default CompanyCredit;
