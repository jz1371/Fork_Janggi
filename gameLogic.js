/*  High level description of game logic
    ====================================
    - Make a move.
    - check for draws.
    - check if there's a winner.
*/

/*  What constitutes a move?
    ========================
    [{setTurn: {turnIndex: 1},
     {set: {key: 'board', value: [['', 'RH1', 'RE1', 'RU1', '', 'RU2', 'RE2', 'RH2', 'RR2'],
                                  ['RR1', '', '', '', 'RG1', '', '', '', ''],
                                  ['', 'RC1', '', '', '', '', '', 'RC2', ''],
                                  ['RS1', '', 'RS2', '', 'RS3', '', 'RS4', '', 'RS5'],
                                  ['', '', '', '', '', '', '', '', ''],
                                  ['', '', '', '', '', '', '', '', ''],
                                  ['BS1', '', 'BS2', '', 'BS3', '', 'BS4', '', 'BS5'],
                                  ['', 'BC1', '', '', '', '', '', 'BC2', ''],
                                  ['', '', '', '', 'BG1', '', '', '', ''],
                                  ['BR1', 'BH1', 'BE1', 'BU1', '', 'BU2', 'BE2', 'BH2', 'BR2']]}},
     {set: {key: 'delta', value: {piece: 'RR1', row: 1, col: 0}}}
    ]
*/

/*
    Pieces
    ======
    RG1 - Red General
    RU1/RU2 - Red Guards
    RH1/RH2 - Red Horses
    RE1/RE2 - Red Elephants
    RR1/RR2 - Red Chariots
    RC1/RC2 - Red Cannons
    RS1-RS5 - Red Soldiers

    BG1 - Blue General
    BU1/BU2 - Blue Guards
    BH1/BH2 - Blue Horses
    BE1/BE2 - Blue Elephants
    BR1/BR2 - Blue Chariots
    BC1/BC2 - Blue Cannons
    BS1-BS5 - Blue Soldiers

    *Note: Palace refers to the box with diagonal lines at the center top and center bottom of the respective sides.
    
*/

'use strict';

angular.module('myApp').service('gameLogic', function() {
//var Janggi = (function () {
    //'use strict';

    // ============================================================================
    // Utility
    // ============================================================================
    /*
    // Function code for "isEqual", "copyObject"
    // is from https://github.com/yoav-zibin/TicTacToe/blob/0b8310d95831eabb3cd9184bbe6402413fc8daee/TicTacToeLogic.js
    function isEqual(object1, object2)
    {
        return JSON.stringify(object1) === JSON.stringify(object2);
    }

    function copyObject(object)
    {
        return JSON.parse(JSON.stringify(object));
    }*/

    function isEqual(object1, object2)
    {
        return angular.equals(object1, object2);
    }

    function copyObject(object)
    {
        return angular.copy(object);
    }


    // ============================================================================
    // Piece Rules
    // ============================================================================

    function RGeneralGuardMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        var up = { row: row - 1, col: col };
        if (up.row >= 0 && (board[up.row][up.col][0] !== 'R'))
        {
            moves.push(up);
        }

        var down = { row: row + 1, col: col };
        if (down.row < 3 && (board[down.row][down.col][0] !== 'R'))
        {
            moves.push(down);
        }

        var left = { row: row, col: col - 1 };
        if (left.col > 2 && (board[left.row][left.col][0] !== 'R'))
        {
            moves.push(left);
        }

        var right = { row: row, col: col + 1 };
        if (right.col < 6 && (board[right.row][right.col][0] !== 'R'))
        {
            moves.push(right);
        }

        // Check diagonals
        if (((row === 0 && col === 3) ||
            (row === 0 && col === 5) || 
            (row === 2 && col === 3) ||
            (row === 2 && col === 5))
            && (board[1][4][0] !== 'R'))
        {
            moves.push({row: 1, col: 4})
        }

        // Check center
        if (row === 1 && col === 4)
        {
            if (board[0][3][0] !== 'R')
            {
                moves.push({ row: 0, col: 3 });
            }
            if (board[0][5][0] !== 'R')
            {
                moves.push({ row: 0, col: 5 });
            }
            if (board[2][3][0] !== 'R')
            {
                moves.push({ row: 2, col: 3 });
            }
            if (board[2][5][0] !== 'R')
            {
                moves.push({ row: 2, col: 5 });
            }  
        }

        return moves;
    }

    function BGeneralGuardMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        var up = { row: row - 1, col: col };
        if (up.row > 6 && (board[up.row][up.col][0] !== 'B')) {
            moves.push(up);
        }

        var down = { row: row + 1, col: col };
        if (down.row < 10 && (board[down.row][down.col][0] !== 'B')) {
            moves.push(down);
        }

        var left = { row: row, col: col - 1 };
        if (left.col > 2 && (board[left.row][left.col][0] !== 'B')) {
            moves.push(left);
        }

        var right = { row: row, col: col + 1 };
        if (right.col < 6 && (board[right.row][right.col][0] !== 'B')) {
            moves.push(right);
        }

        // Check diagonals
        if (((row === 9 && col === 3) ||
            (row === 9 && col === 5) ||
            (row === 7 && col === 3) ||
            (row === 7 && col === 5))
            && (board[8][4][0] !== 'B'))
        {
            moves.push({ row: 8, col: 4 })
        }

        // Check center
        if (row === 8 && col === 4) {
            if (board[9][3][0] !== 'B')
            {
                moves.push({ row: 9, col: 3 });
            }
            if (board[9][5][0] !== 'B') {
                moves.push({ row: 9, col: 5 });
            }
            if (board[7][3][0] !== 'B') {
                moves.push({ row: 7, col: 3 });
            }
            if (board[7][5][0] !== 'B') {
                moves.push({ row: 7, col: 5 });
            }  
        }

        return moves;
    }

    function horseMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        // Row and col adjustment so that only legal moves are counted.

        // If one intermediate move is possible, then check diagonals.
        var up = { row: row - 1, col: col };
        if (up.row >= 1 && board[up.row][up.col] === '')
        {
            if ((up.col - 1 >= 0) && (board[up.row - 1][up.col - 1][0] !== board[row][col][0]))
            {
                moves.push( {row: up.row - 1, col: up.col - 1});
            }

            if ((up.col + 1 < 9) && (board[up.row - 1][up.col + 1][0] !== board[row][col][0]))
            {
                moves.push({ row: up.row - 1, col: up.col + 1 });
            }
        }

        var down = { row: row + 1, col: col };
        if (down.row < 9 && board[down.row][down.col] === '')
        {
            if ((down.col - 1 >= 0) && (board[down.row + 1][down.col - 1][0] !== board[row][col][0]))
            {
                moves.push({ row: down.row + 1, col: down.col - 1 });
            }

            if ((down.col + 1 < 9) && (board[down.row + 1][down.col + 1][0] !== board[row][col][0]))
            {
                moves.push({ row: down.row + 1, col: down.col + 1 });
            }
        }

        var left = { row: row, col: col - 1 };
        if (left.col >= 1 && board[left.row][left.col] === '')
        {
            if ((left.row - 1 >= 0) && (board[left.row - 1][left.col - 1][0] !== board[row][col][0]))
            {
                moves.push({ row: left.row - 1, col: left.col - 1 });
            }

            if ((left.row + 1 < 10) && (board[left.row + 1][left.col - 1][0] !== board[row][col][0]))
            {
                moves.push({ row: left.row + 1, col: left.col - 1 });
            }
        }

        var right = { row: row, col: col + 1 };
        if (right.col < 8 && board[right.row][right.col] === '')
        {
            if ((right.row - 1 >= 0) && (board[right.row - 1][right.col + 1][0] !== board[row][col][0]))
            {
                moves.push({ row: right.row - 1, col: right.col + 1 });
            }

            if ((right.row + 1 < 10) && (board[right.row + 1][right.col + 1][0] !== board[row][col][0]))
            {
                moves.push({ row: right.row + 1, col: right.col + 1 });
            }
        }

        return moves;
    }

    function elephantMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        // Row and col adjustment so that only legal moves are counted.

        // If one intermediate move is possible, then check diagonals.
        var up = { row: row - 1, col: col };
        if (up.row >= 2 && board[up.row][up.col] === '')
        {
            if ((up.col - 2 >= 0) &&
                (board[up.row - 1][up.col - 1] === '') &&
                (board[up.row - 2][up.col - 2][0] !== board[row][col][0]))
            {
                moves.push({ row: up.row - 2, col: up.col - 2 });
            }

            if ((up.col + 2 < 9) &&
                (board[up.row - 1][up.col + 1] === '') &&
                (board[up.row - 2][up.col + 2][0] !== board[row][col][0]))
            {
                moves.push({ row: up.row - 2, col: up.col + 2 });
            }
        }

        var down = { row: row + 1, col: col };
        if (down.row < 8 && board[down.row][down.col] === '')
        {
            if ((down.col - 2 >= 0) &&
                (board[down.row + 1][down.col - 1] === '') &&
                (board[down.row + 2][down.col - 2][0] !== board[row][col][0]))
            {
                moves.push({ row: down.row + 2, col: down.col - 2 });
            }

            if((down.col + 2 < 9) &&
                (board[down.row + 1][down.col + 1] === '') && 
                (board[down.row + 2][down.col + 2][0] !== board[row][col][0]))
            {
                moves.push({ row: down.row + 2, col: down.col + 2 });
            }
        }

        var left = { row: row, col: col - 1 };
        if (left.col >= 2 && board[left.row][left.col] === '')
        {
            if ((left.row - 2 >= 0) &&
                (board[left.row - 1][left.col - 1] === '') &&
                (board[left.row - 2][left.col - 2][0] !== board[row][col][0]))
            {
                moves.push({ row: left.row - 2, col: left.col - 2 });
            }
            if ((left.row + 2 <= 9) &&
                (board[left.row + 1][left.col - 1] === '') &&
                (board[left.row + 2][left.col - 2][0] !== board[row][col][0]))
            {
                moves.push({ row: left.row + 2, col: left.col - 2 });
            }
        }

        var right = { row: row, col: col + 1 };
        if (right.col < 7 && board[right.row][right.col] === '')
        {
            if ((right.row - 2 >= 0) &&
                (board[right.row - 1][right.col + 1] === '') &&
                (board[right.row - 2][right.col + 2][0] !== board[row][col][0]))
            {
                moves.push({ row: right.row - 2, col: right.col + 2 });
            }
            if((right.row + 2 <= 9) &&
                (board[right.row + 1][right.col + 1] === '') &&
                (board[right.row + 2][right.col + 2][0] !== board[row][col][0]))
            {
                moves.push({ row: right.row + 2, col: right.col + 2 });
            }
        }

        return moves;
    }

    function chariotMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        // up
        var i = row - 1;
        while (i >= 0 && (board[i][col] === '' || (board[i][col][0] !== board[row][col][0]) ))
        {
            moves.push({ row: i, col: col });

            if ((board[i][col][0] !== board[row][col][0]) && (board[i][col] !== ''))
            {
                break;
            }
            i--;
        }

        // down
        i = row + 1;
        while (i < 10 && (board[i][col] === '' || (board[i][col][0] !== board[row][col][0]) ))
        {
            moves.push({ row: i, col: col });

            if ((board[i][col][0] !== board[row][col][0]) && (board[i][col] !== ''))
            {
                break;
            }
            i++;
        }

        // left
        i = col - 1;
        while (i >= 0 && (board[row][i] === '' || (board[row][i][0] !== board[row][col][0])))
        {
            moves.push({ row: row, col: i });

            if ((board[row][i][0] !== board[row][col][0]) && (board[row][i] !== ''))
            {
                break;
            }
            i--;
        }

        // right
        i = col + 1;
        while (i < 9 && (board[row][i] === '' || (board[row][i][0] !== board[row][col][0])))
        {
            moves.push({ row: row, col: i });

            if ((board[row][i][0] !== board[row][col][0]) && (board[row][i] !== ''))
            {
                break;
            }
            i++;
        }

        // diagonals
        // top left of top palace
        if (row === 0 && col === 3)
        {
            if (board[1][4] === '' || (board[1][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 1, col: 4 });

                if (board[1][4] === '')
                {
                    if (board[2][5] === '' || (board[2][5][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 2, col: 5 });
                    }
                }
            }
        }

        // top right of top palace
        if (row === 0 && col === 5)
        {
            if (board[1][4] === '' || (board[1][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 1, col: 4 });

                if (board[1][4] === '')
                {
                    if (board[2][3] === '' || (board[2][3][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 2, col: 3 });
                    }
                }
            }
        }

        // bottom left of top palace
        if (row === 2 && col === 3)
        {
            if (board[1][4] === '' || (board[1][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 1, col: 4 });

                if (board[1][4] === '')
                {
                    if (board[0][5] === '' || (board[0][5][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 0, col: 5 });
                    }
                }
            }
        }

        // bottom right of top palace
        if (row === 2 && col === 5)
        {
            if (board[1][4] === '' || (board[1][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 1, col: 4 });

                if (board[1][4] === '')
                {
                    if (board[0][3] === '' || (board[0][3][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 0, col: 3 });
                    }
                }
            }
        }

        // center of top palace
        if (row === 1 && col === 4)
        {
            if (board[0][3] === '' || (board[0][3][0] !== board[row][col][0]))
            {
                moves.push({ row: 0, col: 3 });
            }
            if (board[0][5] === '' || (board[0][5][0] !== board[row][col][0]))
            {
                moves.push({ row: 0, col: 5 });
            }
            if (board[2][3] === '' || (board[2][3][0] !== board[row][col][0]))
            {
                moves.push({ row: 2, col: 3 });
            }
            if (board[2][5] === '' || (board[2][5][0] !== board[row][col][0]))
            {
                moves.push({ row: 2, col: 5 });
            }
        }

        // top left of bottom palace
        if (row === 7 && col === 3) {
            if (board[8][4] === '' || (board[8][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 8, col: 4 });

                if (board[8][4] === '')
                {
                    if (board[9][5] === '' || (board[9][5][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 9, col: 5 });
                    }
                }
            }
        }

        // top right of bottom palace
        if (row === 7 && col === 5) {
            if (board[8][4] === '' || (board[8][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 8, col: 4 });

                if (board[8][4] === '')
                {
                    if (board[9][3] === '' || (board[9][3][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 9, col: 3 });
                    }
                }
            }
        }

        // bottom left of bottom palace
        if (row === 9 && col === 3)
        {
            if (board[8][4] === '' || (board[8][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 8, col: 4 });

                if (board[8][4] === '')
                {
                    if (board[7][5] === '' || (board[7][5][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 7, col: 5 });
                    }
                }
            }
        }

        // bottom right of bottom palace
        if (row === 9 && col === 5)
        {
            if (board[8][4] === '' || (board[8][4][0] !== board[row][col][0]))
            {
                moves.push({ row: 8, col: 4 });

                if (board[8][4] === '')
                {
                    if (board[7][3] === '' || (board[7][3][0] !== board[row][col][0]))
                    {
                        moves.push({ row: 7, col: 3 });
                    }
                }
            }
        }

        // center of bottom palace
        if (row === 8 && col === 4)
        {
            if (board[7][3] === '' || (board[7][3][0] !== board[row][col][0]))
            {
                moves.push({ row: 7, col: 3 });
            }
            if (board[7][5] === '' || (board[7][5][0] !== board[row][col][0]))
            {
                moves.push({ row: 7, col: 5 });
            }
            if (board[9][3] === '' || (board[9][3][0] !== board[row][col][0]))
            {
                moves.push({ row: 9, col: 3 });
            }
            if (board[9][5] === '' || (board[9][5][0] !== board[row][col][0]))
            {
                moves.push({ row: 9, col: 5 });
            }
        }

        return moves;
    }

    function cannonMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        // up
        var i = row - 1;
        while (i >= 0 && (board[i][col] === '') )
        {
            i--;
        }
        if (i > 0 && (board[i][col][1] !== 'C') )  // A jump is possible; not jumping over a cannon
        {
            var j = i - 1;
            while (j >= 0 && (board[j][col] === '' || (board[j][col][0] !== board[row][col][0] && (board[j][col][1] !== 'C') )))
            {
                moves.push({ row: j, col: col });

                if ((board[j][col][0] !== board[row][col][0]) && (board[j][col] !== ''))    // An opponent's piece is blocking further movement
                {
                    break;
                }

                j--;
            }
        }

        // down
        i = row + 1;
        while (i < 10 && (board[i][col] === '') )
        {
            i++;
        }
        if (i < 9 && (board[i][col][1] !== 'C') )  // A jump is possible; not jumping over a cannon
        {
            var j = i + 1;
            while (j <= 9 && (board[j][col] === '' || (board[j][col][0] !== board[row][col][0] && (board[j][col][1] !== 'C') )))
            {
                moves.push({ row: j, col: col });

                if ((board[j][col][0] !== board[row][col][0]) && (board[j][col] !== ''))    // An opponent's piece is blocking further movement
                {
                    break;
                }

                j++;
            }
        }

        // left
        i = col - 1;
        while (i >= 0 && (board[row][i] === '') )
        {
            i--;
        }
        if (i > 0 && (board[row][i][1] !== 'C') )  // A jump is possible; not jumping over a cannon
        {
            var j = i - 1;
            while (j >= 0 && (board[row][j] === '' || (board[row][j][0] !== board[row][col][0] && (board[row][j][1] !== 'C') )))
            {
                moves.push({ row: row, col: j });

                if ((board[row][j][0] !== board[row][col][0]) && (board[row][j] !== ''))    // An opponent's piece is blocking further movement
                {
                    break;
                }

                j--;
            }
        }

        // right
        i = col + 1;
        while (i < 9 && (board[row][i] === '') )
        {
            i++;
        }
        if (i < 8 && (board[row][i][1] !== 'C') )  // A jump is possible; not jumping over a cannon
        {
            var j = i + 1;
            while (j <= 8 && (board[row][j] === '' || (board[row][j][0] !== board[row][col][0] && (board[row][j][1] !== 'C') )))
            {
                moves.push({ row: row, col: j });

                if ((board[row][j][0] !== board[row][col][0]) && (board[row][j] !== ''))    // An opponent's piece is blocking further movement
                {
                    break;
                }

                j++;
            }
        }

        // top left of top palace
        if (row === 0 && col === 3)
        {
            if (board[1][4] !== '' &&
                (board[1][4][1] !== 'C') && 
                (board[2][5][0] !== board[row][col][0]) &&
                (board[2][5][1] !== 'C'))
            {
                moves.push({ row: 2, col: 5 });
            }
        }

        // top right of top palace
        if (row === 0 && col === 5)
        {
            if (board[1][4] !== '' &&
                (board[1][4][1] !== 'C') &&
                (board[2][3][0] !== board[row][col][0]) &&
                (board[2][3][1] !== 'C'))
            {
                moves.push({ row: 2, col: 3 });
            }
        }

        // bottom left of top palace
        if (row === 2 && col === 3)
        {
            if (board[1][4] !== '' &&
                (board[1][4][1] !== 'C') &&
                (board[0][5][0] !== board[row][col][0]) &&
                (board[0][5][1] !== 'C')) 
            {
                moves.push({ row: 0, col: 5 });
            }
        }

        // bottom right of top palace
        if (row === 2 && col === 5)
        {
            if (board[1][4] !== '' &&
                (board[1][4][1] !== 'C') &&
                (board[0][3][0] !== board[row][col][0]) &&
                (board[0][3][1] !== 'C'))
            {
                moves.push({ row: 0, col: 3 });
            }
        }

        // top left of bottom palace
        if (row === 7 && col === 3)
        {
            if (board[8][4] !== '' &&
                (board[8][4][1] !== 'C') &&
                (board[9][5][0] !== board[row][col][0]) &&
                (board[9][5][1] !== 'C'))
            {
                moves.push({ row: 9, col: 5 });
            }
        }

        // top right of bottom palace
        if (row === 7 && col === 5)
        {
            if (board[8][4] !== '' &&
                (board[8][4][1] !== 'C') &&
                (board[9][3][0] !== board[row][col][0]) &&
                (board[9][3][1] !== 'C'))
            {
                moves.push({ row: 9, col: 3 });
            }
        }

        // bottom left of bottom palace
        if (row === 9 && col === 3)
        {
            if (board[8][4] !== '' &&
                (board[8][4][1] !== 'C') &&
                (board[7][5][0] !== board[row][col][0]) &&
                (board[7][5][1] !== 'C'))
            {
                moves.push({ row: 7, col: 5 });
            }
        }

        // bottom right of bottom palace
        if (row === 9 && col === 5)
        {
            if (board[8][4] !== '' &&
                (board[8][4][1] !== 'C') &&
                (board[7][3][0] !== board[row][col][0]) &&
                (board[7][3][1] !== 'C'))
            {
                moves.push({ row: 7, col: 3 });
            }
        }

        // Cannons cannot jump diagonally from the center of either palaces

        return moves;
    }

    function soldierMoves(board, location)
    {
        var row = location.row;
        var col = location.col;
        var moves = [];

        // Determine which color soldier
        if (board[row][col][0] === 'R')
        {
            // Red soldiers can't move up
            var down = { row: row + 1, col: col };
            if (down.row < 10 && (board[down.row][down.col][0] !== 'R'))
            {
                moves.push(down);
            }

            var left = { row: row, col: col - 1 };
            if (left.col >= 0 && (board[left.row][left.col][0] !== 'R'))
            {
                moves.push(left);
            }

            var right = { row: row, col: col + 1 };
            if (right.col < 9 && (board[right.row][right.col][0] !== 'R'))
            {
                moves.push(right);
            }

            // Check diagonals in palace
            if (((row === 7 && col === 3) ||
                 (row === 7 && col === 5))
                 && (board[8][4][0] !== 'R'))
            {
                moves.push({ row: 8, col: 4 })
            }

            // Check center in palace
            if (row === 8 && col === 4)
            {
                if (board[9][3][0] !== 'R')
                {
                    moves.push({ row: 9, col: 3 });
                }
                if (board[9][5][0] !== 'R')
                {
                    moves.push({ row: 9, col: 5 });
                }
            }

        }
        else
        {
            // Blue soldiers can't move down
            var up = { row: row - 1, col: col };
            if (up.row >= 0 && (board[up.row][up.col][0] !== 'B'))
            {
                moves.push(up);
            }

            var left = { row: row, col: col - 1 };
            if (left.col >= 0 && (board[left.row][left.col][0] !== 'B'))
            {
                moves.push(left);
            }

            var right = { row: row, col: col + 1 };
            if (right.col < 9 && (board[right.row][right.col][0] !== 'B'))
            {
                moves.push(right);
            }

            // Check diagonals in palace
            if (((row === 2 && col === 3) ||
                 (row === 2 && col === 5))
                 && (board[1][4][0] !== 'B'))
            {
                moves.push({ row: 1, col: 4 })
            }

            // Check center in palace.
            if (row === 1 && col === 4) 
            {
                if (board[0][3][0] !== 'B') 
                {
                    moves.push({ row: 0, col: 3 });
                }
                if (board[0][5][0] !== 'B') 
                {
                    moves.push({ row: 0, col: 5 });
                }
            }
        }

        return moves;
    }



    // ============================================================================
    // Status, progression, and checks
    // ============================================================================

    // Return the winner (either 'R' or 'B') or '' if there is no winner.
    // If the opposing general is captured, then current player wins.
    function getWinner(board)
    {
        var RHasGeneral = false;
        var BHasGeneral = false;

        // Only have to check within palace to find general
        for (var i = 0; i < 3; i++)
        {
            for (var j = 3; j < 6; j++)
            {
                if (board[i][j] === 'RG1')
                {
                    RHasGeneral = true;
                }
            }
        }
        if (!RHasGeneral)
        {
            // Red does not have a general, so Blue wins.
            return 'B';
        }

        // Only have to check within palace to find general
        for (var i = 7; i < 10; i++)
        {
            for (var j = 3; j < 6; j++)
            {
                if (board[i][j] === 'BG1')
                {
                    BHasGeneral = true;
                }
            }
        }
        if (!BHasGeneral)
        {
            // Blue does not have a general, so Red wins.
            return 'R';
        }

        // Both team's general is still on the board, game continues.
        return '';
    }

    // Returns a list of spots on the board that the specified piece can move
    function determineMoves(board, piece)
    {
        var possibleMoves = [];
        // Find location of piece before move
        var location = {};
        for (var i = 0; i < 10; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                if (board[i][j] === piece)
                {
                    location.row = i;
                    location.col = j;
                    break;
                }
            }
            if (location.row !== undefined)
            {
                break;
            }
        }
        // If the piece is not found on the board.
        if (location.row === undefined)
        {
            throw new Error(piece + " is not on the board!")
        }

        // determine what moves the piece can make
        switch (piece)
        {
            case 'RG1':
            case 'RU1':
            case 'RU2':
                possibleMoves = RGeneralGuardMoves(board, location);
                return possibleMoves;
            
            case 'BG1':
            case 'BU1':
            case 'BU2':
                possibleMoves = BGeneralGuardMoves(board, location);
                return possibleMoves;

            case 'RH1':
            case 'RH2':
            case 'BH1':
            case 'BH2':
                possibleMoves = horseMoves(board, location);
                return possibleMoves;

            case 'RE1':
            case 'RE2':
            case 'BE1':
            case 'BE2':
                possibleMoves = elephantMoves(board, location);
                return possibleMoves;

            case 'RR1':
            case 'RR2':
            case 'BR1':
            case 'BR2':
                possibleMoves = chariotMoves(board, location);
                return possibleMoves;

            case 'RC1':
            case 'RC2':
            case 'BC1':
            case 'BC2':
                possibleMoves = cannonMoves(board, location);
                return possibleMoves;

            case 'RS1':
            case 'RS2':
            case 'RS3':
            case 'RS4':
            case 'RS5':
            case 'BS1':
            case 'BS2':
            case 'BS3':
            case 'BS4':
            case 'BS5':
                possibleMoves = soldierMoves(board, location);
                return possibleMoves;

        }

    }

    // Determines whether a piece can be in the claimed location and duplicates that move
    function determineLocationPossibleAndMove(board, piece, row, col)
    {
        var location = {};
        for (var i = 0; i < 10; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                if (board[i][j] === piece)
                {
                    location.row = i;
                    location.col = j;
                    break;
                }
            }
            if (location.row !== undefined)
            {
                break;
            }
        }

        // if the current (row, col) is in the list of moves determined by "determineMoves", return the board after move, else throw exception
        var possibleMoves = determineMoves(board, piece);

        if (possibleMoves.length !== 0)
        {
            for (var i = 0; i < possibleMoves.length; i++)
            {
                if (possibleMoves[i].row === row && (possibleMoves[i].col === col) )
                {
                    // Move the piece to the claimed location
                    board[location.row][location.col] = '';
                    board[row][col] = piece;

                    return board;   // return modified move
                }
            }
        }
        throw new Error("Illegal move!");
    }

    // Return true if the game ended in a draw
    // Game ends in draw if:
    //      1. The only pieces left are the generals, guards, and cannons that cannot make a move.
    //      2. If the the two generals are facing each other unobstructed and the second player did not make a move to break this situation.
    function isDraw(boardBefore, boardAfter)
    {
        var condition1 = isDrawCondition1(boardAfter);
        // If the game is in the state of condition 2 before and after the second player moves, the game ends in a draw.
        var condition2 = isDrawCondition2(boardBefore) && isDrawCondition2(boardAfter);
        return (condition1 || condition2);
    }

    // Pieces that can create a draw
    var drawPieces = ['RG1', 'RU1', 'RU2', 'RC1', 'RC2', 'BG1', 'BU1', 'BU2', 'BC1', 'BC2'];

    function isDrawCondition1(board)
    {
        var someCannonCanMove = false;
        var otherPiecesExist = false;

        var aDrawPiece = false;

        // Test draw condition 1
        for (var i = 0; i < 10; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                aDrawPiece = false;

                if (board[i][j] === 'RC1' ||          // red cannon 1
                    board[i][j] === 'RC2' ||          // red cannon 2
                    board[i][j] === 'BC1' ||          // blue cannon 1
                    board[i][j] === 'BC2'             // blue cannon 2
                    )
                {
                    // If a cannon is found on the field check to see if it can move.
                    var cannonMoves = determineMoves(board, board[i][j])
                    if (cannonMoves.length !== 0)
                    {
                        // Some cannon can still move
                        someCannonCanMove = true;
                    }
                }

                // test and see if the current piece is a "draw" piece
                for (var k = 0; k < 10; k++)
                {
                    if (board[i][j] === drawPieces[k])
                    {
                        aDrawPiece = true;
                    }
                }

                if (aDrawPiece == false && (board[i][j] !== '') )
                {
                    // Some piece other than generals, guards, and cannons are still on the board.
                    otherPiecesExist = true;
                }
            }
        }

        if (someCannonCanMove === false && (otherPiecesExist === false) )
        {
            // Draw condition 1 is true.
            return true;
        }
        return false;
    }

    function isDrawCondition2(board)
    {
        // Test draw condition 2
        // Search for red general
        for (var i = 0; i < 3; i++)
        {
            for (var j = 3; j < 6; j++)
            {
                if (board[i][j] === 'RG1')
                {
                    // Red general found at (i, j), is blue general straight ahead?
                    for (var k = i + 1; k < 10; k++)
                    {
                        if (board[k][j] === 'BG1') {
                            // The red general is facing the blue general unobstructed
                            return true;
                        }

                        if (board[k][j] !== '')
                        {
                            // Some piece is in between the generals
                            return false;
                        }                
                    }
                    // No need to check other spots
                    break;
                }
            }
        }
        // Not in a tie state after current move; no pieces in line with red general; or red general is captured
        return false;
    }

    function getPieceAt(row, col)
    {
        
    }

    function getInitialBoard()
    {
        return [['RR1', 'RH1', 'RE1', 'RU1', '', 'RU2', 'RE2', 'RH2', 'RR2'],
                ['', '', '', '', 'RG1', '', '', '', ''],
                ['', 'RC1', '', '', '', '', '', 'RC2', ''],
                ['RS1', '', 'RS2', '', 'RS3', '', 'RS4', '', 'RS5'],
                ['', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', ''],
                ['BS1', '', 'BS2', '', 'BS3', '', 'BS4', '', 'BS5'],
                ['', 'BC1', '', '', '', '', '', 'BC2', ''],
                ['', '', '', '', 'BG1', '', '', '', ''],
                ['BR1', 'BH1', 'BE1', 'BU1', '', 'BU2', 'BE2', 'BH2', 'BR2']];
    }

    // Recreate user claimed move to verify legitimacy of move
    function createMove(board, piece, row, col, turnIndexBeforeMove)
    {
        // At the beginning of the match, stateBeforeMove is {}.
        if (board === undefined)
        {
            board = getInitialBoard();
        }

        // Just copying board before move; "boardAfterMove" doesn't include the new move yet
        var boardAfterMove = copyObject(board);

        // Test legitimacy of move
        boardAfterMove = determineLocationPossibleAndMove(boardAfterMove, piece, row, col);

        var winner = getWinner(boardAfterMove);
        var firstOperation;

        if (winner !== '' || isDraw(board, boardAfterMove))
        {
            // Game over.
            firstOperation = {endMatch: {endMatchScores:
                        (winner === 'R' ? [1, 0] : (winner === 'B' ? [0, 1] : [0, 0])) }}
        }
        else
        {
            // Game continues.
            firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
        }

        return [firstOperation,
                { set: { key: 'board', value: boardAfterMove } },
                { set: { key: 'delta', value: { piece: piece, row: row, col: col } } } ]

    }

    // Actual function returned that is used to test if a move is legitimate.
    function isMoveOk(params)
    {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;

        try
        {
            var deltaValue = move[2].set.value;
            var piece = deltaValue.piece;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;

            // Verify that players are moving their own pieces
            if ((turnIndexBeforeMove === 0 && piece[0] === 'B')
                || (turnIndexBeforeMove === 1 && piece[0] === 'R'))
            {
                throw new Error("Invalid attempt to move opponent's piece!")
            }

            // Attempt to recreate move to validate legitimacy.
            // Can possibly move checking whether players are moving their own pieces to "createMove"
            var expectedMove = createMove(board, piece, row, col, turnIndexBeforeMove);

            if (!isEqual(move, expectedMove))
            {
                //console.log("POINT A - MOVES NOT EQUAL");
                return false;
            }

        }
        catch (e)
        {
            //console.log("POINTS B - EXCEPTION!");
            //console.log(e);
            return false;
        }

        return true;
    }


    function getExampleMoves(initialTurnIndex, initialState, arrayOfPieceRowColComment)
    {
        var exampleMoves = [];
        var state = initialState;
        var turnIndex = initialTurnIndex;

        for(var i = 0; i < arrayOfPieceRowColComment.length; i++)
        {
            var pieceRowColComment = arrayOfPieceRowColComment[i];
            var move = createMove(state.board, pieceRowColComment.piece, pieceRowColComment.row, pieceRowColComment.col, turnIndex);
            exampleMoves.push({
                stateBeforeMove: state,
                turnIndexBeforeMove: turnIndex,
                move: move,
                comment: { en: pieceRowColComment.comment }
            });
            state = { board: move[1].set.value, delta: move[2].set.value };
            turnIndex = 1 - turnIndex;
        }

        return exampleMoves;
    }

    function getRiddles()
    {
        return [
            getExampleMoves(1,
                {   board: [['', '', '', '', 'RG1', '', '', '', ''],
                        ['', '', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', '', ''],
                        ['BR1', '', '', '', '', 'BH1', '', '', 'BR2'],
                        ['', '', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', '', ''],
                        ['', '', '', '', 'BU1', '', '', '', ''],
                        ['', '', '', '', 'BG1', '', '', '', '']]
                },
                [
                    { piece: 'BR1', row: 1, col: 0, comment: "Align this chariot to aid the other chariot's next move." },
                    { piece: 'RG1', row: 0, col: 3, comment: "Red is desperate to keep going."},
                    { piece: 'BR2', row: 0, col: 8, comment: "Place this chariot strategically to force red into submission." },
                    { piece: 'RG1', row: 0, col: 4, comment: "Red is out of moves." },
                    { piece: 'BR2', row: 0, col: 4, comment: "Blue wins by capturing the red general!" }
                ])
        ];
    }

    function getExampleGame()
    {
        return getExampleMoves(0, {},
            [
            { piece: 'RR1', row: 1, col: 0, comment: "Red getting the chariot out of the corner." },
            { piece: 'BR1', row: 8, col: 0, comment: "Ditto the red move." },
            { piece: 'RU1', row: 1, col: 3, comment: "Get the guards ready." },
            { piece: 'BS2', row: 6, col: 1, comment: "Soldiers need to move aside." },
            { piece: 'RS1', row: 3, col: 1, comment: "Prepare a compromise." },
            { piece: 'BC1', row: 3, col: 1, comment: "Capture a red soldier." },
            { piece: 'RS2', row: 3, col: 1, comment: "Capture a blue cannon." }
            ]
        );
    }


    //return { isMoveOk: isMoveOk , getExampleGame: getExampleGame, getRiddles: getRiddles};

    function createComputerMove(board, turnIndexBeforeMove)
    {
        if (turnIndexBeforeMove == 0)
            var color = 'R';
        else if (turnIndexBeforeMove == 1)
            var color = 'B';

        var possibleMoves = [];
        for (var i = 0; i < 10; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                try
                {
                    if (board[i][j][0] === color)
                    {
                        var currentPieceMoves = determineMoves(board, board[i][j]);
                        for (var k = 0; k < currentPieceMoves.length; k++)
                        {
                            possibleMoves.push(createMove(board, board[i][j], currentPieceMoves[k].row, currentPieceMoves[k].col, turnIndexBeforeMove));
                        }
                    }
                }
                catch (e)
                {
                }
            }
        }
        var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return randomMove;
    }


    this.getInitialBoard = getInitialBoard;
    this.createComputerMove = createComputerMove;
    this.createMove = createMove;
    this.isMoveOk = isMoveOk;
    this.getExampleGame = getExampleGame;
    this.getRiddles = getRiddles;
    this.determineMoves = determineMoves;
    
});
