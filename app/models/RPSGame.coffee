class RPSGame
	choices : 
		rock :
			name 	: 'rock'
			beats : ["scissors"] 
			image : 'images/rock.png'
		paper: 
			name  : 'paper'
			beats : ["rock"]
			image : 'images/paper.png'
		scissors: 
			name  : 'scissors'
			beats : ['paper']
			image : 'images/scissors.png'


	constructor:->
		@p1Score  = 100
		@p2Score  = 100

	randomChoice:->
		keys  =  (key for key,val of @choices)
		result = keys[Math.floor(Math.random()*keys.length)]
		@choices[result]

	selectLooser:(choice1, choice2)->
		console.log "choicees ",choice1, choice2
		if choice1 == choice2
			'stalemate'
		else if @choices[choice1].beats.indexOf(choice2) != -1 
			@p2Score -= 10
			"player2"
		else
			@p1Score -= 10
			"player1"

	winner:=>
		if @p1Score <= 0
			'player2'
		else if @p2Score <= 0
			'player1'
		else
			null


	recognise:(details)=>

		if details.pointables.length == 2
			@choices.scissors
		else if details.pointables.length > 2
			@choices.paper
		else if details.hands.length == 1 and details.hands[0].sphereRadius < 100
			@choices.rock
		else
			null





module.exports = RPSGame