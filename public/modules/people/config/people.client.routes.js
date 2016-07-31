define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.peoples', {
                url: 'peoples',
                templateUrl: '../modules/people/views/people.client.view.html',
                controller: 'PeopleController'
            })
            .state('home.peopleNew', {
                url: 'people/new',
                templateUrl: '../modules/people/views/people-create.client.view.html',
                controller: 'PeopleController'
            })
            .state('home.peopleEdit', {
                url: 'people/:id',
                templateUrl: '../modules/people/views/people-edit.client.view.html',
                controller: 'PeopleController'
            })
            .state('home.peopleDetail', {
                url: 'people/:id/detail',
                templateUrl: '../modules/people/views/people-detail.client.view.html',
                controller: 'PeopleController'
            });
    });
});