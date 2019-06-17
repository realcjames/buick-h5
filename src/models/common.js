import * as commonApi from './service';

export default {
  namespace: 'common',
  state: {
    isAuth: true, //假设已授权
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
