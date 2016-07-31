<template>
    <li class="notification">
        <div class="media">
            <div class="media-left">
                <div class="media-object">
                    <img src="/notification-icon.png">
                </div>
            </div>

            <div class="media-body">
                <a href="#" @click.prevent="markAsRead" class="notification-mark-read" title="Mark as read">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </a>

                <strong class="notification-title">
                    <a :href="notification.action_url">{{ notification.subject }}</a>
                </strong>

                <p class="notification-desc">
                    {{ notification.intro.join('') }}
                </p>

                <!-- <div class="notification-action" v-if="notification.action_url">
                    <a :href="notification.action_url" class="btn btn-primary btn-sm">{{ notification.action_text }}</a>
                </div> -->

                <div class="notification-meta">
                    <small class="timestamp">
                        <timeago :since="notification.created" :auto-update="30"></timeago>
                        <!-- <time v-el:time :datetime="notification.created" :title="notification.created"></time> -->
                    </small>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
    export default {
        props: ['notification'],

        methods: {
            markAsRead() {
                this.$dispatch('notification.read', this.notification);
            }
        }
    }
</script>
