<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Validation\ValidatesRequests;

class PushSubscriptionsController extends Controller
{
    use ValidatesRequests;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Update user's subscription.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $this->validate($request, ['endpoint' => 'required']);

        $request->user()->updatePushSubscription(
            $request->endpoint,
            $request->key,
            $request->token
        );
    }

    /**
     * Delete the specified subscription.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $this->validate($request, ['endpoint' => 'required']);

        $request->user()->deleteSubscription($request->endpoint);

        return response()->json(null, 204);
    }
}
