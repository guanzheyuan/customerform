import { message } from 'antd';
import {
  queryLabelList,
  saveLabelData,
  updateStatusChange,
  deleteLabel,
  queryDetailLabel,
  queryUpdatafreq,
  queryAllLabelList,
  queryParamList,
  queryQyLeftList,
  queryQyRightList,
  addQyData,
  deleteQyData,
  addQyLabelAndRule,
  editQyLabelAndRule,
  queryEditRule,
  checkLabelName,
  checkRule,
} from './service';

export default {
  namespace: 'labelMgr',
  state: {
    labelList: [],
    labelDetail: [],
    updatafreq: [],
    allLabelList: [],
    paramList: [],
    qyLeftList: [],
    qyRightList: [],
    qyRuleId: [],
    editRuleData: [],
    ruleStatus: true,
  },
  effects: {
    *queryLabelList({ payload }, { call, put }) {
      const result = yield call(
        queryLabelList,
        payload.pageNum,
        payload.pageSize,
        payload.labelName
      );
      yield put({
        type: 'saveLabelList',
        labelList: result,
      });
    },

    *saveLabelData({ payload, callback }, { call }) {
      const result = yield call(saveLabelData, payload.params);
      if (result.success) {
        message.success('保存成功');
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *updateStatusChange({ payload, callback }, { call }) {
      const result = yield call(updateStatusChange, payload.labelId, payload.labelStatus);
      if (result.success) {
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *deleteLabel({ payload, callback }, { call }) {
      const result = yield call(deleteLabel, payload.labelId);
      if (result.success) {
        message.success('删除成功');
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *queryDetailLabel({ payload, callback }, { call, put }) {
      const result = yield call(queryDetailLabel, payload.labelId);
      if (result) {
        callback();
      }
      yield put({
        type: 'saveLabelDetail',
        labelDetail: result,
      });
    },

    *queryUpdatafreq({ payload }, { call, put }) {
      const result = yield call(queryUpdatafreq, payload);
      yield put({
        type: 'saveUpdatafreq',
        updatafreq: result,
      });
    },

    *queryAllLabelList({ payload }, { call, put }) {
      const result = yield call(
        queryAllLabelList,
        payload.labelId,
        payload.pageNum,
        payload.pageSize
      );
      yield put({
        type: 'saveAllLabelList',
        allLabelList: result,
      });
    },

    *queryParamList({ payload }, { call, put }) {
      const result = yield call(queryParamList, payload);
      yield put({
        type: 'saveParamList',
        paramList: result,
      });
    },

    *queryQyLeftList({ payload, callback }, { call, put }) {
      const result = yield call(
        queryQyLeftList,
        payload.labelId,
        payload.pageNum,
        payload.pageSize,
        payload.enterpriseName
      );
      yield put({
        type: 'saveQyleftList',
        qyLeftList: result,
      });
      if (result) {
        callback();
      }
    },

    *queryQyRightList({ payload, callback }, { call, put }) {
      const result = yield call(
        queryQyRightList,
        payload.labelId,
        payload.pageNum,
        payload.pageSize,
        payload.enterpriseName
      );
      yield put({
        type: 'saveQyRightList',
        qyRightList: result,
      });
      if (result) {
        callback();
      }
    },

    *addQyData({ payload, callback }, { call }) {
      const result = yield call(addQyData, payload.params);
      if (result.success) {
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *deleteQyData({ payload, callback }, { call }) {
      const result = yield call(deleteQyData, payload.params);
      if (result.success) {
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *addQyLabelAndRule({ payload, callback }, { call, put }) {
      const result = yield call(addQyLabelAndRule, payload.params);
      if (result.success) {
        callback(result.data);
      }
      yield put({
        type: 'saveQyRuleId',
        qyRuleId: result,
      });
    },

    *editQyLabelAndRule({ payload, callback }, { call, put }) {
      const result = yield call(editQyLabelAndRule, payload.params);
      if (result.success) {
        callback(result.data);
      }
      yield put({
        type: 'saveEditQyRuleId',
        editQyRuleId: result,
      });
    },

    *queryEditRule({ payload, callback }, { call, put }) {
      const result = yield call(queryEditRule, payload.id);
      if (result.success) {
        callback(result);
      }
      yield put({
        type: 'saveEditRuleData',
        editRuleData: result,
      });
    },
    *checkLabelName({ payload, callback }, { call }) {
      const result = yield call(checkLabelName, payload.labelName);
      if (result) {
        callback(result);
      }
    },
    *checkRule({ payload, callback }, { call, put }) {
      const result = yield call(checkRule, payload.params);
      if (result) {
        callback(result);
      }
      yield put({
        type: 'saveRuleStatus',
        ruleStatus: result.success,
      });
    },
  },
  reducers: {
    saveLabelList(state, { labelList }) {
      return {
        ...state,
        labelList,
      };
    },
    saveLabelDetail(state, { labelDetail }) {
      return {
        ...state,
        labelDetail,
      };
    },
    saveUpdatafreq(state, { updatafreq }) {
      return {
        ...state,
        updatafreq,
      };
    },
    saveAllLabelList(state, { allLabelList }) {
      return {
        ...state,
        allLabelList,
      };
    },
    saveParamList(state, { paramList }) {
      return {
        ...state,
        paramList,
      };
    },
    saveQyleftList(state, { qyLeftList }) {
      return {
        ...state,
        qyLeftList,
      };
    },
    saveQyRightList(state, { qyRightList }) {
      return {
        ...state,
        qyRightList,
      };
    },
    saveQyRuleId(state, { qyRuleId }) {
      return {
        ...state,
        qyRuleId,
      };
    },
    saveEditRuleData(state, { editRuleData }) {
      return {
        ...state,
        editRuleData,
      };
    },
    saveEditQyRuleId(state, { editQyRuleId }) {
      return {
        ...state,
        editQyRuleId,
      };
    },
    saveRuleStatus(state, { ruleStatus }) {
      return {
        ...state,
        ruleStatus,
      };
    },
  },
};
