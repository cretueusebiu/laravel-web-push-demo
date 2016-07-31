<?php

namespace App\WebPush;

use Minishlink\WebPush\WebPush;
use Illuminate\Notifications\Notification;

class WebPushChannel
{
    /**
     * The Web Push instance.
     *
     * @var \Minishlink\WebPush\WebPush
     */
    protected $webPush;

    /**
     * Create a new Web Push channel instance.
     *
     * @param  string $key
     * @return void
     */
    public function __construct($key)
    {
        $this->webPush = new WebPush(['GCM' => $key]);
    }

    /**
     * Send the given notification.
     *
     * @param  \Illuminate\Support\Collection $notifiables
     * @param  \Illuminate\Notifications\Notification $notification
     * @return void
     */
    public function send($notifiables, Notification $notification)
    {
        $subs = [];

        foreach ($notifiables as $notifiable) {
            $subscriptions = $notifiable->routeNotificationFor('webpush');

            if ($subscriptions->isEmpty()) {
                continue;
            }

            foreach ($subscriptions as $subscription) {
                $this->webPush->sendNotification(
                    $subscription->endpoint,
                    $this->payload($notification),
                    $subscription->public_key,
                    $subscription->auth_token
                );

                $subs[] = $subscription;
            }
        }

        $response = $this->webPush->flush();

        // Delete the invalid subscriptions.
        if (is_array($response)) {
            foreach ($response as $index => $value) {
                if (! $value['success'] && isset($subs[$index])) {
                    $subs[$index]->delete();
                }
            }
        }
    }

    /**
     * Get the payload for the given notification.
     *
     * @param  \Illuminate\Notifications\Notification $notification
     * @return string
     */
    protected function payload(Notification $notification)
    {
        $payload = [
            'title' => $notification->subject,
            'body' => $this->format($notification),
            'actionText' => $notification->actionText ?: null,
            'actionUrl' => $notification->actionUrl ?: null,
            'id' => isset($notification->id) ? $notification->id : null,
        ];

        return json_encode($payload);
    }

    /**
     * Format the given notification.
     *
     * @param  \Illuminate\Notifications\Notification $notification
     * @return string
     */
    protected function format(Notification $notification)
    {
        $message = trim(implode(PHP_EOL.PHP_EOL, $notification->introLines));

        $message .= PHP_EOL.PHP_EOL.trim(implode(PHP_EOL.PHP_EOL, $notification->outroLines));

        return trim($message);
    }
}
