export default {
  namespace: 'test',
  state: {},
  effects: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
