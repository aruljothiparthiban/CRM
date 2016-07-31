define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.boards', {
                url: 'boards',
                templateUrl: '../modules/configuration/views/board.client.view.html',
                controller: 'BoardController'
            })
            .state('home.boardNew', {
                url: 'board/new',
                templateUrl: '../modules/configuration/views/board-create.client.view.html',
                controller: 'BoardController'
            })
            .state('home.boardEdit', {
                url: 'board/:id',
                templateUrl: '../modules/configuration/views/board-edit.client.view.html',
                 controller: 'BoardController'
            });
    });
});