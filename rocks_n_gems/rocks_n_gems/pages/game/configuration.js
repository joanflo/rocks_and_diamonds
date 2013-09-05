
var FPS = 30;


// cell codes
var CELL_EMPTY = 0;
var CELL_WALL = 1;
var CELL_CHARACTER = 2;
var CELL_MONSTER = 3;
var CELL_ROCK = 4;
var CELL_GEM = 5;
var CELL_LAND = 6;
var CELL_DYNAMITE = 7;
var CELL_KEY = 8;
var CELL_DOOR = 9;



// cell sizes
var CELL_SIZE = 50;

var BOARD_WIDTH = 800;
var BOARD_HEIHGT = 600;

var MAX_CELLS_HORIZONTAL = BOARD_WIDTH / CELL_SIZE;
var MAX_CELLS_VERTICAL = BOARD_HEIHGT / CELL_SIZE;



// movements
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var SPACE = 4;



// game mode
var TUTORIAL = 0;
var CAMPAIGN = 1;
var CATCH_EM_ALL = 2;
var KILL_EM_ALL = 3;
var LEVEL_EDITOR = 4;

var NORMAL_MODE = 0;
var HARD_MODE = 1;