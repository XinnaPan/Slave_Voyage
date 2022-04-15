/* global window */

import { history } from 'umi'
import { stringify } from 'qs'
import store from 'store'
const { pathToRegexp } = require("path-to-regexp")
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'
import config from 'config'
import { select } from '@lingui/macro'

const {queryTableTitles } = api

const get_tree_from_splitted_data = (titlesNames,key_label) => {
    
    var arr_parent = new Set()
    var dic_child = {}
    titlesNames.forEach(t => {
        arr_parent.add(`0_${t[0]}`);
        for (var cnt = 1; cnt < t.length; cnt++) {
            if (!dic_child[`${cnt - 1}_${t[cnt - 1]}`]) {
                dic_child[`${cnt - 1}_${t[cnt - 1]}`] = new Set()
            }
            dic_child[`${cnt - 1}_${t[cnt - 1]}`].add(`${cnt}_${t[cnt]}`)

        }
    })
    var visited = new Set()
    console.log('key_label',key_label)
    const getName = (dic, curList, route, visited,key_label) => {
        let data = []
        curList.forEach(c => {
            let res = {}
            var title_start_pos = c.indexOf('_')
            res['key'] = route + (route !== '' ? '__' : '') + c.slice(title_start_pos + 1)
            res['value'] = res['key']
            res['title'] = key_label[res['key']]
            res['label'] = res['title']

            if (dic && dic[c] && !visited.has(c)) {
                visited.add(c)
                res['children'] = getName(dic, dic[c], res['key'], visited,key_label)
                visited.delete(c)
            }
            data.push(res)
        })
        return data
    }
    return getName(dic_child, arr_parent, "", visited,key_label)
}
export default {
    namespace: 'titles',
    state: {
        checked_titles_global: [],
        titles: [],
        treeData: [],
        key_type: [],
        key_label: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },

  },
  effects: {
    *query({ payload }, { call, put, select }) {
        
          const titles = yield call(queryTableTitles, { hierarchical: 'false' })
          delete titles['headers']
          delete titles['success']
          delete titles['message']
          delete titles['statusCode']
          var key_type = {}
          var key_label = {}
          Object.keys(titles).map((key) => {
            key_type[key] = titles[key]['type']
            key_label[key] = titles[key]['label']
          })
          yield put({
            type: 'updateState',
            payload: {
              key_type: key_type,
              key_label: key_label,
            },
          })
          var titlesNames = []; //record splitted titles
          Object.keys(titles).map((key) => titlesNames.push(key.split("__")))
          var treeData = get_tree_from_splitted_data(titlesNames,key_label)
          yield put({
            type: 'updateState',
            payload: {
              titles: titles,
              treeData: treeData,
              checked_titles_global:treeData

            },
          })
    
    },
    *queryUpdateTitles({ payload }, {put,select}) {
        const key_label=yield select(_=>_.titles.key_label)
        const {checkedTitles_shared}=payload
        console.log("here1",checkedTitles_shared)
        var titlesNames = []; //record splitted titles
        checkedTitles_shared.forEach(element => {
          titlesNames.push(element.split("__"))
        });
        const treeData = get_tree_from_splitted_data(titlesNames,key_label)
        console.log("here2",treeData)
       
        yield put({
            type: 'updateState',
            payload: {
                checked_titles_global:treeData
            },
          })

    }
    
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    
  },
}
