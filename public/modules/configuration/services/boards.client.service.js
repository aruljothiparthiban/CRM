define([
    'app'
], function (app) {
    'use strict';

    app.factory('Boards', ['$resource',
        function ($resource) {
            return $resource('boards/:boardId', {
                boardId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
});