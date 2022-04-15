import modelExtend from 'dva-model-extend'
import api from 'api'
const { pathToRegexp } = require("path-to-regexp")
import { pageModel } from 'utils/model'

const {queryTableTitles } = api

export default modelExtend(pageModel, {
  namespace: 'config',
  state: {
    expandedKeys: [],
    checkedTitlesTmp: ['id', 'dataset', 'last_update'], //for tree  tmp
    selectedTitlesTmp: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
          dispatch({
            type: 'query',
          })
    },
  },

  effects: {
    *query({_}, { call, put,select }) {
      
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



  },
})
