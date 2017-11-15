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
    - (optional) Set `GCM_KEY` and `GCM_SENDER_ID` from [Google Console](https://console.cloud.google.com)
    - (optional) Set `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET` from [Pusher](https://pusher.com/)
- `php artisan migrate`
- `php artisan webpush:vapid` - Generates the VAPID keys required for browser authentication.
- (optional) `npm install` or `yarn` and `npm run dev`

## Browser Compatibility

The [Push API](https://developer.mozilla.org/en/docs/Web/API/Push_API) currently works on Chrome and Firefox.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.
