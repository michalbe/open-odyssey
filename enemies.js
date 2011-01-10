var totalEnemiesOut = 0;
EnemiesConfig = {
    shepherd : {
        'filename':'enemies/shepherd',
        'width':68,
        'height': 90,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':80,
        'speed': SCROLL_SPEED+2,
        'move': function() {
            
        }
    }, 
    shepherd2 : {
        'filename':'enemies/shepherd2',
        'width':68,
        'height': 90,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':80,
        'speed': SCROLL_SPEED+1,
        'shadowFile': 'enemies/shepherd_shadow'
    },
    shepherd3 : {
        'filename':'enemies/shepherd3',
        'width':68,
        'height': 90,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':80,
        'speed': SCROLL_SPEED+3,
        'shadowFile': 'enemies/shepherd_shadow',
        'points':3
    },
    soldier1 : {
        'filename':'enemies/soldier',
        'width':57,
        'height': 80,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':70,
        'speed': SCROLL_SPEED+2,
        'points':2
    },
    soldier2 : {
        'filename':'enemies/soldier2',
        'width':57,
        'height': 80,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':70,
        'speed': SCROLL_SPEED+3,
        'shadowFile': 'enemies/soldier_shadow',
        'points':3
    },
    soldier3 : {
        'filename':'enemies/soldier3',
        'width':57,
        'height': 80,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':70,
        'speed': SCROLL_SPEED+4,
        'shadowFile': 'enemies/soldier_shadow',
        'points':4
    },
   cyclop1 : {
        'filename':'enemies/cyclop',
        'width':108,
        'height': 140,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':130,
        'speed': SCROLL_SPEED+2,
        'points':2
    },
    cyclop2 : {
        'filename':'enemies/cyclop2',
        'width':108,
        'height': 140,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':130,
        'speed': SCROLL_SPEED+3,
        'shadowFile': 'enemies/cyclop_shadow',
        'points':3
    },
    cyclop3 : {
        'filename':'enemies/cyclop3',
        'width':108,
        'height': 140,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':130,
        'speed': SCROLL_SPEED+4,
        'shadowFile': 'enemies/cyclop_shadow',
        'points':4
    },
    hades : {
        'filename':'enemies/hades',
        'width':68,
        'height': 102,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':90,
        'speed': SCROLL_SPEED+1,
        'points':2
    },
    hades2 : {
        'filename':'enemies/hades2',
        'width':68,
        'height': 102,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':90,
        'speed': SCROLL_SPEED+3,
        'shadowFile': 'enemies/hades_shadow',
        'points':1
    },
    hades3 : {
        'filename':'enemies/hades3',
        'width':68,
        'height': 102,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':90,
        'speed': SCROLL_SPEED+2,
        'shadowFile': 'enemies/hades_shadow',
        'points':2
    },
    hades4 : {
        'filename':'enemies/hades4',
        'width':68,
        'height': 102,
        'frames': 3,
        'animations': 1,
        'animationSpeed':4,
        'shadowDistance':90,
        'speed': SCROLL_SPEED+3,
        'shadowFile': 'enemies/hades_shadow',
        'points':1
    }
    
}

var enemies = [];
var enemiesFactory = function(i) {
    totalEnemiesOut++;
        var typesOfObstacles = LEVELS[actualLevel].enemies,
            nr = ~~(Math.random()*typesOfObstacles.length),
            posY = -200,
            posX = ~~(Math.random()*GAME_WIDTH-50),
            conf = EnemiesConfig[typesOfObstacles[nr]];
            
            if (i == null) {
                i=enemies.length;
                posY = 50-(i*200);
                
                enemies[i] = new ObjectWithShadow(conf, posX, posY);
            } else {
            
                enemies[i].switchSprite(conf, posX, posY);
                enemies[i].clearHits();
            }

            
            var obstaclesNr = obstacles.length;
            while (obstaclesNr--) {
                enemies[i].character.onHit(obstacles[obstaclesNr].character, function() {
                    //FIX: some problems with puting given obstacle in here, 
                    //but works quite fine with the first one:)
                    IsoColision(enemies[i], obstacles[0]);
                });
            }
            
            enemies[i].character.onHit(player.character, function() {
                if (player.character.getCurrentAnimation()===0 && enemies[i].character.getCurrentAnimation()===0) {
                    player.character.setCurrentAnimation(1);
                    setTimeout(function() {player.character.setCurrentAnimation(0);}, 1000);
                    
                    //it is 2011-01-09 14:46 Central European Time,
                    //I cannot remember when I was sleeping last time
                    //and that 0-delayed Timeout was the only way to make 
                    //it works as fast as possible
                    //I will think about fixing this later, sorry.
                    setTimeout(lifeDown, 0);
                }
            });
            
            enemies[i].character.onHit(spear.character, function() {
                //enemy hited by a spear
                
                    player.shoot = 0;
                    spear.setPosition(-200, -200);
                    enemies[i].character.setCurrentAnimation(1);
                    
                    enemies[i].conf.points ? points+=enemies[i].conf.points : points++;
                    
                    renderPoints(points);
                    setTimeout(function() {enemiesFactory(i);}, 250);
                    
                    if (totalEnemiesOut>120){
                        //END OF STAGE
                        //another think ugly as hell!
                        localStorage.odysseyPoints = points;
                        localStorage.odysseyLevel = actualLevel+=1;
                        
                        if (localStorage.odysseyLevel > 4) {
                            localStorage.odysseyPoints = 0;
                            localStorage.odysseyLevel = 0;                            
                            var newLocation = window.location.href.split('/');
                                newLocation.pop();
                                newLocation.push('win.html');
                                window.location = newLocation.join('/');
                            console.log('aa');
                        } else {
                            window.location = window.location.href;
                        }
                    }
            });
            
            
    }
    var enemiesMove = function() {
        var i = enemies.length;
        while(i--) {
            if (enemies[i].posY>GAME_HEIGHT){
                enemiesFactory(i);
            } else {
                enemies[i].setPosition(enemies[i].posX, enemies[i].posY+enemies[i].conf.speed);
            }
        }
	}
    
    