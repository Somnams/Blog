import BlogAlert from './BlogAlert.vue'
//
// const blogAlert = {};
// blogAlert.install = vue => {
//   const AlertCon = vue.extend(BlogAlert);
//   const ins = new AlertCon();
//   ins.$mount(document.createElement('div'));
//   document.body.appendChild(ins, $el);
//
// }

let curAlert;
export default {
  install(Vue, options) {
    Vue.prototype.$alert = (type, options) => {
      // if (curAlert) {
      //   curAlert.onClickClose();
      // }
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
