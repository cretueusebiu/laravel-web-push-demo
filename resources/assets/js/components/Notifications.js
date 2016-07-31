//https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications

export default {
    data() {
        return {
            loading: false,
            isPushEnabled: false,
            pushButtonDisabled: true
        }
    },

    ready() {
        this.registerServiceWorker();
    },

    methods: {
        /**
         * Register the service worker.
         */
        registerServiceWorker() {
            if (!('serviceWorker' in navigator)) {
                console.log('Service workers aren\'t supported in this browser.');
                return;
            }

            navigator.serviceWorker.register('/sw.js').then(() => this.initialise());
        },

        initialise() {
            if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
                console.log('Notifications aren\'t supported.');
                return;
            }

            if (Notification.permission === 'denied') {
                console.log('The user has blocked notifications.');
                return;
            }

            if (!('PushManager' in window)) {
                console.log('Push messaging isn\'t supported.');
                return;
            }

            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription()
                    .then((subscription) => {
                        this.pushButtonDisabled = false;

                        if (!subscription) {
                            return;
                        }

                        this.updateSubscription(subscription);

                        this.isPushEnabled = true;
                    })
                    .catch((err) => {
                        console.log('Error during getSubscription()', err);
                    });
            });
        },

        /**
         * Subscribe for push notifications.
         */
        subscribe() {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.subscribe({userVisibleOnly: true})
                    .then((subscription) => {
                        this.isPushEnabled = true;
                        this.pushButtonDisabled = false;

                        this.updateSubscription(subscription);
                    })
                    .catch((e) => {
                        if (Notification.permission === 'denied') {
                            console.log('Permission for Notifications was denied');
                            this.pushButtonDisabled = true;
                        } else {
                            console.log('Unable to subscribe to push.', e);
                            this.pushButtonDisabled = false;
                        }
                    });
            });
        },

        /**
         * Unsubscribe from push notifications.
         */
        unsubscribe() {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((subscription) => {
                    if (! subscription) {
                        this.isPushEnabled = false;
                        this.pushButtonDisabled = false;
                        return;
                    }

                    subscription.unsubscribe().then(() => {
                        this.deleteSubscription(subscription);

                        this.isPushEnabled = false;
                        this.pushButtonDisabled = false;
                    }).catch((e) => {
                        console.log('Unsubscription error: ', e);
                        this.pushButtonDisabled = false;
                    });
                }).catch((e) => {
                    console.log('Error thrown while unsubscribing.', e);
                });
            });
        },

        /**
         * Toggle push notifications subscription.
         */
        togglePush() {
            if (this.isPushEnabled) {
                this.unsubscribe();
            } else {
                this.subscribe();
            }
        },

        /**
         * Send a request to the server to update user's subscription.
         *
         * @param {PushSubscription} subscription
         */
        updateSubscription(subscription) {
            const key = subscription.getKey('p256dh');
            const token = subscription.getKey('auth');

            const data = {
                endpoint: subscription.endpoint,
                key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                token: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null
            }

            this.loading = true;

            this.$http.post('/web-push/subscriptions', data)
                .then(() => this.loading = false)
        },

        /**
         * Send a requst to the server to delete user's subscription.
         *
         * @param {PushSubscription} subscription
         */
        deleteSubscription(subscription) {
            this.loading = true;

            this.$http.post('/web-push/subscriptions/delete', {endpoint: subscription.endpoint})
                .then(() => this.loading = false)
        },

        /**
         * Send a request to the server for a push notification.
         */
        sendNotification() {
            this.loading = true;

            this.$http.post('/web-push/notifications')
                .catch((response) => {
                    console.log(response);
                })
                .then(() => this.loading = false);
        }
    }
}
