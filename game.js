'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'myApp.scaleBodyService', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, scaleBodyService, stateService, gameLogic) {
    /*
    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      if ($scope.board === undefined) {
        $scope.board = [['RR1', 'RH1', 'RE1', 'RU1', '', 'RU2', 'RE2', 'RH2', 'RR2'],
                        ['', '', '', '', 'RG1', '', '', '', ''],
                        ['', 'RC1', '', '', '', '', '', 'RC2', ''],
                        ['RS1', '', 'RS2', '', 'RS3', '', 'RS4', '', 'RS5'],
                        ['', '', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', '', ''],
                        ['BS1', '', 'BS2', '', 'BS3', '', 'BS4', '', 'BS5'],
                        ['', 'BC1', '', '', '', '', '', 'BC2', ''],
                        ['', '', '', '', 'BG1', '', '', '', ''],
                        ['BR1', 'BH1', 'BE1', 'BU1', '', 'BU2', 'BE2', 'BH2', 'BR2']
                       ];
      }
    }
    */

    var isLocalTesting = $window.parent == $window;

    function updateUI(params)
    {
        $scope.board = params.stateAfterMove.board;
        if ($scope.board === undefined)
        {
            $scope.board = gameLogic.getInitialBoard();
        }
        $scope.isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove;
        $scope.turnIndex = params.turnIndexAfterMove;
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

    //var isLocalTesting = $window.location.origin === "file://";
    //$scope.move = "[{setTurn: {turnIndex: 1}}, {set: {key: 'board', value:[['', 'RH1', 'RE1', 'RU1', '', 'RU2', 'RE2', 'RH2', 'RR2'], ['RR1', '', '', '', 'RG1', '', '', '', ''], ['', 'RC1', '', '', '', '', '', 'RC2', ''], ['RS1', '', 'RS2', '', 'RS3', '', 'RS4', '', 'RS5'], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['BS1', '', 'BS2', '', 'BS3', '', 'BS4', '', 'BS5'], ['', 'BC1', '', '', '', '', '', 'BC2', ''], ['', '', '', '', 'BG1', '', '', '', ''], ['BR1', 'BH1', 'BE1', 'BU1', '', 'BU2', 'BE2', 'BH2', 'BR2']]}}, {set: {key: 'delta', value: {piece: 'RR1', row: 1, col: 0}}}]";
    /*
    $scope.makeMove = function () {
      $log.info(["Making move:", $scope.move]);
      var moveObj = eval($scope.move);
      if (isLocalTesting) {
        stateService.makeMove(moveObj);
      } else {
        messageService.sendMessage({makeMove: moveObj});
      }
    };
    */

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

            if ($scope.firstClicked === true && $scope.board[row][col][0] === $scope.turnColor)
            {
                $scope.pieceToMove = $scope.board[row][col];
                $log.info(["pieceToMove:", $scope.pieceToMove]);
            }
            else if ($scope.firstClicked === true)
            {
                var move = gameLogic.createMove($scope.board, $scope.pieceToMove, row, col, $scope.turnIndex);
                $scope.isYourTurn = false;
                delete $scope.pieceToMove;
                delete $scope.firstClicked;
                // Show animations and only then send makeMove.
                sendMakeMove(move);
            }
            else if ($scope.turnIndex === $scope.turn)
            {
                $scope.pieceToMove = $scope.board[row][col];
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

    //scaleBodyService.scaleBody({ width: 910, height: 1011 });
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
  });