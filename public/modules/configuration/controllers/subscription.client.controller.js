define([
    'app',
    '../../configuration/services/subscriptions.client.service'
], function (app) {
    'use strict';

    app.controller('SubscriptionController', ['$scope', '$stateParams', '$state', 'Authentication', 'Subscriptions',
        function ($scope, $stateParams, $state, Authentication, Subscriptions) {
            $scope.authentication = Authentication;
            $scope.focusName = true;
            $scope.subscription = {
                name:null
            };

            $scope.create = function () {
                var subscription = new Subscriptions({
                    name: this.subscription.name
                });

                subscription.$save(function (response) {
                    $state.go('home.subscriptions');
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
                    for (var i in $scope.Subscriptions) {
                        if ($scope.Subscriptions[i] === $scope.current) {
                            $scope.Subscriptions.splice(i, 1);
                        }
                    }
                } else {
                    $scope.current.$remove(function () {
                        $('#deleteConfirmModal').modal('hide');
                        $state.go('home.subscriptions');
                    });
                }
            };

            $scope.update = function () {
                var subscription = $scope.subscription;

                subscription.$update(function () {
                    $state.go('home.subscriptions');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            $scope.find = function () {
                $scope.Subscriptions = Subscriptions.query();
            };

            $scope.findOne = function () {
                $scope.subscription = Subscriptions.get({
                    subscriptionId: $stateParams.id
                });
            };
        }
    ]);
});