import Vue from 'vue';
import axios from 'axios';
import router from '../router';
import store from '../store/store';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://blog.somnams.org/api';
} else {
  axios.defaults.baseURL = 'http://127.0.0.1:5000/api';
}
// axios.defaults.baseURL = 'https://blog.somnams.org/api';

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = window.localStorage.getItem('madblog-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response) {
      // 匹配不同的响应码
      switch (error.response.status) {
      case 401:
        // 清除 Token 及 已认证 等状态
        store.logoutAction();
        // 跳转到登录页
        if (router.currentRoute.path !== '/login') {
          Vue.toasted.error('401: 认证已失效，请先登录', { icon: 'fingerprint' });
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.path },
          });
        }
        break;

      case 403:
        Vue.toasted.error('403: Forbidden', { icon: 'fingerprint' });
        // router.back()
        break;

      case 404:
        Vue.toasted.error('404: Not Found', { icon: 'fingerprint' });
        router.back();
        break;

      case 500: // 根本拿不到 500 错误，因为 CORs 不会过来
        Vue.toasted.error('500: Oops... INTERNAL SERVER ERROR', { icon: 'fingerprint' });
        router.back();
        break;

      default:
        break;
      }
    } else if (error.request) {
      console.log(error.request);
      Vue.toasted.error('The request has not been sent to Flask API，because OPTIONS get error', {
        icon: 'fingerprint',
      });
    } else {
      console.log('Error: ', error.message);
    }
    console.log(error.config);

    return Promise.reject(error);
  }
);

export default axios;
