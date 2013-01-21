LeapListener = require('models/LeapListener')

class WWTController extends Spine.Controller         

  constructor:->
    super
    @render()
    @delay =>
      @bShowCrosshairs = true
      @bShowUI = false
      @bShowFigures = false
      @showBoundries = false
      @wwt = wwtlib.WWTControl.initControl("WWTCanvas")
      @wwt.add_ready @wwtReady

    
    , 200

    @zooming = false 
    @panning = false 

    LeapListener.onAnything @processLeapEvent

  processLeapEvent:(data)=>
    fingers = data.pointables
    hands   = data.hands

    # console.log hands[0].sphereRadius

    # if hands.length == 1 
    #   # if hands.sphereRadius > 200
    #   # console.log hands[0]
    #   ra = Math.acos( hands[0].palmNormal[2])
    #   dec = Math.asin( hands[0].palmNormal[1] / hands[0].palmNormal[0])
    #   console.log ra, dec,  hands[0].palmNormal[1] / hands[0].palmNormal[0]
    #   if @wwt?
    #     @wwt.gotoRaDecZoom(ra,dec, @wwt.get_fov(), true)

    if fingers.length == 2 and @zooming == false 
      @zoomStartLength = LeapListener.pointDistance(fingers[0], fingers[1])
      @fovStartLength  = @wwt.get_fov()
      # console.log "starting", @zoomStartLength , @fovStartLength
      @zooming = true
      @panning = false

    else if fingers.length == 2 and @zooming == true
      currentZoomLength = LeapListener.pointDistance(fingers[0], fingers[1])
      # console.log "current zoom ",currentZoomLength
      newFOV = @fovStartLength * (@zoomStartLength/currentZoomLength)

      ra =  @wwt.getRA()
      dec = @wwt.getDec()
      # console.log newFOV
      @wwt.gotoRaDecZoom(ra,dec, newFOV, true)
    
    else if fingers.length == 1 and @panning==false 
      @startRa = @wwt.getRA()
      @startDec= @wwt.getDec()
      @startX  = fingers[0].tipPosition[0]
      @startY  = fingers[0].tipPosition[1]
      @panning = true
      @zooming = false 

    else if fingers.length == 1 and @panning==true 
      currentX = fingers[0].tipPosition[0]
      currentY = fingers[0].tipPosition[1]

      newRA  = @startRa  - (currentX - @startX)*@wwt.get_fov()/80.0
      newDec = @startDec - (currentY - @startY)*@wwt.get_fov()/80.0
      console.log newRA, newDec
      @wwt.gotoRaDecZoom(newRA,newDec, @wwt.get_fov(), true)

    else if fingers.length==0
      @zooming = false
      @panning = false 


  render:=>
    @html require('views/wwt')

  wwtReady:=>
    @initForWwt();
 
  initForWwt:=>
    @wwt.loadImageCollection("http://www.worldwidetelescope.org/COMPLETE/wwtcomplete.wtml")
    @wwt.settings.set_showCrosshairs(@bShowCrosshairs)
    @wwt.settings.set_showConstellationFigures(@bShowFigures)
    @wwt.settings.set_showConstellationBoundries(@showBoundries)
    @wwt.hideUI(!@bShowUI)
    
  toggleSetting:(text)=>
    switch text
      when 'ShowUI'
        @bShowUI = !@bShowUI
        @wwt.hideUI(!@bShowUI)
        @wwt.set_showExplorerUI(@bShowUI)
                    
      when 'ShowCrosshairs'
        @bShowCrosshairs = !@bShowCrosshairs
        @wwt.settings.set_showCrosshairs(@bShowCrosshairs)
                    
      when 'ShowFigures'
        @bShowFigures = !@bShowFigures;
        @wwt.settings.set_showConstellationFigures(@bShowFigures);
        
 
    GotoConstellation:(text)=>
      switch text
        when 'Sagittarius'
          @wwt.gotoRaDecZoom(286.485, -27.5231666666667, 60, false)
                    
        when 'Aquarius'
          @wwt.gotoRaDecZoom(334.345, -9.21083333333333, 60, false)

module.exports = WWTController