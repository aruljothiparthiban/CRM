define([
    'app',
    'async',
    '../../people/services/peoples.client.service',
    '../../organization/services/organizations.client.service',
    '../../configuration/services/categories.client.service',
    '../../users/services/users.client.service',
    '../../configuration/services/subscriptions.client.service',
    '../../configuration/services/boards.client.service',
    '../../activity/services/activities.client.service'
], function (app, async) {
    'use strict';

    app.controller('PeopleController', ['$scope', '$stateParams', '$state', 'Authentication', 'Peoples',
        'Organizations', 'Categories', 'Users','Subscriptions','Boards','Activities',
        function ($scope, $stateParams, $state, Authentication, Peoples,
            Organizations, Categories, Users, Subscriptions, Boards, Activities) {
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
                    Peoples.query({
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

            $scope.people = {
                organizations: [{ id: '' }],
                subscriptions: [{ id: '' }],
                boards: [{ id: '' }]
            };

            $scope.Organizations = [];
            $scope.Subscriptions = [];
            $scope.Boards = [];
            $scope.Activities = [];
            $scope.addOrganization = function (index) {
                if (index === 0) {
                    $scope.people.organizations.push({ id: '' });
                }
                else {
                    var array = [];
                    for (var i = 0; i < $scope.people.organizations.length; i++) {
                        if (i !== index) {
                            array.push($scope.people.organizations[i])
                        }
                    }
                    $scope.people.organizations = array;
                }
            };
            $scope.addSubscription = function (index) {
                if (index === 0) {
                    $scope.people.subscriptions.push({ id: '' });
                }
                else {
                    var array = [];
                    for (var i = 0; i < $scope.people.subscriptions.length; i++) {
                        if (i !== index) {
                            array.push($scope.people.subscriptions[i])
                        }
                    }
                    $scope.people.subscriptions = array;
                }
            };
            $scope.addBoard = function (index) {
                if (index === 0) {
                    $scope.people.boards.push({ id: '' });
                }
                else {
                    var array = [];
                    for (var i = 0; i < $scope.people.boards.length; i++) {
                        if (i !== index) {
                            array.push($scope.people.boards[i])
                        }
                    }
                    $scope.people.boards = array;
                }
            };

            $scope.create = function () {
                var people = $scope.people;
                people.organizations = _.map(people.organizations, function (x) {
                    return x.id._id;
                });
                people.subscriptions = _.map(people.subscriptions, function (x) {
                    return x.id._id;
                });
                people.boards = _.map(people.boards, function (x) {
                    return x.id._id;
                });
                Peoples.save(people, function (err, data) {
                    if (!err) {
                        $state.go('home.peoples');
                        $scope.people = null;
                    }
                    else {
                        $scope.error = errorResponse.data;
                    }
                });
            };

            $scope.update = function () {
                var people = $scope.people;
                people.organizations = _.map(people.organizations, function (x) {
                    return x.id._id;
                });
                people.subscriptions = _.map(people.subscriptions, function (x) {
                    return x.id._id;
                });
                people.boards = _.map(people.boards, function (x) {
                    return x.id._id;
                });
                Peoples.update($stateParams.id, people, function (err, data) {
                    if (!err) {
                        $state.go('home.peoples');
                        $scope.people = null;
                    }
                    else {
                        $scope.error = errorResponse.data;
                    }
                });
            };

            $scope.delete = function () {
                var items = _.map($scope.grid.selectedItems, function (x) {
                    return x._id;
                });
                Peoples.remove(items, function (err, res) {
                    if (!err && res.success) {
                        //toastr.success(res.Message);
                        $scope.grid.load();
                        $('#deleteConfirmModal').modal('hide');
                    }
                });
            };

            $scope.findOne = function () {                
                async.waterfall([
                    function (cb) {
                        Organizations.getAll(function (err, organizations) {
                            if (!err)
                            {
                                $scope.Organizations = organizations;
                                cb(null, organizations);
                            }
                        });
                    },
                    function (organizations, cb) {                      
                        Subscriptions.query().$promise.then(function (subscriptions) {
                            $scope.Subscriptions = subscriptions;
                            cb(null,organizations, subscriptions);
                        });
                    },
                    function (organizations, subscriptions, cb) {                       
                        Boards.query().$promise.then(function (boards) {
                            $scope.Boards = boards;
                            cb(null,organizations, subscriptions, boards);
                        });
                    },
                    function(organizations,subscriptions,boards,cb){
                        Categories.query().$promise.then(function (categories) {
                            $scope.Categories = categories;
                            cb(null, organizations, subscriptions, boards, categories);
                        });
                    },
                    function (organizations, subscriptions, boards, categories, cb) {
                        Peoples.get($stateParams.id, function (err, data) {
                            if (!err) {
                                data.organizations = data.organizations || [{ id: '' }];
                                for (var index = 0; index < data.organizations.length; index++) {
                                    var array = _.filter(organizations, function (x) {
                                        return data.organizations[index] === x._id;
                                    })
                                    if (array.length > 0) {
                                        data.organizations[index] = { id: array[0] };
                                    }
                                }
                                data.subscriptions = data.subscriptions || [{ id: '' }];
                                for (var index = 0; index < data.subscriptions.length; index++) {
                                    var array = _.filter(subscriptions, function (x) {
                                        return data.subscriptions[index] === x._id;
                                    })
                                    if (array.length > 0) {
                                        data.subscriptions[index] = { id: array[0] };
                                    }
                                }
                                data.boards = data.boards || [{ id: '' }];
                                for (var index = 0; index < data.boards.length; index++) {
                                    var array = _.filter(boards, function (x) {
                                        return data.boards[index] === x._id;
                                    })
                                    if (array.length > 0) {
                                        data.boards[index] = { id: array[0] };
                                    }
                                }
                                $scope.people = data;
                                $scope.Users = [{
                                    _id: '553a1b260b465d5408f9c446',
                                    displayName: 'aruljothi parthiban'
                                }];// Users.query();
                                //cb();
                            }
                        });
                    }
                ], function (err) {
                    console.log(err);
                });

                Activities.getAllByPeople($stateParams.id, function (err, data) {
                    if (!err) {
                        $scope.activities = data;
                    }
                })
            };

            $scope.detail = function (p) {
                $state.go('home.peopleDetail', {id:p._id});
            };

            $scope.init = function () {
                $scope.Organizations = Organizations.query();
                $scope.Subscriptions = Subscriptions.query();
                $scope.Boards = Boards.query();
                $scope.Categories = Categories.query();
                $scope.Users = [{
                    _id: '553a1b260b465d5408f9c446',
                    displayName:'aruljothi parthiban'
                }];// Users.query();
            };

            $scope.activityClick = function (p) {
                $state.go('home.activityDetail', { id: p._id });                
            };
        }
    ]);
});

