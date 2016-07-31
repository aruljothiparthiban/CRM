define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.categories', {
                url: 'categories',
                templateUrl: '../modules/configuration/views/category.client.view.html',
                controller: 'CategoryController'
            })
            .state('home.categorynew', {
                url: 'category/new',
                templateUrl: '../modules/configuration/views/category-create.client.view.html',
                controller: 'CategoryController'
            })
            .state('home.categoryedit', {
                url: 'category/:id',
                templateUrl: '../modules/configuration/views/category-edit.client.view.html',
                controller: 'CategoryController'
            });
    });
});