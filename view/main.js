import Vue from 'vue'
import App from './App'
import "./service/request"
import store from "./vuex/index.js"
import config from "./service/config.js"
Vue.config.productionTip = false
Vue.prototype.$config = config;

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
