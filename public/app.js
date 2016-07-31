define([
    'angular',
    'ui.router',
    'ui.bootstrap',
    'ngResource'
], function (angular) {

    var app = angular.module('npcrm', ['ui.router', 'ui.bootstrap', 'ngResource','LocalStorageModule']);
    app.directive('focus', function ($timeout, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focus, function (newValue, oldValue) {
                    if (newValue) { element[0].focus(); }
                });
                element.bind("blur", function (e) {
                    $timeout(function () {
                        scope.$apply(attrs.focus + "=false");
                    }, 0);
                });
                element.bind("focus", function (e) {
                    $timeout(function () {
                        scope.$apply(attrs.focus + "=true");
                    }, 0);
                })
            }
        }
    });

    app.directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    });

    app.value('appName', 'WAP Studio');
    return app;
});