(() => {
  'use strict'

  const WebPush = {
    init () {
      self.addEventListener('push', this.notificationPush.bind(this))
      self.addEventListener('notificationclick', this.notificationClick.bind(this))
      self.addEventListener('notificationclose', this.notificationClose.bind(this))
    },

    /**
     * Handle notification push event.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/push
     *
     * @param {NotificationEvent} event
     */
    notificationPush (event) {
      if (!(self.Notification && self.Notification.permission === 'granted')) {
        return
      }

      // Check if the notification has a payload.
      if (event.data) {
        event.waitUntil(
            this.sendNotification(event.data.json())
        )
      } else {
      // Otherwise just fetch the last notification from the server.
        event.waitUntil(
          self.registration.pushManager.getSubscription().then(subscription => {
            if (subscription) {
              return this.fetchNofication(subscription)
            }
          })
        )
      }
    },

    /**
     * Handle notification click event.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/notificationclick
     *
     * @param {NotificationEvent} event
     */
    notificationClick (event) {
      // const data = event.notification.data

      if (event.action === 'open') {
        self.clients.openWindow('/')
      } else if (event.action === 'other') {
        //
      } else {
        self.clients.openWindow('/')
      }
    },

    /**
     * Handle notification close event (Chrome 50+).
     *
     * https://developers.google.com/web/updates/2016/03/notifications?hl=en
     *
     * @param {NotificationEvent} event
     */
    notificationClose (event) {
      self.registration.pushManager.getSubscription().then(subscription => {
        if (subscription) {
          this.dismissNotification(event, subscription)
        }
      })
    },

    /**
     * Send notification to the user.
     *
     * @param {PushMessageData|Object} data
     */
    sendNotification (data) {
      return self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/notification-icon.png',
        data: data,
        actions: data.actions || []
      })
    },

    /**
     * Fetch the last notification from the server.
     *
     * @param  {String} subscription.endpoint
     * @return {Response}
     */
    fetchNofication ({ endpoint }) {
      return fetch(`/notifications/last?endpoint=${encodeURIComponent(endpoint)}`).then(response => {
        if (response.status !== 200) {
          throw new Error()
        }

        return response.json().then(data => {
          return this.sendNotification(data)
        })
      })
    },

    /**
     * Send request to server to dismiss a notification.
     *
     * @param  {NotificationEvent} event
     * @param  {String} subscription.endpoint
     * @return {Response}
     */
    dismissNotification ({ notification }, { endpoint }) {
      if (!notification.data.id) {
        return
      }

      const data = new FormData()
      data.append('endpoint', endpoint)

      // Send a request to the server to mark the notification as read.
      fetch(`/notifications/${notification.data.id}/dismiss`, {
        method: 'POST',
        body: data
      })
    }
  }

  WebPush.init()
})()
