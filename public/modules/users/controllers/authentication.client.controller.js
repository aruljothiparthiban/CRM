define([
    'app',
    '../../users/services/authentication.client.service'   
], function (app) {

    'use strict';
    app.controller('AuthenticationController', ['$scope', '$http','$state', '$location','Authentication',
        function ($scope, $http, $state,$location, Authentication) {
            $scope.focus = true;
            $scope.authentication = Authentication;
            $scope.credentials = {
                email:null
            };
            
            var state = $scope.$parent.toState;
            var stateParams = $scope.$parent.toParams;
            $scope.tokenVefified = false;
            if (state.name === 'register') {                
                $http.get('/auth/validate/invite/' + stateParams.token).success(function (invite) {
                    if (invite === 'null') {                        
                        $state.go('notFound');
                    }
                    $scope.credentials.email = invite.email;
                    $scope.tokenVefified = true;
                }).error(function (response) {
                    $state.go('notFound');
                    $scope.tokenVefified = true;
                });
            }
            // If user is signed in then redirect back home
            if ($scope.authentication.user) $location.path('/');

            $scope.signup = function () {
                Authentication.signup($scope.credentials, function (err, user) {
                    if (!err) {
                        $state.go('signinComplete');
                    }
                    else {
                        $scope.error = err.message;
                    }
                });
            };

            $scope.signin = function () {
                Authentication.signin($scope.credentials, function (err, response) {
                    if (response) {
                        $location.path('/');
                    }
                    else {
                        $scope.error = response.message;
                    }
                });
            };

            $scope.forgotPassword = function () {
                Authentication.forgotPassword($scope.credentials, function (err, response) {
                    if (response) {
                        console.log(response);
                        $location.path('/');
                    }
                    else {
                        $scope.error = response.message;
                    }
                });
            };

            $scope.signout = function () {
                alert('signout');
                Authentication.signout();
            };

            $scope.$on('$viewContentLoaded', function () {               
                $('#body').addClass('gray-bg');
            });
        }
    ]);
});
