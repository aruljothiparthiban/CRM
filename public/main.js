/// <reference path="lib/angularLocalStorage/src/angularLocalStorage.js" />
require.config({
    baseUrl: './lib/',
    paths: {
        'angular': ['angular/angular.min'],
        'jquery': ['jquery/dist/jquery.min'],
        'bootstrap': ['bootstrap/dist/js/bootstrap.min'],
        'ui.router': [
			'angular-ui-router/release/angular-ui-router.min'
        ],
        'ui.bootstrap': [
			'angular-bootstrap/ui-bootstrap-tpls.min'
        ],
        'app': [
			'../app'
        ],
        'ngResource': [
           'angular-resource/angular-resource.min'
        ],
        'angularAMD': [
            'angularAMD/angularAMD.min'
        ],
        'angularLocalStorage': [
            'angular-local-storage/dist/angular-local-storage.min'
        ],
        '_': [
            'lodash/lodash.min'
        ],
        'async': [
            'async/lib/async'
        ],
        'toastr': 'toastr/toastr.min',
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ui.router': {
            deps: ['angular']
        },
        'ui.bootstrap': {
            deps: ['angular']
        },
        'ngRoute': {
            deps: ['angular']
        },
        'app': {
            deps: ['angular']
        },
        'ngResource': {
            deps: ['angular']
        },
        'angularAMD': {
            deps: ['angular']
        },
        'angularLocalStorage': {
            deps: ['angular']
        }
    }
});

require([
	'angular',
	'app',
	'../app.routes'
],
	function (angular, app, routes) {
	    routes.registerRoutes(app);
	    angular.bootstrap(document, ['npcrm']);
	});