﻿define([
    'app'
], function (app) {
    'use strict';

    app.factory('Activities', ['$resource', function ($resource) {

        var _query = function (params, cb) {
            var promise = $resource('activities', params, {
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

        var _save = function (data, cb) {
            var promise = $resource('activities', {}, {
                post: {
                    method: 'POST'
                }
            })
            return promise.post(data).$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        var _get = function (id, cb) {
            var promise = $resource('activities/' + id, {}, {
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

        var _getAll = function (cb) {
            var promise = $resource('activities/getall', {}, {
                get: {
                    isArray: true
                }
            })
            return promise.get().$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        var _getAllByPeople = function (id, cb) {
            var promise = $resource('activities/getall/'+id, {}, {
                get: {
                    isArray: true
                }
            })
            return promise.get().$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        var _update = function (id, data, cb) {
            var promise = $resource('activities/' + id, {}, {
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

        var _remove = function (data, cb) {
            var promise = $resource('activities/remove', {}, {
                post: {
                    method: 'POST'
                }
            })
            return promise.post(data).$promise.then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };

        return {
            query: _query,
            getAll: _getAll,
            getAllByPeople:_getAllByPeople,
            save: _save,
            get: _get,
            update: _update,
            remove: _remove
        };
    }
    ]);
});