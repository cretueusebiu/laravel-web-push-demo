<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index');

// Notifications
Route::post('web-push/notifications', 'NotificationsController@store');
Route::get('web-push/notifications', 'NotificationsController@index');
Route::get('web-push/notifications/last', 'NotificationsController@last');
Route::patch('web-push/notifications/{id}/read', 'NotificationsController@markRead');
Route::post('web-push/notifications/mark-all-read', 'NotificationsController@markAllRead');
Route::post('web-push/notifications/{id}/dismiss', 'NotificationsController@dismiss');

// Push Subscriptions
Route::post('web-push/subscriptions', 'PushSubscriptionsController@update');
Route::post('web-push/subscriptions/delete', 'PushSubscriptionsController@destroy');

// Manifest file
Route::get('manifest.json', function () {
    return [
        'name' => config('app.name'),
        'gcm_sender_id' => config('services.gcm.sender_id')
    ];
});
