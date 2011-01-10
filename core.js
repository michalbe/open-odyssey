var actualLevel = 0,
    points=0;
 if (localStorage.odysseyLevel) {
    actualLevel=parseInt(localStorage.odysseyLevel, 10);
 }

 if (localStorage.odysseyPoints) {
    points = parseInt(localStorage.odysseyPoints, 10);
 }

 
 var game = new mibbu(GAME_WIDTH, GAME_HEIGHT);
    //game.disableCanvas();
    game.detectCanvas();    
    game.init();
    //game.showFps();
    game.setMaxFps(40);
    game.enableCollisions();
    

    var IsoColision = function(player, object) {
        var objectX = object.posX,
            objectW = object.conf.width,
            playerX = player.posX,
            playerY = player.posY,
            playerW = player.conf.width,
            playerH = player.conf.height,
            playerCenter = (~~(playerW/2)+playerX),
            distanceLeft = playerCenter-objectX,
            distanceRight = objectX+objectW-playerCenter,
            downStep = ~~(SCROLL_SPEED/2),
            sideStep = (PLAYER_STEP*2);

        if (distanceLeft < distanceRight) {
            sideStep *= -1;
        }
        
        if (playerY+playerH+SCROLL_SPEED > GAME_HEIGHT) {
            downStep = 0;
        }
        if ((sideStep < 0 && playerX+sideStep < 0) || (sideStep > 0 && playerX+playerW+sideStep > GAME_WIDTH)) {
            sideStep = 0;
        }
                   
        player.setPosition(playerX+sideStep, playerY+downStep);
        
    }
    

    var player = new ObjectWithShadow(StructuresWithShadow.playerConf, 260, GAME_HEIGHT-200);
    player.sides = 0;
	player.updown = 0;
	player.shoot = 0;

    var spear = new ObjectWithShadow(StructuresWithShadow.spearConf, -100,-100);

    var Pause = function() {
        if (PAUSED) {
            game.start();
            PAUSED = 0;
        } else {
            game.stop();
            PAUSED = 1;
        }
    }
    
	var catchKeyDown = function(e) {
		switch (e.keyCode) {
            case 80:
                Pause();
                break;
			case 38:
				player.updown = -1;
				break;
			case 40:
				player.updown = 1;
				break;
			case 37:
				player.sides = -1;
				break;
			case 39:
				player.sides = 1;
				break;
			case 90:
				if (player.shoot==0) {
					Shoot();
				} 
		}
		e.stopPropagation();
	}
	var catchKeyUp = function(e) {
		switch (e.keyCode) {
			case 38:
				if (player.updown===-1) player.updown = 0;
				break;
			case 40:
				if (player.updown===1) player.updown = 0;
				break;
			case 37:
				if (player.sides===-1) player.sides = 0;
				break;
			case 39:
				if (player.sides===1) player.sides = 0;
				break;
		}
		//e.stopPropagation();
	}

    if (document.addEventListener){
        document.addEventListener("keydown",catchKeyDown,false);
        document.addEventListener("keyup",catchKeyUp,false);
    } else if (document.attachEvent){
        document.attachEvent("onkeydown",catchKeyDown);
        document.attachEvent("onkeyup",catchKeyUp);
    }

               
	var movePlayer = function() {
		var lrSide = player.posX+player.sides*PLAYER_STEP, //left-right
			udSide = player.posY+player.updown*PLAYER_STEP; //up-down
			
		if (lrSide >= 0 && lrSide <= GAME_WIDTH-player.conf.width && udSide > 0 && udSide < GAME_HEIGHT-player.conf.height) {
			player.setPosition(lrSide, udSide);
		}
	}
	
	var Shoot = function() {
		player.shoot = 1;
		spear.setPosition(player.posX+50, player.posY-10);		
	}
	
	var ShootMovement = function() {
		if (spear.posY<0){
			player.shoot = 0;
			spear.setPosition(-200, -200);
		}
		if (player.shoot) {
			spear.setPosition(spear.posX, spear.posY-20);
		}
	}
	
	game.addLoop(ShootMovement);
	game.addLoop(movePlayer);
	
   
    var tlo = new game.background('images/backgrounds/'+LEVELS[actualLevel].background, SCROLL_SPEED, "S"); //sprite file, speed, direction (N, S, W, E)
    tlo.start();
       
    var i = LEVELS[actualLevel].nrOfObstacles;
    while(i--) {
        obstaclesFactory();
    }
    game.addLoop(obstaclesMove);
    
    i=LEVELS[actualLevel].nrOfEnemies;
    while(i--) {
        enemiesFactory();
    }
    game.addLoop(enemiesMove);

    //MAIN BOARDS
    //UGLY AS HELL, I KNOW
    var board = document.createElement('img');
    board.style.position = 'absolute';
    board.style.top = '0';
    board.style.left = '0';
    board.style.cursor = 'pointer';
    board.style.zIndex = Z_GUI*2;
    board.src = 'images/boards/' + LEVELS[actualLevel].board; 
    board.onclick = function() {
        board.style.display = 'none';
        game.start();
        PAUSED=0;
        renderPoints(points);
    }        
    
    document.body.appendChild(board);
    
    //game.start();
