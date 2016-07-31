<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\NotificationRead;
use App\WebPush\PushSubscription;
use App\Events\NotificationCreated;
use App\Events\NotificationReadAll;
use App\Notifications\HelloNotification;

class NotificationsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except('last', 'dismiss');
    }

    /**
     * Get user's notifications.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $relation = $request->user()->notifications();

        $total = $relation->where('read', false)->count('id');

        $notifications = $relation->where('read', false)
            ->orderBy('id', 'desc')
            ->limit((int) $request->limit)
            ->get()
            ->each(function ($n) {
                $n->created = $n->created_at->toIso8601String();
            });

        return compact('total', 'notifications');
    }

    /**
     * Create a new notification.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Create the notification instance.
        $notification = new HelloNotification();
        $notification->message();

        // Manualy save the notification to database.
        $model = $this->saveToDatabase($notification);

        // Set the id of the notification model.
        $notification->id = $model->id;

        // Notify the user.
        auth()->user()->notify($notification);

        // Broadcast event.
        event(new NotificationCreated($model));

        return response()->json($model, 201);
    }

    /**
     * Save the given notification instance to database.
     *
     * @param  \Illuminate\Notifications\Notification $notification
     * @return \Illuminate\Notifications\DatabaseNotification
     */
    protected function saveToDatabase($notification)
    {
        return auth()->user()->notifications()->create([
            'subject' => $notification->subject,
            'level' => $notification->level,
            'intro' => $notification->introLines,
            'outro' => $notification->outroLines,
            'action_text' => $notification->actionText,
            'action_url' => $notification->actionUrl,
            'read' => false,
        ]);
    }

    /**
     * Mark user's notification as read.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function markRead(Request $request, $id)
    {
        $notification = $request->user()
                                ->notifications()
                                ->where('id', $id)
                                ->first();

        if (is_null($notification)) {
            return response()->json('Notification not found.', 404);
        }

        $notification->update(['read' => true]);

        event(new NotificationRead($request->user()->id, $id));
    }

    /**
     * Mark all user's notifications as read.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function markAllRead(Request $request)
    {
        $request->user()
                ->notifications()
                ->where('read', false)
                ->update(['read' => true]);

        event(new NotificationReadAll($request->user()->id));
    }

    /**
     * Get user's last notification from database.
     *
     * This method will be accessed by the service worker
     * so the user is not authenticated and it requires an endpoint.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function last(Request $request)
    {
        if (empty($request->endpoint)) {
            return response()->json('Endpoint missing.', 403);
        }

        $subscription = PushSubscription::findByEndpoint($request->endpoint);
        if (is_null($subscription)) {
            return response()->json('Subscription not found.', 404);
        }

        $notification = $subscription->user->notifications()
                            ->orderBy('id', 'desc')->first();

        if (is_null($notification)) {
            return response()->json('Notification not found.', 404);
        }

        return $this->payload($notification);
    }

    /**
     * Mark the notification as read and dismiss it from other devices.
     *
     * This method will be accessed by the service worker
     * so the user is not authenticated and it requires an endpoint.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function dismiss(Request $request, $id)
    {
        if (empty($request->endpoint)) {
            return response()->json('Endpoint missing.', 403);
        }

        $subscription = PushSubscription::findByEndpoint($request->endpoint);
        if (is_null($subscription)) {
            return response()->json('Subscription not found.', 404);
        }

        $notification = $subscription->user->notifications()
                                    ->where('id', $id)->first();

        $notification->update(['read' => true]);

        if (is_null($notification)) {
            return response()->json('Notification not found.', 404);
        }

        event(new NotificationRead($subscription->user->id, $id));
    }

    /**
     * Get the payload for the given notification.
     *
     * @param  \Illuminate\Notifications\DatabaseNotification $notification
     * @return string
     */
    protected function payload($notification)
    {
        $payload = [
            'title' => $notification->subject,
            'body' => $this->format($notification),
            'actionText' => $notification->action_text ?: null,
            'actionUrl' => $notification->action_url ?: null,
            'id' => isset($notification->id) ? $notification->id : null,
        ];

        return json_encode($payload);
    }

    /**
     * Format the given notification.
     *
     * @param  \Illuminate\Notifications\DatabaseNotification $notification
     * @return string
     */
    protected function format($notification)
    {
        $message = trim(implode(PHP_EOL.PHP_EOL, $notification->intro));
        $message .= PHP_EOL.PHP_EOL.trim(implode(PHP_EOL.PHP_EOL, $notification->outro));

        return trim($message);
    }
}
