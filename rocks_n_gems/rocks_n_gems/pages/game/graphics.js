

/* Constructor */
function Graphics(board) {
    this.board = board;
    var gameBoard = document.getElementById("board");
    this.canvasManager = gameBoard.getContext("2d");
    this.canvasManager.fillStyle = '#161616';
    this.loadImages();
}


Graphics.prototype.loadImages = function () {
    // game elements
    this.doorImageBottom = loadImage("elements/door_bottom.png");
    this.doorImageLeft = loadImage("elements/door_left.png");
    this.doorImageRight = loadImage("elements/door_right.png");
    this.doorImageUp = loadImage("elements/door_up.png");
    this.emptyImage = loadImage("elements/empty.png");
    this.wallImage = loadImage("elements/wall.png");
    this.landImage = loadImage("elements/land.png");
    this.characterImage = loadImage("elements/character.png");
    this.monsterImage = loadImage("elements/monster.png");
    this.gemImage = loadImage("elements/gem.png");
    this.rockImage = loadImage("elements/rock.png");
    this.dynamiteImage = loadImage("elements/dynamite.png");
    this.keyImage = loadImage("elements/key.png");

    // game sprite
    this.spriteImage = loadImage("elements/sprite_map.png");
};


Graphics.prototype.render = function (deltaTime) {
    this.drawBoard();


    // render dust
    this.renderElement(deltaTime, this.board.getDust());

    // render shining
    this.renderElement(deltaTime, this.board.getShining());

    // render explosions
    this.renderElement(deltaTime, this.board.getMines());
    this.renderElement(deltaTime, this.board.getExplosions());

    // render chararacter animation
    this.renderElement(deltaTime, this.board.getCharAnimation());

    // render portal animation
    this.renderElement(deltaTime, this.board.getPortalAnimation());
};


Graphics.prototype.renderElement = function (deltaTime, elements, hasOffset) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var coord = element.sprite.render();

        if (coord != undefined) {
            visibleCoords = this.board.getVisibleCoords();
            this.drawAnimatedCell(this.spriteImage, element.pos[0] - visibleCoords[0], element.pos[1] - visibleCoords[1], coord[0], coord[1], coord[2]);
        }

    }
};


Graphics.prototype.drawBoard = function () {
    this.clearBoard();

    //drawing only visible board
    var bounds = this.board.calculateBounding();

    var x = 0;
    for (var i = bounds.i1; i < bounds.i1 + MAX_CELLS_HORIZONTAL; i++) {
        var y = 0;
        for (var j = bounds.j1; j < bounds.j1 + MAX_CELLS_VERTICAL; j++) {
            switch (this.board.boardMatrix[i][j]) {
                case CELL_EMPTY:
                    //null
                    break;
                case CELL_WALL:
                    this.drawCell(this.wallImage, x, y);
                    break;
                case CELL_LAND:
                    this.drawCell(this.landImage, x, y);
                    break;
                case CELL_CHARACTER:
                    this.drawCell(this.characterImage, x, y);
                    break;
                case CELL_MONSTER:
                    this.drawCell(this.monsterImage, x, y);
                    break;
                case CELL_ROCK:
                    this.drawCell(this.rockImage, x, y);
                    break;
                case CELL_GEM:
                    this.drawCell(this.gemImage, x, y);
                    break;
                case CELL_DYNAMITE:
                    this.drawCell(this.dynamiteImage, x, y);
                    break;
                case CELL_KEY:
                    this.drawCell(this.keyImage, x, y);
                    break;
                case CELL_DOOR:
                    this.drawCell(this.doorImageLeft, x, y);
                    if (x == 0) {
                        this.drawCell(this.doorImageLeft, x, y);
                    } else if (y == 0) {
                        this.drawCell(this.doorImageUp, x, y);
                    } else {
                        var mtx = this.board.getBoardMatrix();
                        if (x == mtx.length - 1) { //x == n-1
                            this.drawCell(this.doorImageRight, x, y);
                        } else if (y == mtx[1].length - 1) { //y == m-1
                            this.drawCell(this.doorImageBottom, x, y);
                        }
                    }
                    break;
            }
            y++;
        }
        x++;
    }
};


Graphics.prototype.drawCell = function (image, i, j) {
    this.canvasManager.drawImage(image, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
};


Graphics.prototype.drawAnimatedCell = function (image, i, j, xSpriteMap, ySpriteMap, sizeSpriteMap) {
    this.canvasManager.drawImage(this.spriteImage, xSpriteMap, ySpriteMap, sizeSpriteMap[0], sizeSpriteMap[1], i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
};


Graphics.prototype.clearBoard = function () {
    this.canvasManager.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIHGT);
};