import axios from 'axios'
import { cloneDeep } from 'lodash'
const { parse, compile } = require("path-to-regexp")
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'

const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  let { data, url } = options
  const cloneData = cloneDeep(data)


  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = parse(url)
    url = compile(url)(data)


    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
    console.log("🚀 ~ file: request.js ~ line 36 ~ request ~ url", url)
  } catch (e) {
    message.error(e.message)
  }

  options.url = url
  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })
  console.log("url ", url)
  console.log(options)

  return axios(options)
    .then(response => {
      console.log("response")
      console.log(response)
      const { statusText, status, data, headers } = response
      console.log("data")
      console.log(data)
      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      result.headers=headers
      
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      console.log("❌error", error)
      //{url: '/api/v1/user/login', data: {…}, method: 'POST', headers: {…}, cancelToken: CancelToken}
      //Authorization: "Token 3e9ed2e0fa70a1a5cb6f34eb7a30ebde208ecd8f"
      //Content-Type: "multipart/form-data"
      const { response, message } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
