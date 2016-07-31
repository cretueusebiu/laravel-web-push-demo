<?php

namespace App\WebPush;

use App\WebPush\WebPushChannel;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Notification;

class WebPushServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        Notification::extend('webpush', function () {
            $key = config('services.gcm.key');

            return new WebPushChannel($key);
        });
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
