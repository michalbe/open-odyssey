StructuresWithShadow = {
    //PLAYER
    playerConf : {
        'filename':'odys',
        'width':80,
        'height': 90,
        'frames': 3,
        'animations': 1,
        'animationSpeed':5,
        'shadowDistance':80,
        'collisionZone':{top:50, right:23, bottom:0, left:7}
    },
        
    //OBSTACLES
    palm : {
        'filename':'obstacles/palmTree',
        'width':82,
        'height': 100,
        'frames': 0,
        'animations': 0,
        'animationSpeed':0,
        'shadowDistance':82,
        'collisionZone':{top:56, right:31, bottom:0, left:31}
    },
    cactus : {
        'filename':'obstacles/cactus',
        'width':101,
        'height': 120,
        'frames': 0,
        'animations': 0,
        'animationSpeed':0,
        'shadowDistance':100,
        'collisionZone':{top:85, right:0, bottom:0, left:0}
    },
    stone : {
        'filename':'obstacles/stone',
        'width':89,
        'height': 80,
        'frames': 0,
        'animations': 0,
        'animationSpeed':0,
        'shadowDistance':50,
        'collisionZone':{top:40, right:0, bottom:0, left:0}
    },
    stone2 : {
        'filename':'obstacles/stone2',
        'width':80,
        'height': 170,
        'frames': 0,
        'animations': 0,
        'animationSpeed':0,
        'shadowDistance':120,
        'collisionZone':{top:100, right:0, bottom:0, left:0}
    },
    column : {
        'filename':'obstacles/column',
        'width':67,
        'height': 120,
        'frames': 0,
        'animations': 0,
        'animationSpeed':0,
        'shadowDistance':55,
        'collisionZone':{top:55, right:0, bottom:0, left:0}
    },
    bush : {
        'filename':'obstacles/bush',
        'width':43,
        'height': 40,
        'frames': 0,
        'animations': 0,
        'animationSpeed':0,
        'shadowDistance':20
    },
    //WEAPONS
    spearConf : {
        'filename':'dzida',
        'width':10,
        'height': 60,
        'frames': 1,
        'animations': 0,
        'animationSpeed':4,
        'shadowDistance':70
    }
}

    var ObjectWithShadow = function(character, posX, posY) {
		var that = this;
		that.posX = posX || 0;
		that.posY = posY || 0;
		that.shadowDistance = character.shadowDistance;
		
        that.conf = character;
        
		that.character = new game.sprite(IMAGE_DIR + character.filename+ '.png', character.width, character.height, character.frames, character.animations);
		that.character.setPosition(that.posX, that.posY, Z_CHARACTERS);
		that.character.setAnimationSpeed(character.animationSpeed);
		that.character.setCurrentAnimation(0);
		
        var shadowFile = character.shadowFile || character.filename+ '_shadow';
        
		that.shadow = new game.sprite(IMAGE_DIR + shadowFile + '.png', character.width, character.height, character.frames, 0);
		that.shadow.setPosition(that.posX, that.posY+that.shadowDistance, Z_SHADOWS);
		that.shadow.setAnimationSpeed(character.animationSpeed);
		that.shadow.setCurrentAnimation(0);
		
		that.setPosition = function(x, y) {
			that.character.setPosition(x, y, y+that.character.height());
			that.shadow.setPosition(x, y+that.shadowDistance);
			that.posX = x;
			that.posY = y;
		}
        
        that.switchSprite = function(character, posX, posY) {
            that.posX = posX || 0;
            that.posY = posY || 0;
            that.shadowDistance = character.shadowDistance;
		    that.conf = character;
            that.character.switchSprite(IMAGE_DIR + character.filename+ '.png', character.width, character.height, character.frames, character.animations);
            that.character.setPosition(that.posX, that.posY, Z_CHARACTERS);
            that.character.setAnimationSpeed(character.animationSpeed);
            that.character.setCurrentAnimation(0);
            
            var shadowFile = character.shadowFile || character.filename+ '_shadow';
            
            that.shadow.switchSprite(IMAGE_DIR + shadowFile + '.png', character.width, character.height, character.frames, 0);
            that.shadow.setPosition(that.posX, that.posY+that.shadowDistance, Z_SHADOWS);
            that.shadow.setAnimationSpeed(character.animationSpeed);
            that.shadow.setCurrentAnimation(0);
            if (character.collisionZone) {
                that.character.setCollisionZone(character.collisionZone.top,
                                                character.collisionZone.right,
                                                character.collisionZone.bottom,
                                                character.collisionZone.left);
            }
        }
        
        that.clearHits = function() {
            that.character.clearHits();
        }
        
        if (character.collisionZone) {
            that.character.setCollisionZone(character.collisionZone.top,
                                            character.collisionZone.right,
                                            character.collisionZone.bottom,
                                            character.collisionZone.left);
        }
        
		return that;
	}

        var obstacles = [];
    var obstaclesFactory = function(i) {
        var typesOfObstacles = LEVELS[actualLevel].obstacles,
            nr = ~~(Math.random()*typesOfObstacles.length),
            posY = -200,
            posX = ~~(Math.random()*GAME_WIDTH),
            conf = StructuresWithShadow[typesOfObstacles[nr]];
            
            if (i == null) {
                i=obstacles.length;
                posY = i*200;
                
                obstacles[i] = new ObjectWithShadow(conf, posX, posY);
            } else {
            
                obstacles[i].switchSprite(conf, posX, posY);
                obstacles[i].clearHits();
            }

            
            
            obstacles[i].character.onHit(player.character, function() {
                IsoColision(player, obstacles[i]);
            });
        
    }
    var obstaclesMove = function() {
        var i = obstacles.length;
        while(i--) {
            if (obstacles[i].posY>GAME_HEIGHT){
                obstaclesFactory(i);
            } else {
                obstacles[i].setPosition(obstacles[i].posX, obstacles[i].posY+SCROLL_SPEED);
            }
        }
	}
