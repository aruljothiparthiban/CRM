define(
    [
        'app'
    ], function (app) {
        'use strict';

        app.factory('Authorization', ['$rootScope', '$state', 'Authentication', function ($rootScope, $state, Authentication) {
            return {
                authorize: function () {
                    var principal = Authentication.principal();
                    if (!principal.authenticated) {
                        window.location.href = '#/login';
                        //$state.go('login');
                    }
                }
            }
        }]);
    });