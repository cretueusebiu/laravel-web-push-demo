import Vue from 'vue'
import $ from 'jquery'
import axios from 'axios'
import Echo from 'laravel-echo'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  locale: 'en-US',
  locales: { 'en-US': require('json-loader!vue-timeago/locales/en-US.json') }
})

window.Vue = Vue
window.jQuery = window.$ = $
require('bootstrap-sass/assets/javascripts/bootstrap')

// Configure Laravel Echo
const { key, cluster } = window.PUSHER_OPTIONS
if (key) {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: key,
    cluster: cluster
  })
}

axios.interceptors.request.use(
  config => {
    config.headers['X-Socket-ID'] = window.Echo.socketId()
    return config
  },
  error => Promise.reject(error)
)
