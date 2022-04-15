import request from 'utils/request'
import { apiPrefix } from 'utils/config'

import api from './api'

const gen = params => {
  let url = apiPrefix + params
  let method = 'GET'

  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  var headers = {Authorization:'Token 519772554d0db362ec4e00da0d620be0d20a3a94', "Content-Type": "multipart/form-data"}
  if(method === 'GET' || method === 'OPTIONS'){
    return function(data) {
      return request({
        url,
        params:data,
        method,
        headers
      })
    }
  } else{
    return function(data) {
      return request({
        url,
        data,
        method,
        headers,
      })
    }
  }
}

const APIFunction = {}
for (const key in api) {
  APIFunction[key] = gen(api[key])
}


export default APIFunction
