define([
    'app',
    '../../people/services/peoples.client.service'
], function (app) {
    'use strict';

    app.controller('ExportActivityController', ['$scope', '$stateParams', '$state', 'Authentication', 'Peoples',
        function ($scope, $stateParams, $state, Authentication, Peoples) {
            $scope.authentication = Authentication;
        }
    ]);
});