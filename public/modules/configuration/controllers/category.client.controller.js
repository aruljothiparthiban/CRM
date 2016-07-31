define([
    'app',
    '../../configuration/services/categories.client.service'
], function (app) {
    'use strict';

    app.controller('CategoryController', ['$scope', '$stateParams','$state', 'Authentication', 'Categories',
        function ($scope, $stateParams, $state, Authentication, Categories) {
            $scope.authentication = Authentication;
            $scope.focusName = true;
            $scope.category = {
                name:null
            };

            // Create new Article
            $scope.create = function () {
                // Create new Article object
                var category = new Categories({
                    name: this.category.name
                });

                // Redirect after save
                category.$save(function (response) {
                    $state.go('home.categories');
                    // Clear form fields
                    $scope.name = '';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            $scope.delete = function (p) {
                $scope.current = p;
            };

            // Remove existing Article
            $scope.remove = function () {
                if ($scope.current) {
                    $scope.current.$remove();
                    $('#deleteConfirmModal').modal('hide');
                    for (var i in $scope.Categories) {
                        if ($scope.Categories[i] === $scope.current) {
                            $scope.Categories.splice(i, 1);
                        }
                    }
                } else {
                    $scope.current.$remove(function () {
                        $('#deleteConfirmModal').modal('hide');
                        $state.go('home.categories');
                    });
                }
            };

            // Update existing Article
            $scope.update = function () {
                var category = $scope.category;

                category.$update(function () {
                    $state.go('home.categories');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            // Find a list of Categories
            $scope.find = function () {
                $scope.Categories = Categories.query();
            };

            // Find existing Article
            $scope.findOne = function () {
                $scope.category = Categories.get({
                    categoryId: $stateParams.id
                });
            };
        }
    ]);
});