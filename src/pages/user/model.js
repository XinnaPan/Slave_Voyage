import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require("path-to-regexp")
import api from 'api'
import { pageModel } from 'utils/model'

const {
  queryTableTitles,
  queryVoyageList,
  createUser,
  removeUser,
  updateUser,
  removeUserList,
} = api

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],


    expandedKeys:[],
    checkedKeys:[],
    selectedKeys:[],
    autoExpandParent:false

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathToRegexp('/user').exec(location.pathname)) {
          
          //console.log(location);
          const payload = {
            page:Number(location.query.page)||1,
            pageSize:Number(location.query.pageSize) || 10,     
          }
          //const payload = location.query || { page: 1, pageSize: 10 }
         
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {

      const params_data={
        results_per_page:Number(payload.pageSize),
        results_page:Number(payload.page),
        
      }
      const params_title={
        
      hierarchical:'False'
      }
      const data = yield call(queryVoyageList, params_data)

      const titles= yield call(queryTableTitles,params_title)

      if (data && titles) {
       
        yield put({
          type: 'querySuccess',
          payload: {
            titles: titles,
            list: data.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: 30,
            },
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeUser, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeUserList, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createUser, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(updateUser, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

    expandedKeysf(state,{payload}) {
      return { ...state,  expandedKeys:payload ,autoExpandParent:false}
    },

    checkedKeysf(state,{payload}) {
      return { ...state, checkedKeys:payload }
    },

    selectedKeysf(state,{payload}) {
      return { ...state, selectedKeys:payload }
    },


  },
})
