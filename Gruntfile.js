/**
 * File: Gruntfile.js
 * -----------------------------
 * @By: Jingxin Zhu
 * @On: 04.17.2015
 * -----------------------------
 */

module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                strict: true,
                undef: true,
                unused: true,
                bitwise: true,
                forin: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                notypeof: true,
                jasmine: true,
                jquery: true,
                globals: {
                    module: false, // for Gruntfile.js
                    inject: false, // testing angular
                    angular: false,
                    console: false,
                    browser: false, element: false, by: false, // Protractor
                },
            },
            all: ['Gruntfile.js', 'src/*.js']
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false
            }
        },
        // Run karma and watch files using:
        // grunt karma:unit:start watch
        watch: {
            files: ['src/*.js'],
            tasks: ['jshint', 'karma:unit:run']
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                // order is important,
                src: ['src/game.js','src/gameLogic.js', 'src/silentDragAndDropListener.js'],
                dest: 'dist/everything.js',
            },
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            my_target: {
                files: {
                    'dist/everything.min.js': ['dist/everything.js'],
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'game.min.html': ['game.html']
                }
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: '.',
                    cache: [
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
                        'http://yoav-zibin.github.io/emulator/dist/gameServices.min.js',
                        "http://yoav-zibin.github.io/emulator/dist/dragAndDropListeners.min.js",
                        'dist/everything.js',
                        'src/game.js',
                        'src/gameLogic.js',
                        'src/silentDragAndDropListener.js',
                        'http://yoav-zibin.github.io/emulator/main.css',
                        'game.css',
                        'images/BC.png',
                        'images/BE.png',
                        'images/BG.png',
                        'images/BH.png',
                        'images/BR.png',
                        'images/BS.png',
                        'images/BU.png',
                        'images/empty.png',
                        'images/RC.png',
                        'images/RE.png',
                        'images/RG.png',
                        'images/RH.png',
                        'images/RR.png',
                        'images/RS.png',
                        'images/RU.png',
                        'images/board/bbottomleft.png',
                        'images/board/bbottomright.png',
                        'images/board/bottomborder.png',
                        'images/board/bottomleft.png',
                        'images/board/bottomright.png',
                        'images/board/btopleft.png',
                        'images/board/btopright.png',
                        'images/board/center.png',
                        'images/board/cross.png',
                        'images/board/leftborder.png',
                        'images/board/rbottomleft.png',
                        'images/board/rbottomright.png',
                        'images/board/rightborder.png',
                        'images/board/rtopleft.png',
                        'images/board/rtopright.png',
                        'images/board/topborder.png',
                        'images/board/topleft.png',
                        'images/board/topright.png',
                        'images/board/x.png',
                    ],
                    network: ['dist/everything.min.js.map', 'dist/everything.js'],
                    timestamp: true
                },
                dest: 'game.appcache',
                src: []
            }
        },
        'http-server': {
            'dev': {
                // the server root directory
                root: '.',
                port: 1371,
                host: "0.0.0.0",
                cache: 1,
                showDir : true,
                autoIndex: true,
                // server default file extension
                ext: "html",
                // run in parallel with other tasks
                runInBackground: true
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-http-server');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'karma',
        'concat', 'uglify',
        'processhtml', 'manifest',
        'http-server']);

    grunt.registerTask('factory',['concat', 'uglify','processhtml','manifest']);

};