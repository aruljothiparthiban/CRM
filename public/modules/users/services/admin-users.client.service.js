define([
    'app'
], function (app) {
    'use strict';

    app.factory('AdminUsers', ['$resource', function ($resource) {

        var _query = function (params, cb) {
            var promise = $resource('admin/users', params, {
                get: {
                    isArray: false
                }
            })
            return promise.get().$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        var _get = function (id, cb) {
            var promise = $resource('admin/users/' + id, {}, {
                get: {
                    isArray: false
                }
            })
            return promise.get().$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        var _update = function (id, data, cb) {
            var promise = $resource('admin/users/' + id, {}, {
                update: {
                    method: 'PUT'
                }
            })
            return promise.update(data).$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        return {
            query: _query,
            get: _get,
            update:_update
        };
    }
    ]);
});