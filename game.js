'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'myApp.scaleBodyService', 'platformApp', 'ngTouch', 'ngDragDrop'])
  .controller('Ctrl', function (
      $window, $scope, $log, $animate, $timeout,
      messageService, scaleBodyService, stateService, gameLogic) {

      var moveAudio = new Audio('audio/move.wav');
      moveAudio.load();
    

      // On the NEXT turn, the AI will move the blue pieces
      $scope.AI = false;
      $scope.toggleAI = function ()
      {
          if (!$scope.AI)
          {
              $scope.AI = true;
              $log.info("AI is on");
              //sendComputerMove();
          }
          else if ($scope.AI)
          {
              $scope.AI = false;
              $log.info("AI is off");
              //sendComputerMove();
          }
      }

      function sendComputerMove()
      {
          var theMove = gameLogic.createComputerMove($scope.board, $scope.turnIndex)
          sendMakeMove(theMove);
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

    $scope.pieceDragged;

    $scope.onStartCallback = function ()
    {
        // reset previous values
        for (var i = 0; i < 10; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                $scope.movable[i][j] = false;
            }
        }

        $scope.pieceDragged = $scope.board[arguments[2]][arguments[3]];
        $scope.pieceDraggedLocation = {row: arguments[2], col: arguments[3]};

        if ($scope.pieceDragged[0] === "R")
            var playerIndex = 0;
        else if ($scope.pieceDragged[0] === "B")
            var playerIndex = 1;
        else
            return;

        $log.info("Moved " + $scope.pieceDragged + " at " + arguments[2] + " " + arguments[3]);

        // if not moving the right colored piece, just return
        if (($scope.turnIndex) != playerIndex)
            return;
        // else compute possible moves
        calculateMovable(arguments[2], arguments[3]);
    }

    $scope.onDropCallback = function ()
    {
        $scope.pieceToMove = $scope.pieceDragged;
        $scope.pieceToMoveLocation = $scope.pieceDraggedLocation;
        $log.info(arguments[2] + " " + arguments[3]);
        $scope.firstClicked = true;

        if ($scope.turnIndex === 0)
            $scope.turnColor = 'R';
        else if ($scope.turnIndex === 1)
            $scope.turnColor = 'B';

        $scope.cellClicked(arguments[2], arguments[3]);
    }

    function calculateMovable(row, col)
    {
        var moves = gameLogic.determineMoves($scope.board, $scope.board[row][col]);

        for (var i = 0; i < moves.length; i++)
        {
            $scope.movable[moves[i].row][moves[i].col] = true;
        }
    }

    var isLocalTesting = $window.parent == $window;

    function updateUI(params)
    {
        $scope.board = params.stateAfterMove.board;
        if ($scope.board === undefined)
        {
            $scope.board = gameLogic.getInitialBoard();
        }
        else
        {
            moveAudio.play();
        }
        $scope.isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove;
        $scope.turnIndex = params.turnIndexAfterMove;

        // Is it the computer's turn?
        if (params.turnIndexAfterMove == 1 && $scope.AI)
        {
            // for 500 ms until animation ends
            $timeout(sendComputerMove, 500);
        }
    }

    function sendMakeMove(move)
    {
        $log.info(["Making move:", move]);
        if (isLocalTesting)
        {
            stateService.makeMove(move);
        }
        else
        {
            messageService.sendMessage({ makeMove: move });
        }

    }

    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    var game = {
      gameDeveloperEmail: "shu0018sh2514@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles()
    };

    $scope.cellClicked = function (row, col) {
        $log.info(["Clicked on cell:", row, col]);
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
                $log.info(["pieceToMove:", $scope.pieceToMove]);
            }
            // Second click - try to make a move; if invalid, throw exception
            else if ($scope.firstClicked === true)
            {
                var move = gameLogic.createMove($scope.board, $scope.pieceToMove, row, col, $scope.turnIndex);
                $scope.isYourTurn = false;
                
                delete $scope.firstClicked;
                // Show animations and only then send makeMove.
                animateIt($scope.pieceToMove, move);
                delete $scope.pieceToMove;
                delete $scope.pieceToMoveLocation;
                //sendMakeMove(move);
                
            }
            // Have not clicked a piece yet
            else if ($scope.turnIndex === $scope.turn)
            {
                $scope.pieceToMove = $scope.board[row][col];
                $scope.pieceToMoveLocation = {row: row, col: col};
                $scope.firstClicked = true;
                $log.info(["pieceToMove:", $scope.pieceToMove]);
            }
            else
            {
                $log.info(["Not your piece!"]);
            }
            
        }
        catch (e) {
            $log.info(["Invalid Move:", row, col]);
            return;
        }
    };

    scaleBodyService.scaleBody({ width: 900, height: 1000});

    if (isLocalTesting) {
      game.isMoveOk = gameLogic.isMoveOk;
      game.updateUI = updateUI;
      stateService.setGame(game);
    } else {
      messageService.addMessageListener(function (message) {
        if (message.isMoveOk !== undefined) {
          var isMoveOkResult = gameLogic.isMoveOk(message.isMoveOk);
          messageService.sendMessage({isMoveOkResult: isMoveOkResult});
        } else if (message.updateUI !== undefined) {
          updateUI(message.updateUI);
        }
      });

      messageService.sendMessage({gameReady : game});
    }
    
    function animateIt(thePiece, move)
    {
        $log.info("PIECE = " + ('#' + thePiece));
        $animate.addClass(('#' + thePiece), 'testing', sendMakeMove(move));
    }

  });