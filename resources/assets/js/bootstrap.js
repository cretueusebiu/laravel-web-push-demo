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

const {key, cluster} = window.PUSHER_OPTIONS;
if (key) {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: key,
    cluster: cluster
  })
}

Vue.http.interceptors.push((request, next) => {
  request.headers['X-CSRF-TOKEN'] = window.Laravel.csrfToken

  if (window.Echo) {
    request.headers['X-Socket-ID'] = window.Echo.socketId()
  }

  next()
})
