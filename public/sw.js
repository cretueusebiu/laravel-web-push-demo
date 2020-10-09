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

      if (event && event.data) {
        self.pushData = event.data.json();
        if (self.pushData) {
          event.waitUntil(self.registration.showNotification(self.pushData.title, {
            body: self.pushData.body,
            icon: self.pushData.data ? self.pushData.data.icon : null
          }).then(_=> {
            clients.matchAll({type: 'window'}).then((clientList) => {
              if (clientList.length > 0) {
                console.log('the data', self.pushData)
                this.messageToClient(clientList[0], self.pushData)
                //   // message: self.pushData.body // suppose it is: "Hello World !"
                //   message: self.pushData // suppose it is: "Hello World !"
                // });
              }
            });
          }));
        }
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData
      // if (event.data) {
      //   event.waitUntil(
      //     this.sendNotification(event.data.json())
      //   )
      //   .then(function() {
      //       console.log('notificationPush @then')
      //       clients.matchAll({type: 'window'}).then(function (clientList) {
      //       if (clientList.length > 0) {
      //         this.messageToClient(clientList[0], {
      //           message: self.pushData.body // suppose it is: "Hello World !"
      //         })
      //       }
      //     })
      //   })
      // }
    },

    /**
     * Handle notification click event.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/notificationclick
     *
     * @param {NotificationEvent} event
     */
    notificationClick (event) {
      console.log(event.notification)

      if (event.action === 'some_action') {
        // Do something...
        console.log('at action')
      } else {
        self.clients.openWindow('/')
      }
    },

    /**
     * Handle notification close event (Chrome 50+, Firefox 55+).
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/onnotificationclose
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
     * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
     *
     * @param {PushMessageData|Object} data
     */
    sendNotification (data) {
      console.log('sendNotification', data)
      return self.registration.showNotification(data.title, data)
    },

    /**
     * Send request to server to dismiss a notification.
     *
     * @param  {NotificationEvent} event
     * @param  {String} subscription.endpoint
     * @return {Response}
     */
    dismissNotification ({ notification }, { endpoint }) {
      if (!notification.data || !notification.data.id) {
        return
      }

      const data = new FormData()
      data.append('endpoint', endpoint)

      // Send a request to the server to mark the notification as read.
      fetch(`/notifications/${notification.data.id}/dismiss`, {
        method: 'POST',
        body: data
      })
    },

    // send to client test
    messageToClient(client, data) {
      console.log('messageToClient', client, data)
      return new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (event) => {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };

        // client.postMessage(JSON.stringify(data), [channel.port2]);
        client.postMessage(data, [channel.port2]);
      });
    }
  }

  WebPush.init()
})()
