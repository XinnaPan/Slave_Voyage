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
        /*order_by: payload.sortTitlesStr,
        checkedTitlesFinal,
        tagSearchTerm,
        sortTitlesStr,*/
      }

      const data = yield call(queryVoyageList, params_data)

      const titles= yield call(queryTableTitles,{hierarchical:'False'})

      Object.keys(titles).filter((tag) => tag !== 'header');

      const getName = (dic,curList,route,visited)=>{
        var data=[]
        curList.forEach(c=>{
          var res={}
          var tmp = c.split('__')
          var ind= tmp.length -1

          res['title']=tmp[ind]
          res['label']=res['title']
          res['key']= c
          res['value']= res['key']
          if(dic && dic[c] && !visited.has(c)) {
            visited.add(c)
            res['children']=getName(dic,dic[c],res['key'],visited)
            visited.delete(c)
          }
          data.push(res)
        })
        return data
      }

      var titlesNames= []
      Object.keys(titles).map((key) => titlesNames.push(key.split("__")));
      titlesNames.splice(0,4)
      let arr_parent=new Set()
      let dic_child={};
      titlesNames.forEach(t=>{
        arr_parent.add(`${t[0]}`);
        var name_cur=t[0]
        for(let cnt=1;cnt<t.length;cnt++){
          if(!dic_child[name_cur]){
            dic_child[name_cur]=new Set()
          }
          dic_child[name_cur].add(`${name_cur}__${t[cnt]}`)
          name_cur += '__'
          name_cur += t[cnt]
        }
      })
      var visited = new Set()
      var treeData= getName(dic_child,arr_parent,"",visited)

      if (data && titles) {
       
        yield put({
          type: 'querySuccess',
          payload: {
            titles: titles,
            treeData:treeData,
            list: data.list,
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
          type: 'queryFilterUpdate',
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
          type: 'queryFilterUpdate',
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




  },
})
