<template>
  <li class="dropdown dropdown-notifications" v-el:dropdown>
    <a href="#" @click.prevent="toggleDropdown" class="dropdown-toggle">
      <i data-count="{{ total }}" class="fa fa-bell notification-icon" :class="{'hide-count': !hasUnread}"></i>
    </a>

    <div class="dropdown-container">
      <div class="dropdown-toolbar">
        <div v-show="hasUnread" class="dropdown-toolbar-actions">
          <a href="#" @click.prevent="markAllRead">Mark all as read</a>
        </div>

        <h3 class="dropdown-toolbar-title">Notifications ({{ total }})</h3>
      </div>

      <ul class="dropdown-menu">
        <notification v-for="notification in notifications" :notification="notification"></notification>

        <li v-if="!hasUnread" class="notification">
            You don't have any unread notifications.
        </li>
      </ul>

      <div v-if="hasUnread" class="dropdown-footer text-center">
        <a href="#" @click.prevent="fetchAll">View All</a>
      </div>
    </div>
  </li>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import Notification from './Notification.vue'

export default {
  components: {Notification},

  data() {
    return {
      total: 0,
      notifications: []
    }
  },

  // mounted()
  ready() {
    this.fetch()

    if (window.Echo) {
      this.listen()
    }

    this.initDropdown()
  },

  events: {
    'notification.read': function (notification) {
      this.total--
      this.notifications.$remove(notification)
      this.$http.patch(`/notifications/${notification.id}/read`)
    }
  },

  computed: {
    hasUnread() {
      return this.total > 0
    }
  },

  methods: {
    listen() {
      window.Echo.private(`App.User.${window.USER.id}`)
        .notification(notification => {
          this.total++
          this.notifications.unshift(notification)
        })
        .listen('NotificationRead', ({notificationId}) => {
          this.total--
          this.notifications = _.reject(this.notifications, (n) => n.id == notificationId)
        })
        .listen('NotificationReadAll', () => {
          this.total = 0
          this.notifications = []
        });
    },

    fetch(limit = 5) {
      this.$http.get('/notifications', {params: {limit: limit}})
          .then(({data}) => {
            this.total = data.total
            this.notifications = data.notifications.map(({id, data, created}) => {
              return {
                id: id,
                title: data.title,
                body: data.body,
                action_url: data.action_url,
                created: created
              }
            })
          })
    },

    fetchAll() {
      this.fetch(null)
    },

    markAllRead() {
      this.total = 0
      this.notifications = []

      this.$http.post('/notifications/mark-all-read')
    },

    initDropdown() {
      const dropdown = $(this.$els.dropdown)

      $(document).on('click', (e) => {
        if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0
          && !$(e.target).parent().hasClass('notification-mark-read')) {
          dropdown.removeClass('open')
        }
      });
    },

    toggleDropdown() {
      $(this.$els.dropdown).toggleClass('open')
    }
  }
}
</script>
