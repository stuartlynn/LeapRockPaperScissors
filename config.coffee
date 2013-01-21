exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor/spine.js': /^vendor\/scripts\/spine/
        'javascripts/vendor/common.js': /^vendor\/scripts\/common/
      order:
        before: [
          'vendor/scripts/spine/spine.js',
          'vendor/scripts/spine/lib/ajax.js',
          'vendor/scripts/spine/lib/local.js',
          'vendor/scripts/spine/lib/manager.js',
          'vendor/scripts/spine/lib/route.js',
          'vendor/scripts/spine/lib/tmpl.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'stylesheets/app.css'
      order:
        before: ['vendor/styles/normalize.css']
        after: ['vendor/styles/helpers.css']
    templates:
      defaultExtension: 'eco'
      joinTo : "javascripts/app.js"
