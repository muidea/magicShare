import { queryIndex } from 'services/index'
import qs from 'qs'

export default {

  namespace: 'index',

  state: {
    summaryList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/') {
          dispatch({
            type: 'queryIndex',
            payload: qs.parse(location.search),
          })
        }
      })
    },
  },

  effects: {
    *queryIndex({ payload }, { call, put }) {
      const result = yield call(queryIndex, { ...payload })
      const { data } = result
      const { media } = data
      yield put({ type: 'save', payload: { summaryList: media } })
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
