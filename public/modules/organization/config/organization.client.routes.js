define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.organizations', {
                url: 'organizations',
                templateUrl: '../modules/organization/views/organization.client.view.html',
                controller: 'OrganizationController'
            })
            .state('home.organizationNew', {
                url: 'organization/new',
                templateUrl: '../modules/organization/views/organization-create.client.view.html',
                controller: 'OrganizationController'
            })
            .state('home.organizationEdit', {
                url: 'organization/:id',
                templateUrl: '../modules/organization/views/organization-edit.client.view.html',
                controller: 'OrganizationController'
            })
            .state('home.organizationDetail', {
                url: 'organization/:id/detail',
                templateUrl: '../modules/organization/views/organization-detail.client.view.html',
                controller: 'OrganizationController'
            });
    });
});