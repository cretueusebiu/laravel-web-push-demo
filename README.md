# Laravel Web Push Notifications Demo

> A demo for the Laravel [Web Push](https://github.com/laravel-notification-channels/webpush) notification channel. 

![Demo](http://i.imgur.com/3QmEeVl.gif)

## Installation

- `git clone https://github.com/cretueusebiu/laravel-web-push-demo.git`
- `cd laravel-web-push-demo`
- `cp .env.example .env`
- `composer install`
- `php artisan key:generate`
- Edit `.env` 
    - Set your database connection details
    - Set `GCM_KEY` and `GCM_SENDER_ID` from [Google Console](https://console.cloud.google.com)
    - (optional) Set `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET` from [Pusher](https://pusher.com/)
- `php artisan migrate`
- (optional) `npm install && gulp`

## Browser compatibility

The Push API currently works on Chrome and Firefox. Some features like the notification close event only works on Chrome. 
