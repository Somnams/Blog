import BlogAlert from './BlogAlert.vue'

let curAlert;
export default {
  install(Vue, options) {
    Vue.prototype.$alert = (type, options) => {
      curAlert = createAlert({
        Vue,
        type,
        propsData: options
      })
    }
  }
}

function createAlert({Vue, type, propsData}) {
  const Constructor = Vue.extend(BlogAlert);
  const alert = new Constructor({propsData});
  alert.type = type;
  alert.$mount();
  document.body.appendChild(alert.$el);
  return alert;
}
