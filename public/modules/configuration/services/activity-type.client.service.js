define([
    'app',
    'angularLocalStorage'
], function (app) {
    'use strict';

    app.factory('ActivityTypes', ['$resource',
        function ($resource) {
            return $resource('activitytypes/:activityTypeId', {
                activityTypeId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
});