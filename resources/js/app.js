import './bootstrap'
import Vue from 'vue'

import NotificationsDemo from './components/NotificationsDemo.vue'
import NotificationsDropdown from './components/NotificationsDropdown.vue'

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',

  components: {
    NotificationsDemo,
    NotificationsDropdown
  }
})
