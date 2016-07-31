define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
           .state('home.activityTypes', {
               url: 'activity-types',
               templateUrl: '../modules/configuration/views/activity-type.client.view.html',
               controller: 'ActivityTypeController'
            })
            .state('home.activityTypeNew', {
                url: 'activity-type/new',
                templateUrl: '../modules/configuration/views/activity-type-create.client.view.html',
                controller: 'ActivityTypeController'
            })
            .state('home.activityTypeEdit', {
                url: 'activity-type/:id',
                templateUrl: '../modules/configuration/views/activity-type-edit.client.view.html',
                controller: 'ActivityTypeController'
            });
    });
});