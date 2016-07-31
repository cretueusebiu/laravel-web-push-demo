/*global clients*/

(function () {
    'use strict';

    const WebPush = {
        init() {
            self.addEventListener('push', this.notificationPush.bind(this));
            self.addEventListener('notificationclick', this.notificationClick.bind(this));
            self.addEventListener('notificationclose', this.notificationClose.bind(this));
        },

        /**
         * Notification push event.
         * https://developer.mozilla.org/en-US/docs/Web/Events/push
         *
         * @param {NotificationEvent} event
         */
        notificationPush(event) {
            if (!(self.Notification && self.Notification.permission === 'granted')) {
                return;
            }

            // Check if the notification has a payload.
            if (event.data) {
                event.waitUntil(
                    this.sendNotification(event.data.json())
                );
            }
            // Otherwise just fetch the last notification from the server.
            else {
                event.waitUntil(
                    self.registration.pushManager.getSubscription().then((subscription) => {
                        if (subscription) {
                            return this.fetchNofication(subscription);
                        }
                    })
                );
            }
        },

        /**
         * Notification click event.
         * https://developer.mozilla.org/en-US/docs/Web/Events/notificationclick
         *
         * @param {NotificationEvent} event
         */
        notificationClick(event) {
            event.waitUntil(
                clients.matchAll({type: 'window'}).then((clientList) => {
                    let client;

                    for (let i = 0; i < clientList.length; i++) {
                        client = clientList[i];

                        // if (client.url.search(/notifications/i) >= 0 && 'focus' in client) {
                        //     return client.focus();
                        // }
                    }

                    if (clientList.length && 'focus' in client) {
                        return client.focus();
                    }

                    if (clients.openWindow) {
                        return clients.openWindow(event.notification.data.actionUrl);
                    }
                })
            );
        },

        /**
         * Notification close event (Chrome 50+).
         * https://developers.google.com/web/updates/2016/03/notifications?hl=en
         *
         * @param {NotificationEvent} event
         */
        notificationClose(event) {
            self.registration.pushManager.getSubscription().then((subscription) => {
                if (subscription) {
                    this.dismissNotification(event, subscription);
                }
            })
        },

        /**
         * Send notification to the user.
         *
         * @param {PushMessageData|Object} data
         */
        sendNotification(data) {
            const actions = [];

            if (data.actionText) {
                actions.push({
                    title: data.actionText,
                    action: 'default'
                });
            }

            return self.registration.showNotification(data.title, {
                body: data.body,
                icon: data.icon || '/notification-icon.png',
                data: data,
                actions: actions
            });
        },

        /**
         * Fetch the last notification from the server.
         *
         * @param  {String} subscription.endpoint
         * @return {Response}
         */
        fetchNofication({endpoint}) {
            return fetch(`/web-push/notifications/last?endpoint=${encodeURIComponent(endpoint)}`).then((response) => {
                if (response.status !== 200) {
                    throw new Error();
                }

                return response.json().then((data) => {
                    return this.sendNotification(data);
                });
            });
        },

        /**
         * Send request to server to dismiss a notification.
         *
         * @param {NotificationEvent} event
         * @param  {String} subscription.endpoint
         * @return {Response}
         */
        dismissNotification({notification}, {endpoint}) {
            const data = new FormData;
            data.append('endpoint', endpoint);

            fetch(`/web-push/notifications/${notification.data.id}/dismiss`, {
                method: 'POST',
                body: data
            });
        }
    }

    WebPush.init();
})();
