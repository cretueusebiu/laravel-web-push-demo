<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PushSubscriptionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

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

Route::get('/home', [HomeController::class, 'index']);

// Notifications
Route::post('notifications', [NotificationController::class, 'store']);
Route::get('notifications', [NotificationController::class, 'index']);
Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
Route::post('notifications/{id}/dismiss', [NotificationController::class, 'dismiss']);

// Push Subscriptions
Route::post('subscriptions', [PushSubscriptionController::class, 'update']);
Route::post('subscriptions/delete', [PushSubscriptionController::class, 'destroy']);

// Manifest file (optional if VAPID is used)
Route::get('manifest.json', function () {
    return [
        'name' => config('app.name'),
        'gcm_sender_id' => config('webpush.gcm.sender_id'),
    ];
});
