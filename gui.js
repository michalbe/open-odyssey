var LIFES = 5, 
    lifeTiles=[], 
    actualLifes=LIFES,
    pointsTiles=[];

for (var i=0;i<LIFES;i++) {
//show lifes
    lifeTiles[i] = new game.tile('images/hp.png', 30, 30);
    lifeTiles[i].setPosition(5+32*i, 5, Z_GUI);
}

for (i=0;i<5;i++) {
//display points
    pointsTiles[i] = new game.tile('images/interface/all.png', 31, 41);
    pointsTiles[i].setPosition(GAME_WIDTH-32*i-35, GAME_HEIGHT-45, Z_GUI);
}

var renderPoints = function(points) {
    var strPoints = points+"",
        length = strPoints.length;
    for (i=0;i<5-length;i++) {
        strPoints = "0"+strPoints;
    }
    
    length = strPoints.length;
    for (i=0;i<length;i++) {
        pointsTiles[4-i].setActualFrame(strPoints.charAt(i));
    }
}

var lifeDown = function() {
    totalEnemiesOut-=10;
    if (actualLifes>1) {
        actualLifes--;
        lifeTiles[actualLifes].setActualFrame(1);
    } else {
        //GAME OVER ACTIONS IN HERE
        var newLocation = window.location.href.split('/');
        newLocation.pop();
        newLocation.push('lose.html');
        window.location = newLocation.join('/');
        
    }
}

