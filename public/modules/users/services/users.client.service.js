define([
    'app',
    'angularLocalStorage'
], function (app) {
    'use strict';

    app.factory('Users', ['$resource',
        function ($resource) {
            return $resource('users', {}, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
});