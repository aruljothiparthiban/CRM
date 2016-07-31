define([
    'app',
    '../../configuration/services/activity-type.client.service'
], function (app) {
    'use strict';

    app.controller('ActivityTypeController', ['$scope', '$stateParams','$state', 'Authentication', 'ActivityTypes',
        function ($scope, $stateParams, $state, Authentication, ActivityTypes) {
            $scope.authentication = Authentication;
            $scope.focusName = true;
            $scope.activityType = {
                name:null
            };

            $scope.create = function () {
                var model = new ActivityTypes({
                    name: $scope.activityType.name
                });
                model.$save(function (response) {
                    $state.go('home.activityTypes');
                    $scope.name = '';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            $scope.delete = function (p) {
                $scope.current = p;
            };

            $scope.remove = function () {
                if ($scope.current) {
                    $scope.current.$remove();
                    $('#deleteConfirmModal').modal('hide');
                    for (var i in $scope.ActivityTypes) {
                        if ($scope.ActivityTypes[i] === $scope.current) {
                            $scope.ActivityTypes.splice(i, 1);
                        }
                    }
                } else {
                    $scope.current.$remove(function () {
                        $('#deleteConfirmModal').modal('hide');
                        $state.go('home.activityTypes');
                    });
                }
            };

            $scope.update = function () {
                var activityType = $scope.activityType;

                activityType.$update(function () {
                    $state.go('home.activityTypes');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            $scope.find = function () {
                $scope.ActivityTypes = ActivityTypes.query();
            };

            $scope.findOne = function () {
                $scope.activityType = ActivityTypes.get({
                    activityTypeId: $stateParams.id
                });
            };
        }
    ]);
});