class LeapListener
	
	@fingerCallbacks : []
	@handCallbacks : []
	@anythingCallbacks: []

	@setup:(url)->
		console.log "connecting"
		ws  = new WebSocket(url)
		counter= 0 

		ws.onmessage  = (e)=>	
			data= JSON.parse(e.data)
			counter += 1
			# if data.pointables? and data.pointables.length > 0
			cb(data.pointables) for cb in @fingerCallbacks 

			# if data.hands? and data.hands.lenth > 0
			cb(data.hands) for cb in @handCallbacks
			cb(data) for cb in @anythingCallbacks

	@onFingers:(cb)->
		@fingerCallbacks.push cb

	@onAnything:(cb)->
		@anythingCallbacks.push cb

	@onHands:(cb)->
		@handCallbacks.push cb

	@pointDistance:(finger1,finger2)=>
		tip1 = finger1.tipPosition
		tip2 = finger2.tipPosition
		dx = (tip1[0]-tip2[0])
		dy = (tip1[1]-tip2[1])
		dz = (tip1[2]-tip2[2])
		Math.sqrt( dx*dx + dy*dy + dz*dz )

module.exports = LeapListener