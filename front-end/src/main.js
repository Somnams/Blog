import Vue from 'vue';
import App from './App.vue';
import router from './router';
import plugins from './utils';
import axios from './network/request';
import store from './store';
import VueToasted from 'vue-toasted';
import Router from 'vue-router';
import moment from 'moment';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import 'highlight.js/styles/railscasts.css';

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

Vue.prototype.$moment = moment;

Vue.use(plugins);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueToasted, {
  theme: 'bubble',
  position: 'top-center',
  duration: 3000,
  iconPack: 'material',
  action: {
    text: 'Cancel',
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    },
  },
});

Vue.use(mavonEditor);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
