import modelExtend from 'dva-model-extend'
import api from 'api'
const { pathToRegexp } = require("path-to-regexp")
import { pageModel } from 'utils/model'

const { queryPostList } = api

export default modelExtend(pageModel, {
  namespace: 'post',
  state: {
    selectedRowKeys: [],
    expandedKeys:[],
    checkedTitlesTmp:['id','dataset','last_update'], //for tree  tmp
    selectedTitlesTmp:[],
    autoExpandParent:false,
    checkedTitlesFinal:['id','dataset','last_update'], //for titles
    tagSearchTerm:[],//for filter
    sortTitlesStr:[],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathToRegexp('/post').exec(location.pathname)) {
          dispatch({
            type: 'query',
            payload: {
              status: 2,
              ...location.query,
            },
          })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryPostList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      } else {
        throw data
      }
    },
  },

  
  reducers: {
 

    expandedKeysf(state,{payload}) {
      return { ...state,  expandedKeys:payload ,autoExpandParent:false}
    },

    checkedKeysf(state,{payload}) {
      return { ...state, checkedTitlesTmp:payload }
    },

    selectedKeysf(state,{payload}) {
      return { ...state, selectedTitlesTmp:payload }
    },

    handleOk(state,{payload}) {
      return { ...state, checkedTitlesFinal:payload }
    },


    changeValueEdit(state,{payload}) {
      return {...state,integerRange:payload}

    },
  },
})
