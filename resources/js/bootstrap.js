import Vue from 'vue'
import $ from 'jquery'
import axios from 'axios'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  locale: 'en-US',
  locales: { 'en-US': require('vue-timeago/locales/en-US.json') }
})

window.Vue = Vue
window.Pusher = Pusher
window.jQuery = window.$ = $

require('bootstrap-sass/assets/javascripts/bootstrap')

const { key, cluster } = window.Laravel.pusher
if (key) {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: key,
    cluster: cluster,
    forceTLS: true
  })

  // axios.interceptors.request.use(
  //   config => {
  //     config.headers['X-Socket-ID'] = window.Echo.socketId()
  //     return config
  //   },
  //   error => Promise.reject(error)
  // )
}

window.axios = axios
