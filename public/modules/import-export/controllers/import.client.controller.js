define([
    'app',
    '../../people/services/peoples.client.service',
    '../../organization/services/organizations.client.service',
    '../../configuration/services/categories.client.service',
    '../../users/services/users.client.service',
    '../../activity/services/activities.client.service',
    '../../configuration/services/activity-type.client.service',
    '../../import-export/services/import.client.service'
], function (app) {
    'use strict';

    app.controller('ImportController', ['$scope', '$stateParams', '$state', 'Authentication', 'Peoples',
        'Activities', 'Organizations', 'Categories', 'Users', 'ActivityTypes', 'Imports',
        function ($scope, $stateParams, $state, Authentication, Peoples, Activities,
            Organizations, Categories, Users, ActivityTypes, Imports) {
            $scope.authentication = Authentication;
            $scope.focus = true;
            $scope.target = null;

            $scope.chooseTarget = function (target,e) {
                $scope.target = target;
                e.preventDefault();
            };

            $scope.activity = {
                name: null,
                peoples: [{ id: '' }]
            };

            $scope.importFromCsv = function ($this,e) {
                var uploadDone = false;
                var postData = new FormData();
                $.each(e.target.files, function (key, value) {
                    postData.append(key, value);
                });
                var control = $(e.target);
                control.replaceWith(control.clone(true));
                Imports.upload($scope.target, postData, function (err, res) {
                    if (!err && res.success) {
                        if ($scope.target === 'Peoples') {
                            $state.go('home.peoples');
                        }
                        else if ($scope.target === 'Organisations') {
                            $state.go('home.organizations');
                        }
                    }
                });
            }

            $scope.Peoples = [];
            $scope.peopleChange = function (p) {
                if ($scope.activity.peoples.indexOf(p._id) === -1) {
                    var index = $scope.activity.peoples.indexOf({ id: '' });
                    if (index !== -1) {
                        $scope.activity.peoples[index].id = p._id;
                    }
                }
            };
            $scope.addPeople = function (index) {
                if (index === 0) {
                    $scope.activity.peoples.push({ id: '' });
                }
                else {
                    var array = [];
                    for (var i = 0; i < $scope.activity.peoples.length; i++) {
                        if (i !== index) {
                            array.push($scope.activity.peoples[i])
                        }
                    }
                    $scope.activity.peoples = array;
                }
            };

            $scope.create = function () {
                var activity = $scope.activity;
                activity.peoples = _.map(activity.peoples, function (x) {
                    return x.id._id;
                });
                console.log(activity);
                Activities.save(activity, function (err, data) {
                    if (!err) {
                        $state.go('home.activities');
                        $scope.activity = null;
                    }
                    else {
                        $scope.error = errorResponse.data;
                    }
                });
            };

            $scope.detail = function (p) {
                $state.go('home.activityDetail', { id: p._id });
            };

            $scope.delete = function () {
                var items = _.map($scope.grid.selectedItems, function (x) {
                    return x._id;
                });
                Activities.remove(items, function (err, res) {
                    if (!err && res.success) {
                        $scope.grid.load();
                        $('#deleteConfirmModal').modal('hide');
                    }
                });
            };

            $scope.update = function () {
                var activity = $scope.activity;
                activity.peoples = _.map(activity.peoples, function (x) {
                    return x.id._id;
                });
                Activities.update($stateParams.id, activity, function (err, data) {
                    if (!err) {
                        $state.go('home.activities');
                        $scope.organization = null;
                    }
                    else {
                        $scope.error = errorResponse.data;
                    }
                });
            };
            
            $scope.findOne = function () {
                Peoples.getAll(function (err, peoples) {
                    if (!err) {
                        $scope.Peoples = peoples;

                        Activities.get($stateParams.id, function (err, data) {
                            if (!err) {
                                data.peoples = data.peoples || [{ id: '' }];
                                for (var index = 0; index < data.peoples.length; index++) {
                                    var array = _.filter(peoples, function (x) {
                                        return data.peoples[index] === x._id;
                                    })
                                    if (array.length > 0) {
                                        data.peoples[index] = { id: array[0] };
                                    }
                                }
                                $scope.activity = data;
                                $scope.Categories = Categories.query();
                                $scope.ActivityTypes = ActivityTypes.query();
                                $scope.Users = [{
                                    _id: '553a1b260b465d5408f9c446',
                                    displayName: 'aruljothi parthiban'
                                }];// Users.query();
                            }
                        });
                    }
                });
            };

            $scope.init = function () {
                Peoples.getAll(function (err, peoples) {
                    if (!err) {
                        $scope.Peoples = peoples;
                    }
                });               
                $scope.Categories = Categories.query();
                $scope.ActivityTypes = ActivityTypes.query();
                $scope.Users = [{
                    _id: '553a1b260b465d5408f9c446',
                    displayName:'aruljothi parthiban'
                }];// Users.query();
            };
            $scope.$on('$viewContentLoaded', function () {
                //$('#activity_date').datepicker({});
            });
        }
    ]);
});