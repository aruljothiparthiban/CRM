define([
    'app',
    '../../people/services/peoples.client.service',
    '../../organization/services/organizations.client.service',
    '../../configuration/services/categories.client.service',
    '../../users/services/users.client.service',
    '../../activity/services/activities.client.service',
    '../../configuration/services/activity-type.client.service'
], function (app) {
    'use strict';

    app.controller('ActivityController', ['$scope', '$stateParams', '$state', 'Authentication', 'Peoples',
        'Activities','Organizations', 'Categories', 'Users','ActivityTypes',
        function ($scope, $stateParams, $state, Authentication, Peoples,Activities, Organizations, Categories, Users, ActivityTypes) {
            $scope.authentication = Authentication;
            $scope.focus = true;

            $scope.activity = {
                name: null,
                peoples: [{ id: '' }]
            };

            $scope.grid = {
                pageIndex: 1,
                pageSize: 10,
                count: 0,
                items: [],
                selectedItems: [],
                allSelected: false,
                next: function () {
                    this.pageIndex++;
                    this.load();
                },
                prev: function () {
                    this.pageIndex--;
                    this.load();
                },
                setPageSize: function (pageSize, e) {
                    e.preventDefault();
                    this.pageSize = pageSize;
                    this.load();
                },
                selectAllChanged: function () {
                    var flag = this.allSelected;
                    _.forEach(this.items, function (x) {
                        x.selected = flag;
                    });
                },
                itemsChange: function (items) {
                    this.selectedItems = _.filter(items, function (x) {
                        return x.selected;
                    });
                    this.allSelected = (this.items.length > 0 && this.selectedItems.length === this.items.length);
                },
                load: function () {
                    Activities.query({
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    }, function (err, grid) {
                        if (!err) {
                            $scope.grid.pageIndex = grid.pageIndex;
                            $scope.grid.pageSize = grid.pageSize;
                            $scope.grid.count = grid.count;
                            _.forEach(grid.items, function (x) {
                                _.extend(x, { selected: false });
                            });
                            $scope.grid.items = grid.items;
                            $scope.$watch('grid.items', function (newValue, oldValue) {
                                if (!angular.equals(oldValue, newValue)) {
                                    $scope.grid.itemsChange(newValue);
                                }
                            }, true);
                        }
                    });
                }
            };

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
                console.log(activity);
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

            $scope.canDelete = function (p) {
                return p.createdBy._id === Authentication.user._id;
            };
            
            $scope.findOne = function () {
                Peoples.getAll(function (err, peoples) {
                    if (!err) {
                        $scope.Peoples = peoples;

                        Activities.get($stateParams.id, function (err, data) {
                            console.log(data);
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