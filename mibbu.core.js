/*global document, setInterval, setTimeout, Image, clearTimeout*/

/**
 * 
 * mibbu - javascript canvas/DOM game framework
 * by Michal Budzynski
 * http://michalbe.blogspot.com
 * http://twitter.com/michalbe
 * 
 */

var mibbu = function(Cwidth, Cheight, _parent){
	var MB_usingCanvas = true,
        MB_elements = [], //all drawable elements
        MB_parentElement = _parent ? document.getElementById(_parent) : document.body,
		MB_mainCanvas,
		MB_mainContext,
		MB_mainCanvasWidth = Cwidth || 400,
		MB_mainCanvasHeight = Cheight || 300,
		MB_addedLoops=[],
		MB_drawIntervalSpeed=1000/33,
		MB_drawLoop,
        MB_lastTime = new Date(),
		MB_fpsMeasure=false,
        MB_additionalElements={},
		MB_collides=[],
		MB_fixedIndexColl = [];
    /**
     * Older browser's fixes
     */
	//IE fix Array.indeOf
    //from 
    //http://michalbe.blogspot.com/2010/04/removing-item-with-given-value-from.html
    if(!Array.indexOf){
        Array.prototype.indexOf = function(obj){
            for(var i=0; i<this.length; i++){
                if(this[i]==obj){
                    return i;
                }
            }
            return -1;
        };
    }


	    
    /**
    * DEBUG FUNCTIONS
    **/
    
    var frameCount=0,
        fps = 0;
    var MeasureFPS = function(){
		var newTime = new Date();
		var diffTime = Math.ceil((newTime.getTime() - MB_lastTime.getTime()));
		
		if (diffTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			MB_lastTime = newTime;
		}
        
        var fpsTemp = fps +'/' + 1/(MB_drawIntervalSpeed/1000);
        if (MB_usingCanvas) {
            MB_mainContext.fillStyle = "#fff";
			MB_mainContext.font = "10px Arial";
			MB_mainContext.fillText('FPS: '+fpsTemp, 3, 11);
            MB_mainContext.fillStyle = "Black";
			MB_mainContext.font = "10px Arial";
			MB_mainContext.fillText('FPS: '+fpsTemp, 2, 10);
        } else {
            if (MB_additionalElements.fpsDiv) {
				MB_additionalElements.fpsDiv.innerHTML = 'FPS: ' + fpsTemp;
			}
        }
		frameCount++;
    };
	
    /**
    * end of debug functions
    *
    * Start/Stop functions
    **/
    var DrawAll = function(){
        
        if (MB_usingCanvas) {
            MB_mainContext.fillStyle = '#fff';
            MB_mainContext.beginPath();
            MB_mainContext.rect(0, 0, MB_mainCanvasWidth, MB_mainCanvasHeight);
            MB_mainContext.closePath();
            MB_mainContext.fill();
        }
        
        //draw all element
        var loopIndex = MB_elements.length;
        while (loopIndex--) {
            MB_elements[loopIndex].draw();
        }
        
        //run other functions
        loopIndex = MB_addedLoops.length;
        while (loopIndex--) {
            MB_addedLoops[loopIndex]();
        }
        
        if (MB_fpsMeasure) {
            MeasureFPS();
        }
                
    };
	
    var MB_detectCanvas = function() {
        if(!document.createElement('canvas').getContext) {
            MB_usingCanvas = false;
        }
    };
	
    var MB_InitCore = function() {
    //common part of both modes
        if (MB_fpsMeasure) {
            MB_lastTime = new Date();
        }
        MB_mainCanvas.style.width = MB_mainCanvas.width = MB_mainCanvasWidth;
        MB_mainCanvas.style.height = MB_mainCanvas.height =  MB_mainCanvasHeight; 
        
        MB_parentElement.appendChild(MB_mainCanvas);
    };    
    
    var MB_InitCanvas = function() {
        MB_mainCanvas = document.createElement('canvas');
        
        MB_InitCore();
        MB_mainContext = MB_mainCanvas.getContext('2d');
                
        //sorting all elements it is like Z-Index but for canvas
        MB_elements.sort(function(a,b){return a.zOrder - b.zOrder;});
  
    };    
    
    var MB_InitDOM = function() {
		
        MB_mainCanvas = document.createElement('div');
        MB_mainCanvas.style.position = 'absolute';
        MB_mainCanvas.style.overflow = 'hidden';
        MB_InitCore();
        
        if (MB_fpsMeasure) {
            // ?? ie throws error on creating 'style' element ??
			// FIXED:
			// walkaround by Stoyan Stefanov,
			// http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
			
			var sStyle = "#fpsDiv {position:absolute;z-index:999;font-weight:bold;top:0;left:0;padding:5px;}",
				sheet = document.createElement('style');
				sheet.setAttribute("type", "text/css");
			
			if (sheet.styleSheet) {   // IE
			    sheet.styleSheet.cssText = sStyle;
			} else {                // the world
			    sheet.innerHTML = sStyle;
			}

			document.getElementsByTagName('head')[0].appendChild(sheet);
                
            MB_additionalElements.fpsDiv = document.createElement('div');
            MB_additionalElements.fpsDiv.id = 'fpsDiv';
            MB_mainCanvas.appendChild(MB_additionalElements.fpsDiv);
            
        }
        
    };
    
	var MB_Start = function() {
		DrawAll();
		MB_drawLoop = setTimeout(MB_Start, MB_drawIntervalSpeed); //main loop
	}
    
	var MB_Stop = function() {
		clearTimeout(MB_drawLoop);
    };
	
    /**
    * End of Start/Stop functions
    **/
    
    var MB_checkCollides = function() {
        var loopIndex =  MB_collides.length, 
			element,
			p1, p2,
			p1Top, p1Bottom, p1Left, p1Right,
			p2Top, p2Bottom, p2Left, p2Right;
		
		while(loopIndex--) {
			p1 = MB_collides[loopIndex];
			p1Top = p1.posY + p1.collisionZone.top;
			p1Bottom = p1.posY + p1.height - p1.collisionZone.bottom;
			p1Left = p1.posX + p1.collisionZone.left;
			p1Right = p1.posX + p1.width - p1.collisionZone.right;
			
            //UNCOMMENT THSE TWO BLOCKS FOR COLLISION BOXES.
            //IN CANVAS MODE ONLY!
            /*
            MB_mainContext.moveTo(p1Right, p1Top);
            
            MB_mainContext.lineTo(p1Right, p1Bottom);
            MB_mainContext.lineTo(p1Left, p1Bottom);
            MB_mainContext.lineTo(p1Left, p1Top);
            MB_mainContext.lineTo(p1Right, p1Top);
            */
           for(element in MB_collides[loopIndex].hitEvents){
		   		p2 = MB_fixedIndexColl[element];
		   		p2Top = p2.posY + p2.collisionZone.top;
				p2Bottom = p2.posY + p2.height - p2.collisionZone.bottom;
				p2Left = p2.posX + p2.collisionZone.left;
				p2Right = p2.posX + p2.width - p2.collisionZone.right;
           /*
            MB_mainContext.moveTo(p2Right, p2Top);
            
            MB_mainContext.lineTo(p2Right, p2Bottom);
            MB_mainContext.lineTo(p2Left, p2Bottom);
            MB_mainContext.lineTo(p2Left, p2Top);
            MB_mainContext.lineTo(p2Right, p2Top);
            MB_mainContext.stroke();
            */
				if (!(
					(p1Top		> p2Bottom) ||   
					(p1Bottom	< p2Top) 	||   
					(p1Left		> p2Right) 	||   
					(p1Right	< p2Left)
				)){
						//console.dir(MB_collides[loopIndex].hitEvents)
						MB_collides[loopIndex].hitEvents[element]();
                     } 
         }
         
        }
    };
	    
    /**
    * SPRITES
    **/
    
    var MB_Sprite = function(_image, _width, _height, _frames, _animations) {
        
        var t = {};
        t.id = MB_elements.length;
				
            t.image = new Image();
            t.image.src = _image;
        
			t.speed = 1;
            t.width =  _width;
			t.initialWidth = _width;
            t.height = _height;
			t.initialHeight = _height;
            t.frames = _frames;
            t.animations = _animations;
            t.colllides = false;
            t.hitEvents = {};
        
            t.actualFrame = 0;
            t.actualAnimation = 0;
            t.animationSpeed = 1;
            t.animationInterval = 0;
        
            t.posX = 0;
            t.posY = 0;
        
			t.zOrder = 1;
			
			t.collisionZone = {
				top: 0,
				left: 0,
				bottom:0,
				right: 0
			}
			
        if (!MB_usingCanvas) { 
            //document.createElement('img') not allowed in IE6
            //need to install something to fix png transparency
            t.div = document.createElement('div');
			
			t.div.style.overflow = 'hidden';
			t.div.style.width = _width;
			t.div.style.height = _height;
			t.div.style.position="absolute";
			t.image.style.position="absolute";
            t.div.appendChild(t.image);

            t.div.style.zIndex = t.zOrder;
						
            
            MB_mainCanvas.appendChild(t.div);
        }

        t.id = MB_elements.push(t)-1;
        MB_fixedIndexColl.push(t); //to collisions, temporary
		        
        var setPosition = function(x, y, z) {
            t.posX = x;
            t.posY = y;
            t.zOrder = z || t.zOrder;
            
            if (MB_usingCanvas) {
				if (z) {
					MB_elements.sort(function(a, b){
						//return a.zOrder - b.zOrder;}
						return b.zOrder - a.zOrder;
					} //reversed becaouse of 'while' loop in DrawAll();					
					);
					
					/*var i = MB_elements.length;
					while(i--){
						MB_elements[i].id = i+1;
					}*/
				}
            } else {
                t.div.style.left = x;
                t.div.style.top = y;
                t.div.style.zIndex = z || t.zOrder;
            }   
        },
        
        setCollide = function(e) {
            if (e && MB_collides.indexOf(t) == -1) {
                MB_collides.push(t);
            } else if (!e && MB_collides.indexOf(t) != -1){
                MB_collides.remove(t);
            }
        },
        
        onHit = function (object, callback) {
                t.hitEvents[object.id()] = callback;
				if (MB_collides.indexOf(t) == -1) {
                	MB_collides.push(t);
           		}
        };        
        
        t.draw = function() {
            
            if (MB_usingCanvas) {
                try {
                    MB_mainContext.drawImage(t.image, t.initialWidth * t.actualAnimation, t.initialHeight * t.actualFrame, t.initialWidth, t.initialHeight, t.posX, t.posY, t.width, t.height);
                } catch(e) {
                    //if image is not ready yet try to display it on another frame
					//delete this and build preLoader
                }
            }
            if (t.frames > 0) {
				if (t.animationInterval == t.animationSpeed && t.animationSpeed !== 0) {
                    if (t.actualFrame == t.frames) {
                        t.actualFrame = 0;
                    }
                    else {
                        t.actualFrame++;
                    }
                    t.animationInterval = 0;
                }
                if (t.animationSpeed !== 0) {
                    t.animationInterval++;
                }
				
                if (!MB_usingCanvas) {
					
					t.image.style.top = t.height * t.actualFrame*-1;
					t.image.style.left = t.width * t.actualAnimation*-1;

				}	
				
            }
        }; 
		var reSize = function(w, h){
			
			if (!MB_usingCanvas){
				
				t.div.style.width = w;
				t.div.style.height = h;
				
				t.image.style.width = w*(t.animations+1);
				t.image.style.height = h*(t.frames+1);
				
			}
			t.width = w;
			t.height = h;
		};
        
        return {
            'setPosition':setPosition,
            'setCollide':setCollide,
            'onHit':onHit,
			'setCollisionZone': function(top, right, bottom, left) {
				t.collisionZone.left = left;
				t.collisionZone.top = top;
				t.collisionZone.right = right;
				t.collisionZone.bottom = bottom;
			},
            'getCollisionZone': function() {
                return t.collisionZone;
            },
            'clearHits':function() {
                t.hitEvents = {};
            },
            'switchSprite': function(image, width, height, frames, animations) {
                t.image.src = image;
                t.width = width;
                t.height = height;
                t.initialWidth = width;
                t.initialHeight = height;
                t.frames = frames;
                t.animations = animations;
                
                if (!MB_usingCanvas) {
                    t.image.style.width = width*(t.animations+1);
                    t.image.style.height = height*(t.frames+1);
                    t.div.style.width = width;
                    t.div.style.height = height;
                }
                
                t.collisionZone = {
                    top: 0,
                    left: 0,
                    bottom:0,
                    right: 0
                }
            },
            
            //setters
            'setAnimationSpeed':function(e) {t.animationSpeed=e;},
			'setCurrentAnimation':function(e) {t.actualAnimation=e;},
            'setCurrentFrame':function(e) {t.actualFrame=e;},
			'resize':reSize,
			
            //getters
            'getAnimationSpeed':function() { return t.animationSpeed;},
			'getCurrentAnimation':function() { return t.actualAnimation;},
			'posX':function() { return t.posX;},
			'posY':function() { return t.posY;},
			'width':function() { return t.width;},
			'height':function() { return t.height;},
			//'onClick':function(e) { t.div.addEventListener('click', e, false); },
			'id': function() { return t.id; }
        };
    };

	/** 
	 * SPRITES END
	 * START TILES
	 **/
	
	var MB_Tile = function(_image, _width, _height) {
        
        var t = {};
        t.id = MB_elements.length;
				
            t.image = new Image();
            t.image.src = _image;
        
			t.width = _width;
			t.initialWidth = _width;
            t.height = _height;
			t.initialHeight = _height;
            t.actualFrame = 0;
            
            t.posX = 0;
            t.posY = 0;
			
            t.zOrder = 1; //same as zIndex in sprite()
        
        if (!MB_usingCanvas) { 
            //document.createElement('img') not allowed in IE6
            //need to install something to fix png transparency

            t.div = document.createElement('div');
			
			t.div.style.overflow = 'hidden';
			t.div.style.width = _width;
			t.div.style.height = _height;
			t.div.style.position="absolute";
			t.image.style.position="absolute";
            
            t.div.appendChild(t.image);

            t.div.style.zIndex = t.zOrder;
						
            
            MB_mainCanvas.appendChild(t.div);
        } 

        t.id = MB_elements.push(t);
        
        
        var setPosition = function(x, y, z) {
            t.posX = x;
            t.posY = y;
            t.zOrder = z || t.zOrder;
            
            if (MB_usingCanvas) {
                //doeasn't seems to work ????
				if (z) {
					MB_elements.sort(function(a, b){
						return a.zOrder - b.zOrder;
					});
				}
            } else {
                t.div.style.left = x;
                t.div.style.top = y;
                t.div.style.zIndex = z || t.zOrder;
            }   
        };
        
        t.draw = function() {
            
            if (MB_usingCanvas) {
                try {
                    MB_mainContext.drawImage(t.image, 0, t.initialHeight * t.actualFrame, t.initialWidth, t.initialHeight, t.posX, t.posY, t.width, t.height);
                } catch(e) {
                    //if image is not ready yet try to display it on another frame
					//delete this and build preLoader
                }
            } else {

                t.image.style.top = t.height * t.actualFrame*(-1);
					
            } 
        };
		var reSize = function(w, h){
			
			if (!MB_usingCanvas){
				
				t.div.style.width = w;
				t.div.style.height = h;
				
				t.image.style.width = w;
				t.image.style.height = h*(t.frames+1);
				
			}
			t.width = w;
			t.height = h;
		};
        
        return {
            'setPosition':setPosition,
            
            //setters
			'resize':reSize,
			
            //getters
			'posX':function() { return t.posX;},
			'posY':function() { return t.posY;},
			'width':function() { return t.width;},
			'height':function() { return t.height;},
            'getActualFrame':function() { return t.actualFrame;},
            'setActualFrame':function(e) { return t.actualFrame=parseInt(e, 10);},
			//'onClick':function(e) { t.image.addEventListener('click', e, false); },
			'id':function(){return t.id; },
            'switchSprite': function(image, width, height) {
                t.image.src = image;
                t.width = width;
                t.height = height;
                t.initialWidth = width;
                t.initialHeight = height;
                t.actualFrame = 0;
                
                if (!MB_usingCanvas) {
                    t.div.style.width = width;
                    t.div.style.height = height;
                    
                }
   
            }
        };
    };
	
    /**
    * END OF TILES
    * START BACKGROUNDS
    **/
	var MB_Background = function(image, speed, direction, posX, posY, zOrder) {
		
		var t = this;
		
		if (MB_usingCanvas) {
			t.image = new Image();
			t.image.src = image;
		} else {
			MB_mainCanvas.style.backgroundImage = 'url('+image+')';
		}
		
		t.speed = speed || 3;
		
		var direcionFromString = function(dirString){
			switch (dirString) {
				case 'N':
					t.directionX = 0;
					t.directionY = -1;
					break;
				case 'W':
					t.directionX = -1;
					t.directionY = 0;
					break;
				case 'S':
					t.directionX = 0;
					t.directionY = 1;
					break;
				case 'E':
					t.directionX = 1;
					t.directionY = 0;
					break;
				default:
					t.directionX = 0;
					t.directionY = 0;
					break;
			}
		}
		
		direcionFromString(direction);
		
		t.posX = posX || 0;
		t.posY = posY || 0;
		t.zOrder = zOrder || 0;
		
		t.id = MB_elements.push(t);
		
		t.moving = 0;

		
		t.draw = function() {
                t.posX += t.speed*t.directionX*t.moving;
                t.posY += t.speed*t.directionY*t.moving;
                
                if (MB_usingCanvas) {
                    try {
                        MB_mainContext.drawImage(t.image, t.posX, t.posY);
                        MB_mainContext.drawImage(t.image, t.posX + t.image.width * t.directionX, t.posY + t.image.height * t.directionY);
                        MB_mainContext.drawImage(t.image, t.posX - t.image.width * t.directionX, t.posY - t.image.height * t.directionY);
                    } catch(e) {};
                    
                    if (t.directionX === -1) {
                        if (t.posX < (t.image.width*-1)) {
                            t.posX = 0;
                        }
                    } else if (t.directionX === 1) {
                        if (t.posX > (t.image.width)) {
                            t.posX = 0;
                        }
                    } else if (t.directionY === -1) {
                        if (t.posY < (t.image.height*-1)) {
                            t.posY = 0;
                        }
                    } else if (t.directionY === 1) {
                        if (t.posY > (t.image.height)) {
                            t.posY = 0;
                        }
                    }
                } else {		
                    MB_mainCanvas.style.backgroundPosition = t.posX +"px "+t.posY+"px";			
                }
			
		}
		
		return {
			'start': function() { t.moving = 1; },
			'stop': function() { t.moving = 0; },
			'setDirection': function(direction) { t.posX = t.posY = 0; direcionFromString(direction); },
			'setSpeed': function(speed) { t.speed = speed; }
		}
		
	}

	
	/**
	 * Constructor functions
	 */
	
	
	
    return {
        //config
        'showFps': function() {MB_fpsMeasure=true;},
        'detectCanvas': MB_detectCanvas,
        'setMaxFps': function(fps) {MB_drawIntervalSpeed = 1000/fps;},
        'addCss': function(klass) { MB_mainCanvas.className = klass; },
		'init': function() { MB_usingCanvas ? MB_InitCanvas() : MB_InitDOM(); },
        
		// starting       
        'start': MB_Start,
        'stop': MB_Stop,
		'canvas': function(){ return MB_mainCanvas; },
		
        //options
        'enableCanvas': function() {MB_usingCanvas=true;},
        'disableCanvas': function() {MB_usingCanvas=false;},
		'enableCollisions': function() { MB_addedLoops.push(MB_checkCollides); },
		
        //elements
        'sprite':MB_Sprite,
		'tile':MB_Tile,
		'background': MB_Background,
		
		//loops
		'addLoop': function(e){MB_addedLoops.push(e);}
        
    };
};