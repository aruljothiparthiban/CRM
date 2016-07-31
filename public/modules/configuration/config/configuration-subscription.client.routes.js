define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.subscriptions', {
                url: 'subscriptions',
                templateUrl: '../modules/configuration/views/subscription.client.view.html',
                controller: 'SubscriptionController'
            })
            .state('home.subscriptionNew', {
                url: 'subscription/new',
                templateUrl: '../modules/configuration/views/subscription-create.client.view.html',
                controller: 'SubscriptionController'
            })
            .state('home.subscriptionEdit', {
                 url: 'subscription/:id',
                 templateUrl: '../modules/configuration/views/subscription-edit.client.view.html',
                 controller: 'SubscriptionController'
            });
    });
});