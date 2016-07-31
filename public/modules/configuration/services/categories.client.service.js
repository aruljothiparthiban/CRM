define([
    'app',
    'angularLocalStorage'
], function (app) {
    'use strict';

    app.factory('Categories', ['$resource',
        function ($resource) {
            return $resource('categories/:categoryId', {
                categoryId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
});