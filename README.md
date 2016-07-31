# Laravel Web Push Notifications Demo

> A demo showcasing the new [Notifications](https://github.com/laravel/framework/tree/5.3/src/Illuminate/Notifications) and [Echo](https://github.com/laravel/echo) features from [Laravel 5.3](https://mattstauffer.co/blog/series/new-features-in-laravel-5-3).

![Demo](http://i.imgur.com/3QmEeVl.gif)

## Installation

- `git clone https://github.com/cretueusebiu/laravel-web-push-demo.git`
- `cd laravel-web-push-demo`
- `composer install`
- `php artisan key:generate`
- `cp .env.example .env`
- Edit `.env` 
    - Set your database connection details
    - Set `GCM_KEY` and `GCM_SENDER_ID` from [Google Console](https://console.cloud.google.com)
    - Set `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET` from [Pusher](https://pusher.com/)
- `php artisan migrate`
- (optional) `npm install && gulp`

## Browser compatibility

The Push API currently works on Chrome and Firefox. Some features like the notification close event only works on Chrome. 
