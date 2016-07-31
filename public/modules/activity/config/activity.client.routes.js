define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.activities', {
                url: "activities",
                templateUrl: "../modules/activity/views/activity.client.view.html",
                controller: "ActivityController"
            })
            .state('home.activityNew', {
                url: "activity/new",
                templateUrl: "../modules/activity/views/activity-create.client.view.html",
                controller: "ActivityController"
            })
            .state('home.activityEdit', {
                url: "activity/:id",
                templateUrl: "../modules/activity/views/activity-edit.client.view.html",
                controller: "ActivityController"
            })
            .state('home.activityDetail', {
                url: "activity/:id/detail",
                templateUrl: "../modules/activity/views/activity-detail.client.view.html",
                controller: "ActivityController"
            });
    });
});