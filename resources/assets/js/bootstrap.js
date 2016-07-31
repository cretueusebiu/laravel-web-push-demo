import Vue from 'vue';
import $ from 'jquery';
import _ from 'lodash';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import Cookies from 'js-cookie';
import VueTimeago from 'vue-timeago'
import VueResource from 'vue-resource';

window._ = _;
window.Cookies = Cookies;

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

window.jQuery = window.$ = $;
require('bootstrap-sass/assets/javascripts/bootstrap');

/**
 * Vue is a modern JavaScript for building interactive web interfaces using
 * reacting data binding and reusable components. Vue's API is clean and
 * simple, leaving you to focus only on building your next great idea.
 */

window.Vue = Vue;

Vue.use(VueResource);

Vue.use(VueTimeago, {
    locale: 'en-US',
    locales: {
        'en-US': require('json!vue-timeago/locales/en-US.json')
    }
});

/**
 * Configure Laravel Echo.
 */
window.Pusher = Pusher;

window.echo = new Echo(
    Object.assign({}, {
        connector: 'pusher',
        csrfToken: Cookies.get('XSRF-TOKEN')
    }, window.PUSHER_OPTIONS)
);

/**
 * We'll register a HTTP interceptor to attach the "XSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */

Vue.http.interceptors.push(function (request, next) {
    request.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
    request.headers['X-Socket-Id'] = window.echo.socketId();

    next();
});
