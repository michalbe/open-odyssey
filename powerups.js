EnemiesConfig = {
    shepherd : {
        'filename':'enemies/shepherd',
        'width':68,
        'height': 90,
        'frames': 3,
        'animations': 0,
        'animationSpeed':4,
        'shadowDistance':80,
        'speed': 7,
        'move': function() {
            
        }
    }
}

var enemies = [];
var enemiesFactory = function(i) {
        var typesOfObstacles = ['shepherd', 'shepherd2', 'shepherd3'],
            nr = ~~(Math.random()*typesOfObstacles.length),
            posY = -200,
            posX = ~~(Math.random()*GAME_WIDTH),
            conf = EnemiesConfig[typesOfObstacles[nr]];
            
            if (i == null) {
                i=enemies.length;
                posY = i*200;
                
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
                    player.character.setCurrentAnimation(1);
                    setTimeout(function() {player.character.setCurrentAnimation(0);}, 500);
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
    
    