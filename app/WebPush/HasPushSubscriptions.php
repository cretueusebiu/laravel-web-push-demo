<?php

namespace App\WebPush;

trait HasPushSubscriptions
{
    /**
     * Get the user's push subscriptions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pushSubscriptions()
    {
        return $this->hasMany(PushSubscription::class);
    }

    /**
     * Update user's subscription.
     *
     * @param  string $endpoint
     * @param  string|null $key
     * @param  string|null $token
     * @return \App\WebPush\PushSubscription
     */
    public function updatePushSubscription($endpoint, $key = null, $token = null)
    {
        $subscription = PushSubscription::findByEndpoint($endpoint);

        // Check if a subscription exists for the given endpoint.
        if ($subscription) {
            // If it belongs to a different user then delete it.
            if ((int) $subscription->user_id !== (int) $this->getAuthIdentifier()) {
                $subscription->delete();
            }
            // Otherwise update the key and token.
            else {
                $subscription->public_key = $key;
                $subscription->auth_token = $token;
                $subscription->save();

                return $subscription;
            }
        }

        return $this->pushSubscriptions()->save(new PushSubscription([
            'endpoint' => $endpoint,
            'public_key' => $key,
            'auth_token' => $token,
        ]));
    }

    /**
     * Delete user subscription by endpoint.
     *
     * @param  string $endpoint
     * @return void
     */
    public function deleteSubscription($endpoint)
    {
        $this->pushSubscriptions()
                ->where('endpoint', $endpoint)
                ->delete();
    }

    /**
     * Get user's subscriptions.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function routeNotificationForWebpush()
    {
        return $this->pushSubscriptions;
    }

    /**
     * Get user's last database notification.
     *
     * @return \Illuminate\Notifications\DatabaseNotification|null
     */
    public function lastNotification()
    {
        return $this->notifications()->orderBy('id', 'desc')->first();
    }
}
