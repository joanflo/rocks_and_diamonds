
(function () {
    "use strict";

    var board;
    var graphics;

    var timeLeft;
    var oldTimeEpoch;
    var requestId;
    var then;
    var intervalFPS = 1000 / FPS;

    var lastKeyPressed = false;
    var lastCharacterPos;

    var boardChanged;
    var mode;
    var dataReader;


    var rocks_n_gems = new Object();
    rocks_n_gems.startGame = function (fn, fps) {
        oldTimeEpoch = Date.now();
        then = oldTimeEpoch;
        mainLoop(0);
    }
    rocks_n_gems.pauseGame = function () {
        cancelAnimationFrame(requestId);
    }
    rocks_n_gems.resumeGame = function () {
        
    }
    rocks_n_gems.stopGame = function () {
        cancelAnimationFrame(requestId);
    }


    WinJS.UI.Pages.define("/pages/game/game.html", {
        
        ready: function (element, options) {

            if (!ready) {
                ready = true;
                mode = options;

                var pagetitle = document.getElementsByClassName('pagetitle')[0];
                switch (options) {
                    case TUTORIAL:
                        pagetitle.innerText = "Tutorial";

                        initGame(16, 12);
                        rocks_n_gems.startGame();
                        break;

                    case CATCH_EM_ALL:
                        pagetitle.innerText = "Catch Em All!";

                        genRandomBoard(CATCH_EM_ALL, 100, 80, 100);
                        rocks_n_gems.startGame();
                        break;

                    case KILL_EM_ALL:
                        pagetitle.innerText = "Kill Em All!";

                        genRandomBoard(KILL_EM_ALL, 100, 80, 150);
                        rocks_n_gems.startGame();
                        break;

                    case LEVEL_EDITOR:
                        pagetitle.innerText = "Level Editor!";

                        initGame(16, 12);
                        break;

                    default:
                        if (CAMPAIGN == options.mode) { // CAMPAIGN
                            mode = CAMPAIGN;

                            switch (options.difficulty) {
                                case NORMAL_MODE:
                                    pagetitle.innerText = options.title + " [Normal mode]";
                                    break;
                                case HARD_MODE:
                                    pagetitle.innerText = options.title + " [Hard mode]";
                                    break;
                            }

                            loadLevel(options.level);
                        }
                        break;
                }

            } else {

                if (options != undefined) { // load new selected file
                    loadGame(options);
                    WinJS.Navigation.history.backStack.length -= 2;
                } else { // no selected file
                    initGame(16, 12); // borders
                }
            }
        },

        unload: function () {
            //share
            /*
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.removeEventListener("datarequested", dataRequested);
            */

            //if (WinJS.Navigation.history.) {
            checkConditions(undefined);
            //}
        }

    });


    var x = 0;
    function mainLoop(time) {
        requestId = requestAnimationFrame(mainLoop);

        var now = Date.now();
        var deltaTime = now - then;

        if (deltaTime > intervalFPS) { // limiting fps
            then = now - (deltaTime % intervalFPS);

            // time
            var timeLeft = board.getTotalTime() - Math.floor((now - oldTimeEpoch) / 1000);
            board.updateMarker("marker1", "Time", timeLeft);

            // 
            handleInput();

            // update entities
            if (x == 0) {
                board.addExplosions(3, 3);
                x++;
            }
            board.updateGameElements(deltaTime);

            // graphics
            graphics.render(deltaTime);

            // check collisions


            // game over
            if (timeLeft == 0) {
                rocks_n_gems.stopGame();
                var msg = new Windows.UI.Popups.MessageDialog("GAME OVER. Time's up!");
                msg.showAsync();
            }
        }
    }


    function loadLevel(levelNumber) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localFolder = applicationData.localFolder;
        localFolder.getFileAsync("level" + levelNumber + ".lvl").then(function (file) {
            return file;
        }).done(function (file) {
            loadGame(file);
        }, function () {
            var msg = new Windows.UI.Popups.MessageDialog("An error has occurred during level loading.");
            msg.showAsync();
        });
    }


    function genRandomBoard(mode, n, m, time) {
        initGame(n, m);
        board.setTotalTime(time);
        timeLeft = time;
        switch (mode) {
            case KILL_EM_ALL:
                board.genRandomMatrix(KILL_EM_ALL);
                break;
            case CATCH_EM_ALL:
                board.genRandomMatrix(CATCH_EM_ALL);
                break;
        }
        graphics.drawBoard();
    }


    function initGame(n, m) {
        boardChanged = false;
        board = new Board(n, m);
        if (mode == CAMPAIGN || (mode == LEVEL_EDITOR && n == undefined)) {
            loadFile(dataReader, board);
        }
        graphics = new Graphics(board);
        timeLeft = board.getTotalTime();
        board.setGraphics(graphics);
        graphics.drawBoard();
        initInterfaceItems();
    }


    function initInterfaceItems() {
        switch (mode) {
            case TUTORIAL:
                //markers
                board.updateMarker("marker1", "Time", timeLeft);
                board.updateMarker("marker2", "Dynamite", 0);
                board.updateMarker("marker3", "Diamonds", 0);
                board.updateMarker("marker4", "Monsters", 0);
                break;

            case CATCH_EM_ALL: // <----
                //markers
                board.updateMarker("marker1", "Time", timeLeft);
                board.updateMarker("marker2", "Dynamite", 0);
                board.updateMarker("marker3", "Diamonds", 0);
                board.updateMarker("marker4", "", undefined);
                break;

            case KILL_EM_ALL: // <----
                //markers
                board.updateMarker("marker1", "Time", timeLeft);
                board.updateMarker("marker2", "Dynamite", 0);
                board.updateMarker("marker3", "Monsters", 0);
                board.updateMarker("marker4", "", undefined);
                break;

            case CAMPAIGN: // <----
                //markers
                board.updateMarker("marker1", "Time", timeLeft);
                board.updateMarker("marker2", "Dynamite", board.getDynamiteNumber());
                board.updateMarker("marker3", "Diamonds", board.getGemsNumber());
                board.updateMarker("marker4", "Keys", board.getKeysNumber());
                break;

            case LEVEL_EDITOR:
                //appbars
                var bottomAppbar = document.getElementById('bottom_appbar');
                //bottomAppbar.disabled = true;
                bottomAppbar.disabled = false;
                bottomAppbar.winControl.show();
                var topAppbar = document.getElementById('top_appbar');
                topAppbar.disabled = false;
                topAppbar.winControl.show();

                //buttons
                setButton("empty_button");
                setButton("wall_button");
                setButton("land_button");
                setButton("character_button");
                setButton("monster_button");
                setButton("rock_button");
                setButton("gem_button");
                setButton("dynamite_button");
                setButton("key_button");
                setButton("door_button");

                //flyouts & appbar options
                document.getElementById("sizeChanged").addEventListener("click", controlManager, true);
                document.getElementById("saveFile").addEventListener("click", controlManager, true);
                document.getElementById("openBoard").addEventListener("click", controlManager, true);

                //markers
                board.updateMarker("marker1", "Time", -1);
                document.getElementById("marker1_input").onchange = function (e) {
                    var inputValue = document.getElementById("marker1_input").value;
                    if (inputValue.match(/^[0-9]+$/) && inputValue >= 10 && !inputValue <= 999) {
                        timeLeft = inputValue;
                        board.setTotalTime(inputValue);
                    } else {
                        var msg = new Windows.UI.Popups.MessageDialog("WRONG INPUT. Time must be a number value between 10 and 999.");
                        msg.showAsync();
                    }
                }
                board.updateMarker("marker2", "Dynamite", 0);
                board.updateMarker("marker3", "Diamonds", 0);
                board.updateMarker("marker4", "Keys", 0);
                break;

            default:
                break;
        }

        //keyboard
        document.addEventListener("keydown", controlManager);
        document.addEventListener("keyup", controlManager);

        //touchscreen events
        var gameBoard = document.getElementById("board");
        gameBoard.addEventListener("MSPointerDown", controlManager, false);
        var gesture = new MSGesture();
        gesture.target = gameBoard;
    }


    function setButton(id) {
        var button = document.getElementById(id);
        button.addEventListener("click", controlManager, false);
    }


    function loadGame(file) {

        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (readStream) {
            dataReader = new Windows.Storage.Streams.DataReader(readStream);
            dataReader.loadAsync(readStream.size).done(function (numBytesLoaded) {
                document.getElementById("board_filename").value = file.displayName;

                initGame(undefined, undefined);

                rocks_n_gems.startGame();
            });
            dataReader.close();
        });
    }


    function checkConditions(evtId) {
        switch (evtId) {
            case "sizeChanged":
            case "openBoard":
                if (boardChanged) {
                    // save changes?
                    var msg = new Windows.UI.Popups.MessageDialog("Are you sure you want to open a new board? If you continue, changes won't be saved.", "Board not saved");
                    msg.commands.append(new Windows.UI.Popups.UICommand("Continue", function (command) {
                        if (evtId == "sizeChanged") {
                            newBoard();
                        } else { // "openBoard"
                            // I know, it's a fucking botch (answer here: http://stackoverflow.com/questions/14224637/access-is-denied-error-in-windows-store-app-using-javascript)
                            setTimeout(openBoardFile, 100);
                        }
                    }, 0));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Save", function (command) {
                        //display flyout
                        var flyout = document.getElementById("save_board_flyout");
                        flyout.winControl.show(document.getElementById("saveBoard"));
                    }, 1));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Cancel", function (command) {
                        // ...
                    }, 2));

                    //Set the command to be invoked when a user presses ESC
                    msg.cancelCommandIndex = 2;
                    //Set the command that will be invoked by default
                    msg.defaultCommandIndex = 2;

                    msg.showAsync();
                } else {
                    if (evtId == "sizeChanged") {
                        newBoard();
                    } else { // "openBoard"
                        openBoardFile();
                    }
                }
                break;

            case "saveFile":
                var fileName = document.getElementById("board_filename").value;
                if (!fileName.match(/^[a-z0-9\s]+$/i)) { // alphanumeric - space characters

                    var msg = new Windows.UI.Popups.MessageDialog("File name cannot contain special characters or be empty. Spaces and alphanumeric characters are allowed.", "Wrong file name");
                    msg.commands.append(new Windows.UI.Popups.UICommand("Ok", function (command) {
                        //display flyout
                        var flyout = document.getElementById("save_board_flyout");
                        flyout.winControl.show(document.getElementById("saveBoard"));
                    }));
                    msg.showAsync();

                } else {
                    saveBoardFile(fileName);
                }
                break;

            default:
                if (boardChanged) { // level editor exit
                    // save changes?
                    var msg = new Windows.UI.Popups.MessageDialog("Are you sure you want to exit from the level editor? If you continue, changes won't be saved.", "Board not saved");
                    msg.commands.append(new Windows.UI.Popups.UICommand("Continue", function (command) {
                        // I know, it's a fucking botch (answer here: http://stackoverflow.com/questions/14224637/access-is-denied-error-in-windows-store-app-using-javascript)
                        setTimeout(openBoardFile, 100);
                    }, 0));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Save", function (command) {
                        //display flyout
                        var flyout = document.getElementById("save_board_flyout");
                        flyout.winControl.show(document.getElementById("saveBoard"));
                    }, 1));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Cancel", function (command) { }, 2));
                    msg.cancelCommandIndex = 2;
                    msg.defaultCommandIndex = 2;
                    msg.showAsync();
                }
                break;
        }
    }


    function newBoard() {
        var n = parseInt(document.getElementById("board_size_flyout_input_n").value);
        var m = parseInt(document.getElementById("board_size_flyout_input_m").value);
        initGame(n + 2, m + 2); //borders
        document.getElementById("board_filename").value = "";
    }


    function openBoardFile() {
        rocks_n_gems.pauseGame();
        openFile();
    }


    function saveBoardFile(fileName) {
        rocks_n_gems.pauseGame();
        saveFile(fileName, board);
        boardChanged = false;
    }


    function goBack() {
        WinJS.Navigation.back();
    }


    function controlManager(evt) {
        switch (evt.type) {
            case "MSPointerDown":
                // touch & left mouse button only
                if (evt.pointerType == evt.MSPOINTER_TYPE_TOUCH || evt.button == 0) {
                    boardChanged = true;
                    board.putElement(evt.offsetX, evt.offsetY);
                }
                break;

            case "click":
                switch (evt.target.id) {
                    case "playBoard":
                        
                        break;
                    case "sizeChanged":
                        var n = parseInt(document.getElementById("board_size_flyout_input_n").value);
                        var m = parseInt(document.getElementById("board_size_flyout_input_m").value);
                        if (n >= 14 && m >= 10) {
                            checkConditions(evt.target.id);
                        } else {
                            var msg = new Windows.UI.Popups.MessageDialog("The minimum board size it's 14x10.");
                            msg.showAsync();
                        }
                        break;
                    case "openBoard":
                        checkConditions(evt.target.id);
                        break;
                    case "saveFile":
                        checkConditions(evt.target.id);
                        break;
                    default:
                        //left button clicked
                        board.setCurrentItem(evt.currentTarget);
                        break;
                }

            case "keydown":
                var characterCode = (evt && evt.which) ? evt.which : evt.keyCode;
                switch (characterCode) {
                    case 32: //space
                        lastKeyPressed = SPACE;
                        break;
                    case 37: //left arrow
                        lastKeyPressed = LEFT;
                        break;
                    case 38: //up arrow
                        lastKeyPressed = UP;
                        break;
                    case 39: //right arrow
                        lastKeyPressed = RIGHT;
                        break;
                    case 40: //down arrow
                        lastKeyPressed = DOWN;
                        break;
                }
                break;
            case "keyup":
                var characterCode = (evt && evt.which) ? evt.which : evt.keyCode;
                switch (characterCode) {
                    case 32: // space
                        break;
                    case 37:
                    case 38:
                    case 39:
                    case 40: // left - up - right - down arrow
                        lastKeyPressed = false;
                        break;
                }
                break;
        }

    }


    function handleInput() {
        switch (lastKeyPressed) {
            case SPACE: //space
                lastCharacterPos = board.getCharacter().getPosition();
                setTimeout(function () { board.placeDynamite(lastCharacterPos) }, 1000);
                lastKeyPressed = false;
                break;
            case LEFT:
            case UP:
            case RIGHT:
            case DOWN: //left - up - right - down arrow
                board.moveCamera(lastKeyPressed, mode);
                break;
        }
    }


})();
