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
  queryFilter,
  querySort
} = api

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],

    expandedKeys:[],
    checkedTitlesTmp:['id','dataset','last_update'], //for tree  tmp
    selectedTitlesTmp:[],

    autoExpandParent:false,
    checkedTitlesFinal:['id','dataset','last_update'], //for titles
    tagSearchTerm:[],//for filter
    sortTitlesStr:[],

    integerRange:0,


  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathToRegexp('/user').exec(location.pathname)) {
          
          //console.log(location);
          /*const payload = {
            page:Number(location.query.page)||1,
            pageSize:Number(location.query.pageSize) || 10,   
            order_by:payload.order_by  
          }*/
          //const payload = location.query || { page: 1, pageSize: 10 }
         
          dispatch({
            type: 'query',
            payload:location.query,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {

      const {pageSize,page,...extra_info}=payload
      let params_data={
        results_per_page:Number(payload.pageSize) ||10,
        results_page:Number(payload.page)||1,
      }
      Object.keys(extra_info).map((ei) => {
        if(extra_info[ei]===undefined)
          return
        params_data[ei]=extra_info[ei]
      });


      const data = yield call(queryVoyageList, params_data)

      const titles= yield call(queryTableTitles,{auto:'true'})
      delete titles['headers']
      delete titles['success']
      delete titles['message']
      delete titles['statusCode']



  
      let treeData=[]
      let key_type={}
      let key_label={}
      const set_tree = (cur_title,route)=>{
        let res={}
        Object.keys(cur_title).map(item=>{
            if(item==='label' ){
              res['title']=cur_title[item]
              res['label']=res['title']
              res['key']= route
              res['value']= res['key']
              key_label[route]=res['title']
            } else if(item ==='type'){
              key_type[route]=cur_title[item]
            } else if(item ==='model'){
              return false;
            } else {
              if(!res['children']) {
                res['children']=[]
              }
              res['children'].push(set_tree(cur_title[item],route+'__'+item))
            } 
        })

        return res
      }

      //treeData=set_tree(titles,"")
     // Object.keys(titles).filter(item=>item!=='success' && item !=='message' && item!=='statusCode')
      Object.keys(titles).map(item=>{
        console.log("t:",item)
        treeData.push(set_tree(titles[item],item))
      })

      console.log(treeData)
      if (data && titles) {

        console.log("treeData=",treeData)
        yield put({
          type: 'queryPageSuccess',
          payload: {
            titles: titles,
            treeData:treeData,
            list: data.list,
            key_type:key_type,
            key_label:key_label,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(data.headers.total_results_count) || 30,
            },
          },
        })
      }
    },

    *filter({},{call,put,select}) {
      const tags = yield select(_ => _.user.tagSearchTerm)
      var params={}
      tags.map(items=>{
        const str_splitted= items.split('=')
        params[str_splitted[0]]=str_splitted[1]
      })
      const data = yield call(queryFilter, params) 
      if(data) {
        yield put({
          type: 'queryFilterSuccess',
          payload: {
            list: data.list,
            pagination: {
              total: Number(data.headers.total_results_count) || 30,
            },
          },
        })
      }
    },


    *sort({ payload }, { call, put }) {

      const data = yield call(querySort, { order_by: payload })
      //const { selectedRowKeys } = yield select(_ => _.user)
      if (data) {
        yield put({
          type: 'queryFilterSuccess',
          payload: {
            list: data.list,
            pagination: {
              total: Number(data.headers.total_results_count) || 30,
            },
          },
        })
      } else {
        throw data
      }
    },



    *create({ payload }, { put }) {

        yield put({ type: 'hideModal' })
        yield put({ 
          type: 'handleOk' ,
          payload
        })
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
      return { ...state, checkedTitlesTmp:payload }
    },

    selectedKeysf(state,{payload}) {
      return { ...state, selectedTitlesTmp:payload }
    },

    handleOk(state,{payload}) {
      return { ...state, checkedTitlesFinal:payload }
    },

    handleFilter(state,{payload}) {      
      return {...state,tagSearchTerm:[...state.tagSearchTerm,payload]}
    },
    deleteTag(state,{payload}) {
      const tags = state.tagSearchTerm.filter((tag) => tag !== payload);
      return {...state,tagSearchTerm:tags}
    },

    changeValueEdit(state,{payload}) {
      return {...state,integerRange:payload}

    }

   /* recordTitles(state, {payload}) {
      return {...state, titles:payload}
    },

    recordTreeData(state,{payload}) {
      return {...state, treeData:payload}

    }*/


  },
})
