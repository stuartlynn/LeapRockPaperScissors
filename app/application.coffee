WWTController  = require('controllers/WWTController')
LeapListener   = require('models/LeapListener')
class App extends Spine.Controller
  constructor: ->
    super
    LeapListener.setup('ws://localhost:6437')

    @append new WWTController()

module.exports = App
