import './bootstrap';
import Vue from 'vue';
import Notifications from './components/Notifications';
import NotificationsDropdown from './components/NotificationsDropdown.vue';

new Vue({
    el: 'body',

    components: {Notifications, NotificationsDropdown}
});
