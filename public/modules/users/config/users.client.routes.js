define(['app'], function (app) {
    'use strict';

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('home.users', {
                url: 'users',
                templateUrl: '../modules/users/views/user.client.view.html',
                controller: 'UserController'
            })
            .state('home.inviteUser', {
                url: 'invite-user',
                templateUrl: '../modules/users/views/invite-user.client.view.html',
                controller: 'UserController'
            })
            .state('home.userNew', {
                url: 'user/new',
                templateUrl: '../modules/users/views/user-create.client.view.html',
                controller: 'UserController'
            })
            .state('home.userEdit', {
                url: 'user/:id',
                templateUrl: '../modules/users/views/user-edit.client.view.html',
                controller: 'UserController'
            });
    }]);
});