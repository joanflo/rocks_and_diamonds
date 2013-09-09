

/* Constructor */
function Board(n, m) {
    this.lastTarget = undefined;
    this.lastMovement = undefined;

    this.totalTime = 150; //by default 150 seconds
    this.gemsNumber = 0;
    this.dynamiteNumber = 0;
    this.monstersNumber = 0;
    this.keysNumber = 0;
    this.levelNumber = 0;

    this.dust = []; // TODO
    this.shining = [];
    this.monsters = [];
    this.explosions = [];
    this.charAnimation = [];

    this.n = n;
    this.m = m;

    this.gameMode = undefined;

    this.iVisible = 0;
    this.jVisible = 0;

    this.character = new Character(1, 1); //character initial position
    this.boardMatrix = undefined;

    if (n != undefined && m != undefined) {

        // n*m matrix
        this.boardMatrix = new Array(n);
        for (var i = 0; i < n; i++) {
            this.boardMatrix[i] = new Array(m);
            //initializing: walls arround de limits, empty at the middle
            for (var j = 0; j < m; j++) {
                if (i == 0 || i == n - 1 || j == 0 || j == m - 1) {
                    this.setCell(CELL_WALL, i, j);
                } else {
                    this.setCell(CELL_LAND, i, j);
                }
            }
        }

        this.setCell(CELL_CHARACTER, 1, 1); //character initial position
    }
}


Board.prototype.setCell = function (cellCode, i, j) {
    this.boardMatrix[i][j] = cellCode;
};

Board.prototype.getCell = function (i, j) {
    return this.boardMatrix[i][j];
};


Board.prototype.setTotalTime = function (time) {
    this.totalTime = time;
};

Board.prototype.getTotalTime = function () {
    return this.totalTime;
};


Board.prototype.setBoardMatrix = function (boardMatrix) {
    this.boardMatrix = boardMatrix;
    this.n = boardMatrix.length;
    this.m = boardMatrix[1].length;
};

Board.prototype.getBoardMatrix = function () {
    return this.boardMatrix;
};


Board.prototype.getCharacter = function () {
    return this.character;
};

Board.prototype.getDust = function () {
    return this.dust;
};

Board.prototype.getShining = function () {
    return this.shining;
};

Board.prototype.getMonsters = function () {
    return this.monsters;
};

Board.prototype.getExplosions = function () {
    return this.explosions;
};

Board.prototype.getCharAnimation = function () {
    return this.charAnimation;
};


Board.prototype.setGemsNumber = function (gemsNumber) {
    this.gemsNumber = gemsNumber;
};

Board.prototype.getGemsNumber = function () {
    return this.gemsNumber;
};


Board.prototype.setMonstersNumber = function (monstersNumber) {
    this.monstersNumber = monstersNumber;
};

Board.prototype.getMonstersNumber = function () {
    return this.monstersNumber;
};


Board.prototype.setKeysNumber = function (keysNumber) {
    this.keysNumber = keysNumber;
};

Board.prototype.getKeysNumber = function () {
    return this.keysNumber;
};


Board.prototype.setLevelNumber = function (levelNumber) {
    this.levelNumber = levelNumber;
};

Board.prototype.getLevelNumber = function () {
    return this.levelNumber;
};


Board.prototype.setDynamiteNumber = function (dynamiteNumber) {
    this.dynamiteNumber = dynamiteNumber;
};

Board.prototype.getDynamiteNumber = function () {
    return this.dynamiteNumber;
};


Board.prototype.putElement = function (x, y) {
    cell = this.localizeCell(x, y);
    if (!(cell.i == 0 || cell.i == this.n - 1 || cell.j == 0 || cell.j == this.m - 1)) {//we can't remove the wall cells

        //just one character
        if (this.currentItem == CELL_CHARACTER) {
            if (this.character.isAvaiable()) {
                var position = this.character.getPosition(); //old position
                this.setCell(CELL_EMPTY, position.i, position.j);
            }
            this.character.setPosition(cell.i, cell.j); //update position & state
            this.character.setAvaiable(true);
        } else if (this.getCell(cell.i, cell.j) == CELL_CHARACTER) { //erasing character
            this.character.setAvaiable(false);
        }

        //counting items number
        switch (this.boardMatrix[cell.i][cell.j]) { //old item
            case CELL_GEM:
                this.gemsNumber--;
                break;
            case CELL_DYNAMITE:
                this.dynamiteNumber--;
                break;
            case CELL_MONSTER:
                this.monstersNumber--;
                break;
            case CELL_KEY:
                this.keysNumber--;
                break;
        }
        switch (this.currentItem) { //new item
            case CELL_GEM:
                this.gemsNumber++;
                break;
            case CELL_DYNAMITE:
                this.dynamiteNumber++;
                break;
            case CELL_MONSTER:
                this.monstersNumber++;
                break;
            case CELL_KEY:
                this.keysNumber++;
                break;
        }

        // putElement method only called in LEVEL_EDITOR mode
        this.updateMarker("marker2", "Dynamite", this.dynamiteNumber);
        this.updateMarker("marker3", "Diamonds", this.gemsNumber);
        this.updateMarker("marker4", "Keys", this.keysNumber);

        if (this.currentItem != undefined) {
            this.setCell(this.currentItem, cell.i, cell.j);
            this.graphics.drawBoard();
        }
    }
};


Board.prototype.localizeCell = function (x, y) {
    cell = new Object();
    cell.i = Math.floor(x / CELL_SIZE) + this.iVisible;
    cell.j = Math.floor(y / CELL_SIZE) + this.jVisible;
    return cell;
};


Board.prototype.setGraphics = function(graphics) {
    this.graphics = graphics;
};


Board.prototype.setCurrentItem = function (currentTarget) {
    //update last target color
    if (this.lastTarget != undefined) {
        switch (this.lastTarget.id) {
            case "empty_button":
                this.lastTarget.style.backgroundColor = "#b200ff";
                break;
            case "wall_button":
                this.lastTarget.style.backgroundColor = "#ff6a00";
                break;
            case "land_button":
                this.lastTarget.style.backgroundColor = "#ff006e";
                break;
            case "character_button":
                this.lastTarget.style.backgroundColor = "#ffd800";
                break;
            case "monster_button":
                this.lastTarget.style.backgroundColor = "#4cff00";
                break;
            case "gem_button":
                this.lastTarget.style.backgroundColor = "#0044FF";
                break;
            case "rock_button":
                this.lastTarget.style.backgroundColor = "#E51400";
                break;
            case "dynamite_button":
                this.lastTarget.style.backgroundColor = "#E671B8";
                break;
            case "key_button":
                this.lastTarget.style.backgroundColor = "#339933";
                break;
            case "door_button":
                this.lastTarget.style.backgroundColor = "#1BA1E2";
                break;
        }
    }

    //update current target item
    switch (currentTarget.id) {
        case "empty_button":
            this.currentItem = CELL_EMPTY;
            break;
        case "wall_button":
            this.currentItem = CELL_WALL;
            break;
        case "land_button":
            this.currentItem = CELL_LAND;
            break;
        case "character_button":
            this.currentItem = CELL_CHARACTER;
            break;
        case "monster_button":
            this.currentItem = CELL_MONSTER;
            break;
        case "rock_button":
            this.currentItem = CELL_ROCK;
            break;
        case "gem_button":
            this.currentItem = CELL_GEM;
            break;
        case "dynamite_button":
            this.currentItem = CELL_DYNAMITE;
            break;
        case "key_button":
            this.currentItem = CELL_KEY;
            break;
        case "door_button":
            this.currentItem = CELL_DOOR;
            break;
    }

    //update targets
    if (this.lastTarget != undefined) {
        this.lastTarget.style.color = "#ffffff";
    }
    currentTarget.style.color = "#000000";
    currentTarget.style.backgroundColor = "#D8D8D8";

    this.lastTarget = currentTarget;
};


Board.prototype.placeDynamite = function (pos) {
    if (this.dynamiteNumber > 0) {
        this.addExplosions(pos.i, pos.j);
        this.dynamiteNumber--;
    }
};


Board.prototype.moveCamera = function (movementType, gameMode) {
    this.lastMovement = movementType;
    this.gameMode = gameMode;
    if (gameMode != LEVEL_EDITOR) {
        this.moveCharacter(movementType);
    } else {
        this.graphics.drawBoard();
    }
};


Board.prototype.moveCharacter = function (movementType) {
    if (this.character.isAvaiable()) {
        var position = this.character.getPosition(); //old position

        //next character cell
        var iAux;
        var jAux;
        //next possible rock cell (only horizontal)
        var iAuxRock;
        switch (movementType) {
            case LEFT:
                iAux = position.i - 1;
                jAux = position.j;
                iAuxRock = position.i - 2;
                break;
            case UP:
                iAux = position.i;
                jAux = position.j - 1;
                iAuxRock = null;
                break;
            case RIGHT:
                iAux = position.i + 1;
                jAux = position.j;
                iAuxRock = position.i + 2;
                break;
            case DOWN:
                iAux = position.i;
                jAux = position.j + 1;
                iAuxRock = null;
                break;
        }

        if (this.isLegalMovement(iAux, jAux, iAuxRock, movementType)) {
            switch (this.getCell(iAux, jAux)) { // new cell
                case CELL_MONSTER:
                    //dead
                    var msg = new Windows.UI.Popups.MessageDialog("GAME OVER. You're dead!");
                    msg.showAsync();
                    break;
                case CELL_ROCK:
                    //push rock
                    this.setCell(CELL_ROCK, iAuxRock, jAux);
                    break;
                case CELL_DYNAMITE:
                    // get dynamite
                    this.dynamiteNumber++; // decreases only when it's used
                    this.updateMarker("marker2", "Dynamite", this.dynamiteNumber);
                    break;
                case CELL_GEM:
                    // get gem
                    this.gemsNumber++;
                    this.updateMarker("marker3", "Diamonds", this.gemsNumber);
                    this.addShining(iAux, jAux);
                    break;
                case CELL_LAND:
                    // add dust
                    this.addDust(iAux, jAux);
                    break;
                case CELL_KEY:
                    // get key
                    this.dynamiteNumber++; // decreases only when it's used
                    this.updateMarker("marker4", "Keys", this.keysNumber);
                    break;
            }
            //monsters number only updated in some game modes when they die


            this.updateCharacterPosition(iAux, jAux);
            if (!this.charAnimation[0]) { // no character animations 
                this.addCharAnimation(iAux, jAux, movementType);
            } else {
                var animation = this.charAnimation[0];
                animation.pos = [iAux, jAux];
            }
        }
    }
};


Board.prototype.isLegalMovement = function (iAux, jAux, iAuxRock, movementType) {

    var cellCode1 = this.getCell(iAux, jAux);
    if (cellCode1 == CELL_WALL) {
        return false;
    }

    if ((movementType == UP || movementType == DOWN) && cellCode1 == CELL_ROCK) {
        return false;
    }

    if (iAux == 0 || iAux == this.n) {
        return false;
    }

    if (iAuxRock == null) {
        return true;
    }
    var cellCode2 = this.getCell(iAuxRock, jAux);
    if (cellCode1 == CELL_ROCK) {
        return cellCode2 == CELL_EMPTY;
    }

    return true;
};


Board.prototype.updateCharacterPosition = function (i, j) {
    var position = this.character.getPosition(); //old position
    this.setCell(CELL_EMPTY, position.i, position.j);
    this.character.setPosition(i, j); //update position
    this.setCell(CELL_CHARACTER, i, j);
};


Board.prototype.genRandomMatrix = function (mode) {

    for (var i = 0; i < this.n; i++) {
        for (var j = 0; j < this.m; j++) {

            if (i == 0 || i == this.n - 1 || j == 0 || j == this.m - 1) {
                this.setCell(CELL_WALL, i, j);
            } else if (this.getCell(i, j) != CELL_CHARACTER) {

                var u = Math.random(); // U(0,1)
                switch (mode) {
                    case KILL_EM_ALL:

                        if (this.getCell(i, j) != CELL_EMPTY && this.getCell(i, j) != CELL_MONSTER
                            && this.getCell(i+1, j) == CELL_LAND && this.getCell(i-1, j) == CELL_LAND
                            && this.getCell(i, j+1) == CELL_LAND && this.getCell(i, j-1) == CELL_LAND) {

                            if (u < 0.015) {
                                // center
                                this.setCell(CELL_LAND, i, j);
                                // borders
                                this.setCell(CELL_EMPTY, i - 1, j);
                                this.setCell(CELL_EMPTY, i, j - 1);
                                this.setCell(CELL_MONSTER, i + 1, j);
                                this.setCell(CELL_EMPTY, i, j + 1);
                                this.setCell(CELL_EMPTY, i - 1, j - 1);
                                this.setCell(CELL_EMPTY, i - 1, j + 1);
                                this.setCell(CELL_EMPTY, i + 1, j - 1);
                                this.setCell(CELL_EMPTY, i + 1, j + 1);

                            } else if (u < 0.1) {
                                this.setCell(CELL_ROCK, i, j);
                            } else if (u < 0.11) {
                                this.setCell(CELL_DYNAMITE, i, j);
                            }
                        }
                        break;

                    case CATCH_EM_ALL:

                        if (this.getCell(i, j + 1) != CELL_EMPTY) { // bottom cell
                            if (u < 0.15) {
                                this.setCell(CELL_GEM, i, j);
                            } else if (u < 0.3) {
                                this.setCell(CELL_ROCK, i, j);
                            } else if (u < 0.31) {
                                this.setCell(CELL_DYNAMITE, i, j);
                            }
                        }
                        break;
                }
            }
        }
    }

    // cells nearby character
    this.setCell(CELL_LAND, 2, 2);
    this.setCell(CELL_LAND, 2, 1);
    this.setCell(CELL_LAND, 1, 2);
    this.setCell(CELL_LAND, 3, 1);
    this.setCell(CELL_LAND, 3, 2);
};


Board.prototype.calculateBounding = function () {
    var bounds = new Object();

    if (this.gameMode == LEVEL_EDITOR) { // level editor camera
        switch (this.lastMovement) {
            case LEFT:
                if (this.iVisible > 0) {
                    this.iVisible--;
                }
                break;
            case UP:
                if (this.jVisible > 0) {
                    this.jVisible--;
                }
                break;
            case RIGHT:
                if (this.iVisible < this.n - MAX_CELLS_HORIZONTAL) {
                    this.iVisible++;
                }
                break;
            case DOWN:
                if (this.jVisible < this.m - MAX_CELLS_VERTICAL) {
                    this.jVisible++;
                }
                break;
        }

    } else { // game camera

        var position = this.character.getPosition();
        bounds.i1 = 0; // default
        bounds.j1 = 0;
        switch (this.lastMovement) {
            case LEFT:
                if (position.i == this.iVisible + 4) {
                    if (this.iVisible != 0) {
                        this.iVisible--;
                    }
                }
                break;
            case UP:
                if (position.j == this.jVisible + 4) {
                    if (this.jVisible != 0) {
                        this.jVisible--;
                    }
                }
                break;
            case RIGHT:
                if (position.i == this.iVisible + MAX_CELLS_HORIZONTAL - 4) {
                    if (this.iVisible + MAX_CELLS_HORIZONTAL != this.n) {
                        this.iVisible++;
                    }
                }
                break;
            case DOWN:
                if (position.j == this.jVisible + MAX_CELLS_VERTICAL - 4) {
                    if (this.jVisible + MAX_CELLS_VERTICAL != this.m) {
                        this.jVisible++;
                    }
                }
                break;
        }
    }

    bounds.i1 = this.iVisible;
    bounds.j1 = this.jVisible;
    return bounds;
};


Board.prototype.updateMarker = function (markerID, markerName, value) {

    if (value == undefined) {
        var marker = document.getElementById(markerID + "_div");
        marker.style.visibility = "hidden";

    } else if (markerID == "marker1" && value == -1) {
        document.getElementById("marker1_h1").style.display = "none";
        document.getElementById("marker1_div2").style.display = "block";

    } else {
        var marker = document.getElementById(markerID + "_h1");
        document.getElementById(markerID + "_b").innerHTML = markerName;

        switch (markerName) {
            case "Time":
                marker.innerHTML = value + " / " + this.totalTime;
                break;
            case "Diamonds":
                marker.innerHTML = value;
                break;
            case "Monsters":
                marker.innerHTML = value;
                break;
            case "Keys":
                marker.innerHTML = value;
                break;
            case "Dynamite":
                marker.innerHTML = value;
                break;
        }
    }
};


Board.prototype.addDust = function (i, j) {
    this.dust.push({
        pos: [i, j],
        sprite: new Sprite([0, 0], [CELL_SIZE, CELL_SIZE], 23, [0, 1, 2, 3, 4, 5], "horizontal", true)
    });
};


Board.prototype.addShining = function (i, j) {
    this.shining.push({
        pos: [i, j],
        sprite: new Sprite([0, 50], [CELL_SIZE, CELL_SIZE], 20, [0, 1, 2], "horizontal", true)
    });
};


Board.prototype.addExplosions = function (i, j) {
    // 3x3 explosion
    this.addExplosion(i, j);
    this.addExplosion(i + 1, j);
    this.addExplosion(i - 1, j);
    this.addExplosion(i, j + 1);
    this.addExplosion(i, j - 1);
    this.addExplosion(i + 1, j + 1);
    this.addExplosion(i + 1, j - 1);
    this.addExplosion(i - 1, j + 1);
    this.addExplosion(i - 1, j - 1);
};

Board.prototype.addExplosion = function (i, j) {
    if (this.getCell(i, j) != CELL_WALL) {
        this.explosions.push({
            pos: [i, j],
            sprite: new Sprite([0, 0], [CELL_SIZE, CELL_SIZE], 10, [0, 1, 2, 3, 4, 5], "horizontal", true)
        });
        this.setCell(CELL_EMPTY, i, j);
    }
};


Board.prototype.addCharAnimation = function (i, j, movementType) {
    var sprMapHeight;
    switch (movementType) {
        case LEFT:
            sprMapHeight = 150;
            break;
        case UP:
            sprMapHeight = 200;
            break;
        case RIGHT:
            sprMapHeight = 250;
            break;
        case DOWN:
            sprMapHeight = 300;
            break;
    }
    this.charAnimation.push({
        pos: [i, j],
        sprite: new Sprite([0, sprMapHeight], [CELL_SIZE, CELL_SIZE], 1, [0, 1, 2, 3], "horizontal", true)
    });
};


Board.prototype.updateGameElements = function (deltaTime) {

    // update character & land dust
    this.updateElement(deltaTime, this.dust);

    // update monsters

    // update diamonds & rocks
    this.updateElement(deltaTime, this.shining);

    // update key & door

    // update explosions
    this.updateElement(deltaTime, this.explosions);

    // update character animation
    this.updateElement(deltaTime, this.charAnimation);
};


Board.prototype.updateElement = function (deltaTime, elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.sprite.update(deltaTime);

        // Remove if animation is done
        if (element.sprite.done) {
            elements.splice(i, 1);
            i--;
        }
    }
};