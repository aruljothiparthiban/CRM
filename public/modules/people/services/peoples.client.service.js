﻿define([
    'app'
], function (app) {
    'use strict';

    app.factory('Peoples', ['$resource', function ($resource) {

            var _query = function (params, cb) {
                var promise = $resource('peoples', params, {
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
                var promise = $resource('peoples/getall', {}, {
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
            
            var _save = function (data, cb) {
                var promise = $resource('peoples', {}, {
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
                var promise = $resource('peoples/'+id, {}, {
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
                var promise = $resource('peoples/'+id, {}, {
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
                var promise = $resource('peoples/remove', {}, {
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
                getAll:_getAll,
                save: _save,
                get: _get,
                update: _update,
                remove: _remove
            };
        }
    ]);
});