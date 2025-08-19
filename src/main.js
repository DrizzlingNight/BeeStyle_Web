import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './lang'
import VImageInput  from 'vuetify-image-input/a-la-carte';
import VueTransmit from "vue-transmit"
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueClipboard from 'vue-clipboard2'
import '@/assets/css/global.css'
import toaster from "@/plugins/toaster";

import "@/assets/css/font.css"

// STYLES
import '@/styles/main.scss'


const options = {
  // You can set your default options here
};

import _ from 'lodash'
Vue.prototype._ = _

import moment from 'moment'
moment.locale(i18n.locale)
Vue.prototype.moment = moment

Vue.use(Toast, options);
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
Vue.use(toaster)
Vue.use(VueTransmit)

Vue.component(VImageInput.name, VImageInput);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
