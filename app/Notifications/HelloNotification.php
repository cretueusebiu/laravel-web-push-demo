<?php

namespace App\Notifications;

use Faker\Factory;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class HelloNotification extends Notification
{
    // use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        $faker = Factory::create();

        $this->subject('Hello from Laravel!')
             ->line($faker->realText(50))
             ->action('Go Home', url('/home'));
    }

    /**
     * Get the notification channels.
     *
     * @param  mixed $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['webpush'];
    }

    /**
     * Get the notification message.
     *
     * @return void
     */
    public function message()
    {
        // $this->subject('Hello from Laravel!')
        //     ->line('Thank you for using our application!')
        //     ->action('Notification Action', url('/home'));
    }
}
