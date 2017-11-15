import './bootstrap'
import Vue from 'vue'

import NotificationsDemo from './components/NotificationsDemo'
import NotificationsDropdown from './components/NotificationsDropdown'

new Vue({
  el: '#app',

  components: {
    NotificationsDemo,
    NotificationsDropdown
  }
})
