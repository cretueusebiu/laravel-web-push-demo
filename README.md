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
    - (optional) Set `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET` from [Pusher](https://pusher.com/)
- `php artisan migrate`
- (optional) `npm install` / `yarn` && `npm run dev`

## Browser Compatibility

The [Push API](https://developer.mozilla.org/en/docs/Web/API/Push_API) currently works on Chrome and Firefox. Some features like the notification close event only works on Chrome. 

## Known Issues

- If you use [Laravel Valet](https://github.com/laravel/valet) for your local development the service worker might not start because of the self signed certificate. At least that happened to me on Windows, so I had to use Apache.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.
