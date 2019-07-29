import { message } from 'antd';
import { queryFormList, addForm, editForm, deleteFormData } from './service';

export default {
  namespace: 'customerFormList',
  state: {
    formList: [],
  },
  effects: {
    *qryList({ params }, { call, put }) {
      const result = yield call(queryFormList, params);
      yield put({
        type: 'formlist',
        formList: result,
      });
    },
    *addForm({ params, callback }, { call }) {
      const result = yield call(addForm, params);
      if (result) {
        message.success('新增成功');
      } else {
        message.error('新增失败');
      }
      callback();
    },
    *editForm({ params, callback }, { call }) {
      const result = yield call(editForm, params);
      if (result) {
        message.success('编辑成功');
      } else {
        message.error('编辑失败');
      }
      callback();
    },
    *deleteFormData({ id, callback }, { call }) {
      const result = yield call(deleteFormData, id);
      if (result) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
      callback();
    },
  },
  reducers: {
    formlist(state, { formList }) {
      return {
        ...state,
        formList,
      };
    },
  },
};
