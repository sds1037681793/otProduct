import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import './styles/index.scss';
import App from './App.vue';
import router from './router';
import "./assets/icon/iconfont.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;




router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('token')
    next()
  } else {
    let user = JSON.parse(window.localStorage.getItem('token'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
