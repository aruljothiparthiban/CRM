define([
    'app',
    'angularLocalStorage'
], function (app) {
    'use strict';

    app.factory('Subscriptions', ['$resource',
        function ($resource) {
            return $resource('subscriptions/:subscriptionId', {
                subscriptionId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
});