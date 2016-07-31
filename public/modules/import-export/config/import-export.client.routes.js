define(['app'], function (app) {
    'use strict';

    app.config(function ($stateProvider) {
        $stateProvider
            .state('home.import', {
                url: "import",
                templateUrl: "../modules/import-export/views/import.client.view.html",
                controller: "ImportController"
            })
            .state('home.exportPeoples', {
                url: "export/peoples",
                templateUrl: "../modules/import-export/views/export-people.client.view.html",
                controller: "ExportPeopleController"
            })
            .state('home.exportOrganisations', {
                url: "export/organisations",
                templateUrl: "../modules/import-export/views/export-organisation.client.view.html",
                controller: "ExportOrganisationController"
            })
            .state('home.exportActivities', {
                url: "export/activities",
                templateUrl: "../modules/import-export/views/export-activity.client.view.html",
                controller: "ExportActivityController"
            });
    });
});