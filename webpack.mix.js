const mix = require('laravel-mix')

mix.js('resources/js/app.js', 'public/js')
  .vue()
  .sass('resources/sass/app.scss', 'public/css')

mix.disableNotifications()

mix.options({
  terser: {
    extractComments: false
  }
})
