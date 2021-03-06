import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import io from './components/socket/weapp.socket.io.js'
Vue.config.productionTip = false;
//服务器地址
// Vue.prototype.serverUrl='http://192.168.2.2:3000';
// Vue.prototype.socket=io('http://192.168.2.2:8082');
Vue.prototype.serverUrl='http://124.223.172.34:3000';
Vue.prototype.socket=io('http://124.223.172.34:8082');

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif