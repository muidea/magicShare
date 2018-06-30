import { queryIndex } from 'services/index'
import qs from 'qs'

export default {

  namespace: 'index',

  state: {
    summaryList: [],
    readOnly: true,
    addNewFlag: false,
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
    *queryIndex({ payload }, { call, put, select }) {
      const { onlineUser } = yield select(_ => _.app)

      const result = yield call(queryIndex, { ...payload })
      const { data } = result
      const { media } = data
      yield put({ type: 'save', payload: { summaryList: media, readOnly: !onlineUser } })
    },

    *addNew({ payload }, { put, select }) {
      const { onlineUser } = yield select(_ => _.app)
      if (onlineUser) {
        yield put({ type: 'save', payload: { addNewFlag: true } })
      }
    },

    *submitNew({ payload }, { put, select }) {
      const { onlineUser } = yield select(_ => _.app)
      if (onlineUser) {
        yield put({ type: 'save', payload: { addNewFlag: false } })
      }
    },

    *cancelNew({ payload }, { put }) {
      yield put({ type: 'save', payload: { addNewFlag: false } })
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
