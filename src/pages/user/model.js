import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require("path-to-regexp")
import api from 'api'
import { pageModel } from 'utils/model'
import { update } from 'lodash'

const {
  queryVoyageList,
  removeUser,
  queryFilter,
  querySort,
  queryIntegerRange,
  queryAutoComplete,
} = api

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],

    expandedKeys: [],
    checkedTitlesTmp: [], //for tree  tmp
    selectedTitlesTmp: [],

    autoExpandParent: false,
    checkedTitlesFinal: ['id', 'dataset', 'last_update'], //for titles
    tagSearchTerm: [],//for filter
    sortTitlesStr: [],

    tmp_integer_min: {},
    tmp_integer_max: {},

    slider_flag: {},
    list: [],

    autoComplete_options:[]


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
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put,select }) {

      const { pageSize, page, ...extra_info } = payload
      const params_data = {
        results_per_page: Number(payload.pageSize) || 10,
        results_page: Number(payload.page) || 1,
      }
      Object.keys(extra_info).map((ei) => {
        if (!extra_info[ei])
          return
        params_data[ei] = extra_info[ei]
      });
      const data = yield call(queryVoyageList, params_data)

      /*const data = yield call(queryVoyageList, params_data)

      const titles= yield call(queryTableTitles,{hierarchical:'true'})
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

      Object.keys(titles).map(item=>{
        treeData.push(set_tree(titles[item],item))
      })*/

      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            //titles: titles,
            //treeData: treeData,
            list: data.list,
            //key_type: key_type,
            //key_label: key_label,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(data.headers.total_results_count) || 30,
            },
          },
        })
      }
    },

    *filter({ payload }, { call, put, select }) {
      const {params} = payload
      const data = yield call(queryFilter, params)

      console.log(data)
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
        type: 'handleOk',
        payload
      })
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

    *rangeCheck({ payload }, { call, put, select }) {
      const data = yield call(queryIntegerRange, { aggregate_fields: payload })
      const mins = yield select(_ => _.user.tmp_integer_min)
      const maxs = yield select(_ => _.user.tmp_integer_max)
      const flags = yield select(_ => _.user.slider_flag)

      var temp = {};
      temp[payload] = data[payload]['min']
      const mins_new = { ...mins, ...temp }
      temp[payload] = data[payload]['max']
      console.log("mins_new", mins_new)

      const maxs_new = { ...maxs, ...temp }

      if (data.success) {
        yield put({ type: 'updateRange', payload: { min: mins_new, max: maxs_new } })
      } else {
        throw data
      }
      temp[payload] = true

      yield put({
        type: 'changeSliderFlag',
        payload: { ...flags, ...temp }
      })


    },

    *autoComplete({payload},{ call, put}) {
      const data= yield call(queryAutoComplete, payload.params)

      /*var formatted_fullname=[]
      const full_name=data[payload.title]
      full_name.forEach(element => {
        formatted_fullname.push({value:element})
      });*/

      //const data=
      yield put({
        type: 'updateAutoCompleteOptions',
        //payload:['nana1','nana2']
        payload:data[payload.title]

      })
    }
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

    expandedKeysf(state, { payload }) {
      return { ...state, expandedKeys: payload, autoExpandParent: false }
    },

    checkedKeysf(state, { payload }) {
      return { ...state, checkedTitlesTmp: payload }
    },

    selectedKeysf(state, { payload }) {
      return { ...state, selectedTitlesTmp: payload }
    },

    handleOk(state, { payload }) {
      return { ...state, checkedTitlesFinal: payload }
    },

    handleFilter(state, { payload }) {
      return { ...state, tagSearchTerm: [...state.tagSearchTerm, payload] }
    },
    deleteTag(state, { payload }) {
      const tags = state.tagSearchTerm.filter((tag) => tag !== payload);
      return { ...state, tagSearchTerm: tags }
    },

    changeValueEdit(state, { payload }) {
      return { ...state, integerRange: payload }

    },

    updateAutoCompleteOptions(state, { payload }) {
      return { ...state, autoComplete_options: payload }

    },

    /* recordTitles(state, {payload}) {
       return {...state, titles:payload}
     },
 
     recordTreeData(state,{payload}) {
       return {...state, treeData:payload}
 
     }*/

    updateRange(state, { payload }) {

      return { ...state, tmp_integer_min: payload.min, tmp_integer_max: payload.max }

    },

    changeSliderFlag(state, { payload }) {
      return { ...state, slider_flag: payload }
    },

    querySortSuccess(state, { payload }) {
      const { list } = payload
      return {
        ...state,
        list,
      }
    },

    queryFilterSuccess(state, { payload }) {
      const { list } = payload
      return {
        ...state,
        list,
      }
    },


  },
})
