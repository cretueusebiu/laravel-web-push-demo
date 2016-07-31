<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotificationCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    /**
     * @var \Illuminate\Notifications\DatabaseNotification
     */
    public $notification;

    /**
     * Create a new event instance.
     *
     * @param  \Illuminate\Notifications\DatabaseNotification $notification
     * @return void
     */
    public function __construct(DatabaseNotification $notification)
    {
        $this->notification = $notification;

        // $this->dontBroadcastToCurrentUser();
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['private-user.'.$this->notification->notifiable_id.'.notifications'];
    }
}
