'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp')
    .controller('Ctrl', function (
      $window, $scope, $log, $animate, $timeout,
      gameService, scaleBodyService, gameLogic) {

      var moveAudio = new Audio('audio/move.wav');
      moveAudio.load();
    
        // USED FOR ANIMATIONS
      $scope.animatePiece;
      $scope.animatePieceFromLocation;
      $scope.animateFlag = false;
      $scope.animatePieceToLocation;
      $scope.secondClicked = false;
      $scope.getStyle = function (row, col)
      {
          if ($scope.secondClicked && $scope.animateFlag === true)
          {
              // Move Horse
              if ($scope.animatePiece[1] === "H")
              {
                  // up left
                  if (($scope.animatePieceFromLocation.row - 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 1 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_up_left .5s linear",
                          "animation": "move_horse_up_left .5s linear"
                      };
                  }
                  // up right 
                  else if (($scope.animatePieceFromLocation.row - 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 1 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_up_right .5s linear",
                          "animation": "move_horse_up_right .5s linear"
                      };
                  }
                  // down left
                  else if (($scope.animatePieceFromLocation.row + 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 1 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_down_left .5s linear",
                          "animation": "move_horse_down_left .5s linear"
                      };
                  }
                  // down right
                  else if (($scope.animatePieceFromLocation.row + 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 1 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_down_right .5s linear",
                          "animation": "move_horse_down_right .5s linear"
                      };
                  }
                  // left up (different from up left)
                  else if (($scope.animatePieceFromLocation.row - 1 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_left_up .5s linear",
                          "animation": "move_horse_left_up .5s linear"
                      };
                  }
                      // left down (different from down left)
                  else if (($scope.animatePieceFromLocation.row + 1 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_left_down .5s linear",
                          "animation": "move_horse_left_down .5s linear"
                      };
                  }
                      // right up (different from up right)
                  else if (($scope.animatePieceFromLocation.row - 1 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_right_up .5s linear",
                          "animation": "move_horse_right_up .5s linear"
                      };
                  }
                      // right down (different from down right)
                  else if (($scope.animatePieceFromLocation.row + 1 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_horse_right_down .5s linear",
                          "animation": "move_horse_right_down .5s linear"
                      };
                  }
              }
              // Move Elephant
              else if ($scope.animatePiece[1] === "E") {
                  // up left
                  if (($scope.animatePieceFromLocation.row - 3 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_up_left .5s linear",
                          "animation": "move_elephant_up_left .5s linear"
                      };
                  }
                      // up right 
                  else if (($scope.animatePieceFromLocation.row - 3 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_up_right .5s linear",
                          "animation": "move_elephant_up_right .5s linear"
                      };
                  }
                      // down left
                  else if (($scope.animatePieceFromLocation.row + 3 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_down_left .5s linear",
                          "animation": "move_elephant_down_left .5s linear"
                      };
                  }
                      // down right
                  else if (($scope.animatePieceFromLocation.row + 3 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 2 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_down_right .5s linear",
                          "animation": "move_elephant_down_right .5s linear"
                      };
                  }
                      // left up (different from up left)
                  else if (($scope.animatePieceFromLocation.row - 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 3 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_left_up .5s linear",
                          "animation": "move_elephant_left_up .5s linear"
                      };
                  }
                      // left down (different from down left)
                  else if (($scope.animatePieceFromLocation.row + 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - 3 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_left_down .5s linear",
                          "animation": "move_elephant_left_down .5s linear"
                      };
                  }
                      // right up (different from up right)
                  else if (($scope.animatePieceFromLocation.row - 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 3 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_right_up .5s linear",
                          "animation": "move_elephant_right_up .5s linear"
                      };
                  }
                      // right down (different from down right)
                  else if (($scope.animatePieceFromLocation.row + 2 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + 3 === $scope.animatePieceToLocation.col) &&
                  (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_elephant_right_down .5s linear",
                          "animation": "move_elephant_right_down .5s linear"
                      };
                  }
              }
              // "Normal" moves
              else
              {
                  // Determine which animation to return
                  // Moves up (1 - 8)
                  for (var i = 1; i < 9; i++)
                  {
                      if (($scope.animatePieceFromLocation.row - i === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_up .5s linear",
                                  "animation": "move_up .5s linear"
                              };
                          }
                          var whichAnimation = "move_up" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };   
                      }
                  }
                  
                  // Moves down (1 - 8)
                  for (var i = 1; i < 9; i++)
                  {
                      if (($scope.animatePieceFromLocation.row + i === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_down .5s linear",
                                  "animation": "move_down .5s linear"
                              };
                          }
                          var whichAnimation = "move_down" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                          
                      }
                  }
                  
                  // Moves left (1 - 8)
                  for (var i = 1; i < 9; i++)
                  {
                      if (($scope.animatePieceFromLocation.row === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - i === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_left .5s linear",
                                  "animation": "move_left .5s linear"
                              };
                          }
                          var whichAnimation = "move_left" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                      }
                  }
                  
                  // Moves right (1 - 8)
                  for (var i = 1; i < 9; i++)
                  {
                      if (($scope.animatePieceFromLocation.row === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + i === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_right .5s linear",
                                  "animation": "move_right .5s linear"
                              };
                          }
                          var whichAnimation = "move_right" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                      }
                  }

                  // Moves up 9
                  if (($scope.animatePieceFromLocation.row - 9 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_up9 .5s linear",
                          "animation": "move_up9 .5s linear"
                      };
                  }
                  // Moves down 9
                  else if (($scope.animatePieceFromLocation.row + 9 === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                      return {
                          "z-index": "3",
                          "-webkit-animation": "move_down9 .5s linear",
                          "animation": "move_down9 .5s linear"
                      };
                  }

                  // up left (can only move 1 or 2 spaces)
                  for (var i = 1; i < 3; i++)
                  {
                      if (($scope.animatePieceFromLocation.row - i === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - i === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_up_left .5s linear",
                                  "animation": "move_up_left .5s linear"
                              };
                          }
                          var whichAnimation = "move_up_left" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                      }
                  }
                  
                  // up right (can only move 1 or 2 spaces)
                  for (var i = 1; i < 3; i++)
                  {
                      if (($scope.animatePieceFromLocation.row - i === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + i === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_up_right .5s linear",
                                  "animation": "move_up_right .5s linear"
                              };
                          }
                          var whichAnimation = "move_up_right" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                      }
                  }
                  
                  // down left (can only move 1 or 2 spaces)
                  for (var i = 1; i < 3; i++)
                  {
                      if (($scope.animatePieceFromLocation.row + i === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col - i === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_down_left .5s linear",
                                  "animation": "move_down_left .5s linear"
                              };
                          }
                          var whichAnimation = "move_down_left" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                      }
                  }
                  
                  // down right (can only move 1 or 2 spaces)
                  for (var i = 1; i < 3; i++)
                  {
                      if (($scope.animatePieceFromLocation.row + i === $scope.animatePieceToLocation.row && $scope.animatePieceFromLocation.col + i === $scope.animatePieceToLocation.col) &&
                      (row === $scope.animatePieceToLocation.row && col === $scope.animatePieceToLocation.col)) {
                          if (i === 1)
                          {
                              return {
                                  "z-index": "3",
                                  "-webkit-animation": "move_down_right .5s linear",
                                  "animation": "move_down_right .5s linear"
                              };
                          }
                          var whichAnimation = "move_down_right" + i + " .5s linear";
                          return {
                              "z-index": "3",
                              "-webkit-animation": whichAnimation,
                              "animation": whichAnimation
                          };
                      }
                  }
                  
              }
              
          }
          else
          {
              return {};
          }
      }

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
          $scope.secondClicked = true;
          var oldBoard = $scope.board;
          var cpuMove = gameLogic.createComputerMove($scope.board, $scope.turnIndex);
          $scope.animatePiece = cpuMove[2].set.value.piece;
          $scope.animatePieceFromLocation = findPiece(oldBoard, $scope.animatePiece);
          $scope.animatePieceToLocation = { row: cpuMove[2].set.value.row, col: cpuMove[2].set.value.col };
          $log.info("INSIDE: (" + $scope.animatePieceFromLocation.row + ", " + $scope.animatePieceFromLocation.col + ") to (" + $scope.animatePieceToLocation.row + ", " + $scope.animatePieceToLocation.row);
          gameService.makeMove(cpuMove);
      }

      function findPiece(board, piece)
      {
          for (var i = 0; i < 10; i++)
          {
              for (var j = 0; j < 9; j++)
              {
                  if (board[i][j] === piece)
                      return { row: i, col: j };
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

    $scope.pieceDragged;

    // Angular dragdrop version
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

    // ng-draggable version
    $scope.onStartCallback2 = function (row, col)
    {
        for (var i = 0; i < 10; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                $scope.movable[i][j] = false;
            }
        }

        $scope.pieceDragged = $scope.board[row][col];
        $scope.pieceDraggedLocation = { row: row, col: col };

        if ($scope.pieceDragged[0] == "R")
            var playerIndex = 0;
        else if ($scope.pieceDragged[0] == "B")
            var playerIndex = 1;
        else
            return;
 
        $log.info("Moved " + $scope.pieceDragged + " at " + row + " " + col);

        // if not moving the right colored piece, just return
        if (($scope.turnIndex) != playerIndex)
            return;
        // else compute possible moves
        calculateMovable(row, col);
    }
    
    // Angular dragdrop version
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

    // ng-draggable version
    $scope.onDropCallback2 = function (row, col)
    {
        if (!$scope.movable[row][col])
            return;
        $scope.pieceToMove = $scope.pieceDragged;
        $scope.pieceToMoveLocation = $scope.pieceDraggedLocation;
        $log.info(row + " " + col);
        $scope.firstClicked = true;

        if ($scope.turnIndex === 0)
            $scope.turnColor = 'R';
        else if ($scope.turnIndex === 1)
            $scope.turnColor = 'B';

        $scope.cellClicked(row, col, true);
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
            moveAudio.load();
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

    /*
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
    */

    updateUI({ stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2 });
    /*
    var game = {
      gameDeveloperEmail: "shu0018sh2514@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles()
    };
    */

    $scope.cellClicked = function (row, col, flag) {
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
                $scope.animatePieceFromLocation = { row: row, col: col };
                $log.info(["pieceToMove:", $scope.pieceToMove]);
            }
            // Second click - try to make a move; if invalid, throw exception
            else if ($scope.firstClicked === true)
            {
                if (flag === true)
                {
                    $scope.animateFlag = false;
                }
                    
                else
                {
                    $scope.animateFlag = true;
                }
                    
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
                $log.info(["pieceToMove:", $scope.pieceToMove]);
            }
            else
            {
                $scope.firstClicked = false;
                $scope.secondClicked = false;
                $log.info(["Not your piece!"]);
            }
            
        }
        catch (e) {
            $log.info(["Invalid Move:", row, col]);
            return;
        }
    };


    gameService.setGame({
        gameDeveloperEmail: "shu0018sh2514@gmail.com",
        minNumberOfPlayers: 2,
        maxNumberOfPlayers: 2,
        exampleGame: gameLogic.getExampleGame(),
        riddles: gameLogic.getRiddles(),
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
    });
    
    /*
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
    */
    
    function animateIt(thePiece, move)
    {
        $log.info("PIECE = " + ('#' + thePiece));
        //$animate.addClass(('#' + thePiece), 'testing', sendMakeMove(move));
        $animate.addClass(('#' + thePiece), 'testing', gameService.makeMove(move));
    }

  });