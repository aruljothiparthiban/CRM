define([
    'app',
    '../services/menus.client.service',
], function (app) {
    'use strict';

    app.controller('HomeController', ['$scope','Authentication','Menus',
        function ($scope, Authentication, Menus) {
            $scope.programName = null;
            $scope.authentication = Authentication;

            $scope.$on('$viewContentLoaded', function () {
                $scope.Menus = Menus.query(Authentication.user.roles[0]);
                $('#body').removeClass('gray-bg');
                setTimeout(function () {
                    $('#side-menu').metisMenu();
                }, 500);                
            });

            $scope.toggleNavbar = function (e) {
                e.preventDefault();
                $('#body').toggleClass('mini-navbar');
            };

            $scope.$on('userProfileChange', function () {
                $scope.authentication.isAuthenticated();
            });
        }
    ]);
});