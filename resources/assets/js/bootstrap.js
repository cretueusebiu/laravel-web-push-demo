import Vue from 'vue'
import $ from 'jquery'
import Echo from 'laravel-echo'
import VueTimeago from 'vue-timeago'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.use(VueTimeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('json!vue-timeago/locales/en-US.json')
  }
})

window.Vue = Vue
window.jQuery = window.$ = $
require('bootstrap-sass/assets/javascripts/bootstrap')

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: window.PUSHER_OPTIONS.key,
  cluster: window.PUSHER_OPTIONS.cluster
})

Vue.http.interceptors.push((request, next) => {
  request.headers['X-CSRF-TOKEN'] = window.Laravel.csrfToken

  request.headers['X-Socket-ID'] = window.Echo.socketId()

  next()
})
