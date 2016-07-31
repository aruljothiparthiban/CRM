define([
    'app',
    '_',
    '../../organization/services/organizations.client.service',
    '../../configuration/services/categories.client.service',
    '../../users/services/users.client.service',
    '../../people/services/peoples.client.service'
], function (app,_) {
    'use strict';

    app.controller('OrganizationController', ['$scope', '$stateParams', '$state', 'Authentication',
        'Organizations', 'Categories', 'Users','Peoples',
        function ($scope, $stateParams, $state, Authentication, Organizations, Categories, Users, Peoples) {
            $scope.authentication = Authentication;
            $scope.focus = true;

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
                    Organizations.query({
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

            $scope.organization = {
                name: null,
                peoples: [{id:''}]
            };            
            $scope.Peoples = [];

            $scope.peopleChange = function (p) {
                if ($scope.organization.peoples.indexOf(p._id) === -1) {
                    var index = $scope.organization.peoples.indexOf({id:''});
                    if (index !== -1) {
                        $scope.organization.peoples[index].id = p._id;
                    }
                }
            };
            $scope.addPeople = function (index) {
                if (index === 0) {
                    $scope.organization.peoples.push({id:''});
                }
                else {
                    var array = [];
                    for (var i = 0; i < $scope.organization.peoples.length; i++) {
                        if (i !== index) {
                            array.push($scope.organization.peoples[i])
                        }                        
                    }
                    $scope.organization.peoples = array;
                }
            };

            $scope.create = function () {
                var organization = $scope.organization;
                organization.peoples = _.map(organization.peoples, function (x) {
                    return x.id._id;
                });
                Organizations.save(organization,function (err,data) {
                    if (!err) {
                        $state.go('home.organizations');
                        $scope.people = null;
                    }
                    else {
                        $scope.error = errorResponse.data;
                    }
                });
            };

            $scope.detail = function (p) {
                $state.go('home.organizationDetail', { id: p._id });
            };

            $scope.delete = function () {
                var items = _.map($scope.grid.selectedItems, function (x) {
                    return x._id;
                });
                Organizations.remove(items, function (err, res) {
                    if (!err && res.success) {
                        $scope.grid.load();
                        $('#deleteConfirmModal').modal('hide');
                    }
                });
            };

            $scope.update = function () {
                var organization = $scope.organization;
                organization.peoples = _.map(organization.peoples, function (x) {
                    return x.id._id;
                });
                Organizations.update($stateParams.id,organization, function (err, data) {
                    if (!err) {
                        $state.go('home.organizations');
                        $scope.organization = null;
                    }
                    else {
                        $scope.error = errorResponse.data;
                    }
                });
            };

            $scope.find = function () {
                $scope.Organizations = Organizations.query();
            };

            $scope.findOne = function () {
                Peoples.getAll(function (err, peoples) {
                    if (!err) {
                        $scope.Peoples = peoples;
                        Organizations.get($stateParams.id, function (err, data) {
                            data.peoples = data.peoples || [{ id: '' }];
                            for (var index = 0; index < data.peoples.length; index++) {
                                var array = _.filter(peoples, function (x) {
                                    return data.peoples[index] === x._id;
                                })
                                if (array.length > 0) {
                                    data.peoples[index] = { id: array[0] };
                                }
                            }
                            $scope.organization = data;
                            $scope.Categories = Categories.query();
                            $scope.Users = [{
                                _id: '553a1b260b465d5408f9c446',
                                displayName: 'aruljothi parthiban'
                            }];// Users.query();
                        });
                    }
                });
            };

            $scope.init = function () {
                Peoples.getAll(function (err, peoples) {
                    if (!err) {
                        console.log(peoples);
                        $scope.Peoples = peoples;
                    }                    
                });
                $scope.Categories = Categories.query();
                $scope.Users = [{
                    _id: '553a1b260b465d5408f9c446',
                    displayName:'aruljothi parthiban'
                }];// Users.query();
            };
        }
    ]);
});