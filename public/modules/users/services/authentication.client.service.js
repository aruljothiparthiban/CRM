define([
    'app',
    'angularLocalStorage'
], function (app) {
    app.factory('Authentication', ['$http', '$q', 'localStorageService', '$state', function ($http, $q, localStorageService, $state) {

        var setUser = function (user) {
            localStorageService.set('npcrmuser', user);
        };
        var getUser = function () {
            return localStorageService.get('npcrmuser');
        };
        var removeUser = function () {
            localStorageService.remove('npcrmuser');
        };


        var _principal = {
            user: null,
            init: function () {
                this.user = getUser();
                return this;
            },
            signin: function (credentials,callback) {
                $http.post('/auth/signin', credentials).success(function (user) {
                    _principal.user = user;
                    setUser(user);
                    if (callback) callback(null, user);
                }).error(function (err) {
                    if (callback) callback(err, null);
                });
            },
            forgotPassword: function (credentials, callback) {
                $http.post('/auth/forgot', credentials).success(function (user) {
                    _principal.user = user;
                    setUser(user);
                    if (callback) callback(null, user);
                }).error(function (err) {
                    if (callback) callback(err, null);
                });
            },
            signup: function (credentials,callback) {
                $http.post('/auth/signup', credentials).success(function (user) {
                    _principal.user = user;
                    setUser(user);
                    if (callback) callback(null,user);
                }).error(function (err) {
                    if (callback) callback(err, null);
                    $scope.error = response.message;
                });
            },
            signout: function () {
                _principal.user = null;
                removeUser();
                $state.go('login');
            },
            authenticated: function () {
                return _principal.user !== null;
            }
        };
        
        return _principal.init();
    }]);
});
