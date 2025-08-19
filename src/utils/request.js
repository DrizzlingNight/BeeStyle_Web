import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    const regex = /.*csrftoken=([^;.]*).*$/ // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] =
        document.cookie.match(regex) === null
            ? null
            : document.cookie.match(regex)[1]
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    //TODO Response Code Process
    // if the custom code is not 20000, it is judged as an error.
    if (response.status < 200 || response.status >= 400) {
      // console.log(res)
      window.alert(res.message || 'Error')
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      // console.log('响应拦截器-error.response.status:', error.response.status)
      switch (error.response.status) {
        case 400:
          console.error('-----------400----------', error.response);
          return Promise.reject(error.response)
        case 401:
          // logout时返回401，且没有额外信息返回
          console.error('-----------401 Unauthorized----------', error.response)
          return Promise.reject(error.response)
        case 403:
          // 登录失败时返回403，无权访问某些接口也返回403
          console.error('-----------403 Fobidden----------', error.response)
          // if (settings.needLogin) {
          //   loginOut(2)
          // }
          return Promise.reject(error.response)
        default:
          console.error('request-default-error!')
          // Toast({
          //   message: error.message,
          //   type: 'fail',
          //   duration: 5 * 1000,
          //   className: 'response-error',
          // })
          return Promise.reject(error.response)
      }
    } else {
      // console.log('error:'+error)
      // Toast({
      //   message: '请求失败！',
      //   type: 'fail',
      //   duration: 4 * 1000,
      // })
      return Promise.reject(error.response)
    }
  }
)

export default service
