define([
    'angularAMD',
    '_',
    './modules/users/services/authentication.client.service',
    './modules/users/services/authorization.client.service',    
    './modules/users/controllers/authentication.client.controller',
    './modules/core/controllers/home.client.controller',
    './modules/configuration/controllers/category.client.controller',
    './modules/configuration/controllers/activity-type.client.controller',
    './modules/configuration/controllers/subscription.client.controller',
    './modules/configuration/controllers/board.client.controller',
    './modules/organization/controllers/organization.client.controller',
    './modules/people/controllers/people.client.controller',
    './modules/activity/controllers/activity.client.controller',
    './modules/users/controllers/user.client.controller',
    './modules/users/controllers/settings.client.controller',
    './modules/import-export/controllers/import.client.controller',
    './modules/import-export/controllers/export-people.client.controller',
    './modules/import-export/controllers/export-organisation.client.controller',
    './modules/import-export/controllers/export-activity.client.controller',

    './modules/users/controllers/password.client.controller',

    './modules/configuration/config/configuration-category.client.routes',
    './modules/configuration/config/configuration-activity-type.client.routes',
    './modules/configuration/config/configuration-subscription.client.routes',
    './modules/configuration/config/configuration-board.client.routes',
    './modules/organization/config/organization.client.routes',
    './modules/people/config/people.client.routes',
    './modules/activity/config/activity.client.routes',
    './modules/users/config/users.client.routes',
    './modules/import-export/config/import-export.client.routes'

], function (angularAMD,_) {
    var config = {};
    config.registerRoutes = function (app) {
        app.config(function ($stateProvider,$urlRouterProvider) {
            
            $stateProvider
                .state("site", {
                    abstract: true,
                    resolve: {
                        authorize: ['Authorization', function (Authorization) {
                            return Authorization.authorize();
                        }]
                    }
                })
                .state('login', {
                    url: "/login",
                    templateUrl: "../modules/users/views/authentication/signin.client.view.html",
                    controller: "AuthenticationController"
                })
                .state('forgotPassword', {
                    url: "/forgot-password",
                    templateUrl: "../modules/users/views/authentication/forgot-password.client.view.html",
                    controller: "AuthenticationController"
                })
                .state('register', {
                    url: "/register/:token",
                    templateUrl: "../modules/users/views/authentication/signup.client.view.html",
                    controller: "AuthenticationController"
                })
                .state('signinComplete', {
                    url: "/register/success",
                    templateUrl: "../modules/users/views/authentication/signup-complete.client.view.html",
                    controller: "AuthenticationController"
                })
                .state('notFound', {
                    url: "/404",
                    templateUrl: "../modules/core/views/404.client.view.html"
                })
                .state('home', {
                    url: "/",
                    templateUrl: "../modules/core/views/home.client.view.html",
                    controller: "HomeController"
                })
                .state('home.profile', {
                    url: "my-profile",
                    templateUrl: "../modules/users/views/settings/edit-profile.client.view.html",
                    controller: "SettingsController"
                })
                .state('home.changePassword', {
                    url: "change-password",
                    templateUrl: "../modules/users/views/settings/change-password.client.view.html",
                    controller: "SettingsController"
                })
                .state('home.changepassword', {
                    url: "reset-password",
                    templateUrl: "../modules/users/views/password/reset-password.client.view.html",
                    controller: "PasswordController"
                });
            $urlRouterProvider.otherwise('/');
        });

        app.run(['$rootScope', '$state', '$stateParams', 'Authorization', 'Authentication','Menus',
            function ($rootScope, $state, $stateParams, Authorization, Authentication, Menus) {
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    $rootScope.toState = toState;
                    $rootScope.toParams = toParams;
                    $rootScope.params = $stateParams;
                    var exceptionRoutes = ['login', 'register', 'notFound', 'signinComplete'];
                    if (exceptionRoutes.indexOf(toState.name) === -1 && !Authentication.authenticated()) {
                        window.location.href = '#/login';
                    }
                    else {
                        var role = Authentication.user.roles[0];
                        var routes = ['home'];
                        var roleBasedAccessRoutes = [];
                        _.forEach(Menus.query(role), function (x) {
                            if (x.routeName !== '#') {
                                routes.push(x.routeName);
                                if (x.allowedSubRoutes && x.allowedSubRoutes.length > 0) {
                                    _.forEach(x.allowedSubRoutes, function (r) {
                                        if (r.roles.indexOf(role) !== -1) {
                                            routes.push(r.route);
                                        }
                                    });
                                }
                                if (x.hasRoleBasedAccess) {
                                    roleBasedAccessRoutes.push(x.routeName);
                                }
                            }
                            if (x.subMenus && x.subMenus.length > 0) {
                                _.forEach(x.subMenus, function (s) {
                                    if (s.routeName !== '#') {
                                        routes.push(s.routeName);
                                        if (s.hasRoleBasedAccess) {
                                            roleBasedAccessRoutes.push(s.routeName);
                                        }
                                    }
                                });
                            }
                        });
                        //console.log(routes);
                        if (routes.indexOf(toState.name) === -1) {
                            // redirect to 404
                            console.log(toState.name);
                            $('#body').addClass('gray-bg');
                            window.location.href = '#/404';
                        }
                        else {
                            if (roleBasedAccessRoutes.indexOf(toState.name) !== -1) {                                
                                if (role !== 'admin' && toState.templateUrl.indexOf(role)==-1) {
                                    toState.templateUrl = toState.templateUrl.replace('views', 'views/' + role);
                                }
                            }
                        }
                    }
                });
            }]);

    };
    return config;
});
