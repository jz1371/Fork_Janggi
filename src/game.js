angular.module('myApp',[]).controller('Ctrl', function (
    $window, $scope, $log, $timeout, $translate, resizeGameAreaService, gameService, gameLogic, dragAndDropService) {

    'use strict';

    /*****************************************
     **  configuration for game controller **
     ****************************************/
    // whether show dragging highlight lines during dragging process
    var showDraggingLines = true;

    // whether output information to console
    var verbose = false;


    /* enable platform's resizeGameArea service */
    resizeGameAreaService.setWidthToHeight(0.9);

    var gameArea               = document.getElementById("gameArea");
    var draggingLines          = document.getElementById("draggingLines");
    var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    var verticalDraggingLine   = document.getElementById("verticalDraggingLine");

    var draggingPiece = null;
    var draggingStartedRowCol = null;
    var rowsNum = 10;
    var colsNum = 9;
    var nextZIndex = 91;

    var CELL_HEIGHT = gameArea.clientHeight / rowsNum;
    var CELL_WIDTH  = gameArea.clientWidth  / colsNum;

    function printMessage(msg, stringify) {
        if (verbose) {
            if (stringify !== undefined && stringify === true) {
                $log.info(JSON.stringify(msg));
            } else {
                $log.info(msg);
            }
        }
    }

    function getDraggingPiece(row, col) {
        return document.getElementById("e2e_test_img_" + row + "x" + col);
    }

    function handleDragEvent(type, clientX, clientY) {
        var offsetX = clientX - gameArea.offsetLeft;
        var offsetY = clientY - gameArea.offsetTop;
        if (offsetX < 0 || offsetY < 0 || offsetX >= gameArea.clientWidth || offsetY >= gameArea.clientHeight) {
            draggingLines.style.display = "none";
        }
        var row = Math.floor(rowsNum * offsetY / gameArea.clientHeight);
        var col = Math.floor(colsNum * offsetX / gameArea.clientWidth);
        if (type === "touchstart") {
            dragStartHandler(row, col);
        }
        if (type === "touchend") {
            dragEndHandler(row, col);
        } else {
            if (draggingPiece) {
                // drag event continue
                dragContinueHandler(row, col, offsetX, offsetY);
            }
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
            // clear drag status
            if (draggingStartedRowCol) {
                setDraggingPieceTopLeft(getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col));
            }
            draggingPiece = null;
            draggingStartedRowCol = null;
            draggingLines.style.display = "none";
        }
    }

    function dragStartHandler(row, col) {
        $scope.pieceDragged = $scope.board[row][col];
        var pieceColor = $scope.pieceDragged[0];
        var pieceOwner = pieceColor === "R" ? 0 : pieceColor === "B" ? 1 : undefined;
        if ( $scope.turnIndex !== pieceOwner) {
            // not moving your own chess piece
            printMessage("this is not your chess piece");
            return;
        }
        $scope.pieceDraggedLocation = {row: row, col: col};
        draggingStartedRowCol = $scope.pieceDraggedLocation;
        draggingPiece = getDraggingPiece(row, col);
        draggingPiece.style['z-index'] = ++nextZIndex;
        calculateMovablePositionsOnBoard(row, col);
        printMessage("Moved " + $scope.pieceDragged + " at " + row + " " + col);

        drawDraggingLines(row, col);
    }

    function dragContinueHandler(row, col, x, y) {

        var left = x - CELL_WIDTH / 2 + 0.1 * CELL_WIDTH;
        var top = y - CELL_HEIGHT / 2;
        printMessage("dragging at: " + $scope.pieceDragged + " at " + row + " " + col);
        setDraggingPieceTopLeft({top: top, left: left});
        drawDraggingLines(row, col);
    }

    function drawDraggingLines(row, col) {
        if (showDraggingLines) {
            draggingLines.style.display = "inline";
            var centerXY = getSquareCenterXY(row, col);
            verticalDraggingLine.setAttribute("x1", centerXY.x);
            verticalDraggingLine.setAttribute("x2", centerXY.x);
            horizontalDraggingLine.setAttribute("y1", centerXY.y);
            horizontalDraggingLine.setAttribute("y2", centerXY.y);
        }
    }

    function setDraggingPieceTopLeft(topLeft) {
        var originalSize = getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col);
        draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
    }

    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / colsNum,
            height: gameArea.clientHeight / rowsNum
        };
    }
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return {top: row * size.height, left: col * size.width};
    }

    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col * size.width + size.width / 2,
            y: row * size.height + size.height / 2
        };
    }

    // USED FOR ANIMATIONS
    $scope.animatePiece = null;
    $scope.animatePieceFromLocation = null;
    $scope.animateFlag = false;
    $scope.animatePieceToLocation = null;
    $scope.secondClicked = false;
    $scope.getStyle = function() {};

    // On the NEXT turn, the AI will move the blue pieces
    $scope.AI = false;
    $scope.toggleAI = function () {
        if (!$scope.AI) {
            $scope.AI = true;
            $log.info("AI is on");
            //sendComputerMove();
        } else if ($scope.AI) {
            $scope.AI = false;
            $log.info("AI is off");
            //sendComputerMove();
        }
    };

    function sendComputerMove() {
        $scope.secondClicked = true;
        var oldBoard = $scope.board;
        var cpuMove = gameLogic.createComputerMove($scope.board, $scope.turnIndex);
        $scope.animatePiece = cpuMove[2].set.value.piece;
        $scope.animatePieceFromLocation = findPiece(oldBoard, $scope.animatePiece);
        $scope.animatePieceToLocation = { row: cpuMove[2].set.value.row, col: cpuMove[2].set.value.col };
        $log.info("INSIDE: (" + $scope.animatePieceFromLocation.row + ", " + $scope.animatePieceFromLocation.col + ") to (" + $scope.animatePieceToLocation.row + ", " + $scope.animatePieceToLocation.row);
        try {
            gameService.makeMove(cpuMove);
        } catch (e) {

        }
    }

    function findPiece(board, piece) {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 9; j++) {
                if (board[i][j] === piece) {
                    return { row: i, col: j };
                }
            }
        }
    }

    // Used to determine whether a square on the board is valid to move to.
    $scope.movable = [[false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false]];

    $scope.pieceDragged = null;

    function dragEndHandler (row, col) {
        if (!$scope.movable[row][col]) {
            return;
        }
        $scope.pieceToMove = $scope.pieceDragged;
        $scope.pieceToMoveLocation = $scope.pieceDraggedLocation;
        printMessage(row + " " + col);
        $scope.firstClicked = true;

        if ($scope.turnIndex === 0) {
            $scope.turnColor = 'R';
        }
        else if ($scope.turnIndex === 1) {
            $scope.turnColor = 'B';
        }

        try {
            $scope.cellClicked(row, col, true);
        } catch (e) {
            return;
        }
    }

    function calculateMovablePositionsOnBoard(row, col) {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 9; j++) {
                $scope.movable[i][j] = false;
            }
        }
        var moves = gameLogic.determineMoves($scope.board, $scope.board[row][col]);
        for (var k = 0; k < moves.length; k++) {
            $scope.movable[moves[k].row][moves[k].col] = true;
        }
    }

    function updateUI(params) {
        $scope.board = params.stateAfterMove.board;
        if ($scope.board === undefined) {
            $scope.board = gameLogic.getInitialBoard();
        }
        $scope.isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove;
        $scope.turnIndex = params.turnIndexAfterMove;

        // Is it the computer's turn?
        //if (params.turnIndexAfterMove == 1 && $scope.AI)
        if (params.turnIndexAfterMove === 1 && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            // for 500 ms until animation ends
            $timeout(sendComputerMove, 500);
        }
    }

    updateUI({ stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

    $scope.cellClicked = function (row, col, flag) {
        printMessage(["Clicked on cell:", row, col]);
        if (!$scope.isYourTurn) {
            return;
        }
        // WHAT HAPPENS AFTER THE CELL IS CLICKED BY THE CORRECT PLAYER
        try {
            if ($scope.board[row][col][0] === 'R' && $scope.firstClicked !== true)
            {
                $scope.turn = 0;
                $scope.turnColor = 'R';
            }
            else if ($scope.board[row][col][0] === 'B' && $scope.firstClicked !== true)
            {
                $scope.turn = 1;
                $scope.turnColor = 'B';
            }
            else if ($scope.firstClicked !== true && $scope.board[row][col] === '')
            {
                throw new Error();
            }

            // Clicking on another piece of the same color
            if ($scope.firstClicked === true && $scope.board[row][col][0] === $scope.turnColor)
            {
                $scope.pieceToMove = $scope.board[row][col];
                $scope.animatePieceFromLocation = { row: row, col: col };
                printMessage(["pieceToMove:", $scope.pieceToMove]);
            }
            // Second click - try to make a move; if invalid, throw exception
            else if ($scope.firstClicked === true) {

                $scope.animateFlag = flag === false;

                var move = gameLogic.createMove($scope.board, $scope.pieceToMove, row, col, $scope.turnIndex);
                $scope.isYourTurn = false;

                delete $scope.firstClicked;
                $scope.secondClicked = true;
                // Show animations and only then send makeMove.
                animateIt($scope.pieceToMove, move);
                $scope.animatePiece = $scope.pieceToMove;
                $scope.animatePieceToLocation = { row: row, col: col };
                delete $scope.pieceToMove;
                delete $scope.pieceToMoveLocation;
                //sendMakeMove(move);

            }
            // Have not clicked a piece yet - just clicked
            else if ($scope.turnIndex === $scope.turn)
            {
                $scope.pieceToMove = $scope.board[row][col];
                $scope.pieceToMoveLocation = { row: row, col: col };
                $scope.animatePieceFromLocation = $scope.pieceToMoveLocation;
                $scope.firstClicked = true;
                $scope.secondClicked = false;
                printMessage(["pieceToMove:", $scope.pieceToMove]);
            }
            else {
                $scope.firstClicked = false;
                $scope.secondClicked = false;
                printMessage(["Not your piece!"]);
            }

        }
        catch (e) {
            printMessage(["Invalid Move:", row, col]);
            return;
        }
    };

    gameService.setGame({
        //gameDeveloperEmail: "shu0018sh2514@gmail.com",
        gameDeveloperEmail: "jz1371@nyu.edu",
        minNumberOfPlayers: 2,
        maxNumberOfPlayers: 2,
        exampleGame: gameLogic.getExampleGame(),
        riddles: gameLogic.getRiddles(),
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
    });

    /* enable platform's drag-n-drop service */
    dragAndDropService.addDragListener("gameArea", handleDragEvent);

    function animateIt(thePiece, move)
    {
        printMessage("PIECE = " + ('#' + thePiece));
        try  {
            gameService.makeMove(move);
        } catch(e) {
        }
    }
});
