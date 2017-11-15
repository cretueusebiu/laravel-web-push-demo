<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index');

// Notifications
Route::post('notifications', 'NotificationController@store');
Route::get('notifications', 'NotificationController@index');
Route::patch('notifications/{id}/read', 'NotificationController@markAsRead');
Route::post('notifications/mark-all-read', 'NotificationController@markAllRead');
Route::post('notifications/{id}/dismiss', 'NotificationController@dismiss');

// Push Subscriptions
Route::post('subscriptions', 'PushSubscriptionController@update');
Route::post('subscriptions/delete', 'PushSubscriptionController@destroy');

// Manifest file (optional if VAPID is used)
Route::get('manifest.json', function () {
    return [
        'name' => config('app.name'),
        'gcm_sender_id' => config('webpush.gcm.sender_id')
    ];
});
