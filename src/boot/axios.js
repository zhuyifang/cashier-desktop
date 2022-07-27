import {boot} from 'quasar/wrappers'
import axios from 'axios'
import qs from "qs";
import {LocalStorage} from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const http = axios.create({
  headers: {
    'X-App-Platform': 'mobile',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
http.interceptors.request.use(config => {
  let user = LocalStorage.getItem('user')
  if (user && user.accessToken) {
    config.headers['X-Access-Token'] = user.accessToken
  }
  if (!config.url.startsWith('http')) {
    config.url = 'http://cashier.qicuo.com/web/index.php?r=' + config.url
  }
  return config
}, err => {
  return Promise.reject(err)
})

const formHttp = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/x-www-form-urlencoded',
  }
})
formHttp.interceptors.request.use(config => {
  let user = LocalStorage.getItem('user')
  if (user && user.accessToken) {
    config.headers['x-access-token'] = user.accessToken
  }
  config.data = qs.stringify(config.data)
  if (!config.url.startsWith('http')) {
    config.url = 'http://cashier.qicuo.com/web/index.php?r=' + config.url
  }
  return config
}, err => {
  return Promise.reject(err)
})


export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$formHttp = formHttp
  app.config.globalProperties.$http = http
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {http, formHttp}
