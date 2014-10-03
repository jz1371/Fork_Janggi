'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, stateService, gameLogic) {

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
    updateUI({stateAfterMove: {}});
    var game = {
      gameDeveloperEmail: "shu0018sh2514@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles()
    };

    var isLocalTesting = $window.location.origin === "file://";
    $scope.move = "[{setTurn: {turnIndex: 1}}, {set: {key: 'board', value:[['', 'RH1', 'RE1', 'RU1', '', 'RU2', 'RE2', 'RH2', 'RR2'], ['RR1', '', '', '', 'RG1', '', '', '', ''], ['', 'RC1', '', '', '', '', '', 'RC2', ''], ['RS1', '', 'RS2', '', 'RS3', '', 'RS4', '', 'RS5'], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['BS1', '', 'BS2', '', 'BS3', '', 'BS4', '', 'BS5'], ['', 'BC1', '', '', '', '', '', 'BC2', ''], ['', '', '', '', 'BG1', '', '', '', ''], ['BR1', 'BH1', 'BE1', 'BU1', '', 'BU2', 'BE2', 'BH2', 'BR2']]}}, {set: {key: 'delta', value: {piece: 'RR1', row: 1, col: 0}}}]";
    $scope.makeMove = function () {
      $log.info(["Making move:", $scope.move]);
      var moveObj = eval($scope.move);
      if (isLocalTesting) {
        stateService.makeMove(moveObj);
      } else {
        messageService.sendMessage({makeMove: moveObj});
      }
    };

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