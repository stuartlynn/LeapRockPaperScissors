
LeapListener   = require('models/LeapListener')
RockPaperScissorsController = require('controllers/RockPaperScissorsController')

class App extends Spine.Controller
  constructor: ->
    super
    
    LeapListener.setup('ws://localhost:6437')
    RPSC = new RockPaperScissorsController()
    @append RPSC
  

module.exports = App
