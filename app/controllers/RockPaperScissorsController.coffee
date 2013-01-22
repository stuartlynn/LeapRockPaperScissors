RPSGame        = require('models/RPSGame')
LeapListener = require('models/LeapListener')

class RockPaperScissorsController extends Spine.Controller         
  
  className: "fight"
  elements:
    '.player1 .move img'               : 'player1'
    '.player2 .move img'               : 'player2'
    '.player1 .lifebar .lifebarInner'  : 'player1Lifebar'
    '.player2 .lifebar .lifebarInner'  : 'player2Lifebar'
    '.countdown h1'                    : 'countdown'
    '.countdown '                      : 'countdownOverlay'
    '.player img'                      : 'hands'
    

  events: 
    'click .countdown h1' : 'startGame'
    
  constructor:->
    super 
    @render()
    LeapListener.onAnything @updateMove
    @game = new RPSGame()

  render:=>
    @html require('views/game')

  updateMove:(data)=>
    move = @game.recognise(data)
    if move?
      @move = move
      @player1.attr('src', move.image)

  startGame:=>
    @game =  new RPSGame()
    @updateScore()
    @startCountdown()

  startRound:=>

    $(".player img").removeClass('shake')
    $(".player img").addClass('bounce')
    
    setTimeout =>
      @endRound()
    ,3500

  endRound:=>
    @hands.removeClass('bounce')
    p2Choice =  @game.randomChoice()
    winner = @game.selectLooser @move.name, p2Choice.name
    console.log winner
    if winner?
      $(".#{winner} img").addClass('shake')
    

    @player2.attr("src", p2Choice.image)
    @updateScore()
    if @game.winner()?
      @endGame()
    else 
      setTimeout =>
        @startRound()
      ,200

  updateScore:=>
    @player1Lifebar.css('width', "#{@game.p1Score}%")
    @player2Lifebar.css('width', "#{@game.p2Score}%")

  endGame:=>
    @countdownOverlay.css('display', 'block')
    @countdown.html("Player #{@game.winner()} won!!!!!! Click to restart")

  startCountdown:=>
    setTimeout =>
      @countdown.html("3")
    ,1000

    setTimeout =>
      @countdown.html("2")
    ,2000

    setTimeout =>
      @countdown.html("1")
    ,3000

    setTimeout =>
      @countdown.html("FIGHT!!!!!!")
    ,4000

    setTimeout =>
      @countdownOverlay.css('display', "none")
      @startRound()
    ,5000

    
      



module.exports = RockPaperScissorsController