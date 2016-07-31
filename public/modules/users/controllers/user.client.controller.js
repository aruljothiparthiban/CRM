define([
    'app',
    '../../users/services/admin-users.client.service'
], function (app) {
    'use strict';

    app.controller('UserController', ['$scope', '$stateParams','$state', 'Authentication', 'AdminUsers',
        function ($scope, $stateParams, $state, Authentication, AdminUsers) {
            $scope.authentication = Authentication;
            $scope.focus = true;
            $scope.user = {
                provider:'local'
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
                    AdminUsers.query({
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
              
            $scope.isProcessing = false;
            $scope.inviteUser = function () {
                $scope.isProcessing = true;
                $scope.success = $scope.error = null;
                var user = new AdminUsers($scope.user);               
                user.$save(function (response) {
                    $scope.success = response;
                    $scope.isProcessing = false;
                    $scope.user.email = null;
                    $scope.focus = true;
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                    $scope.isProcessing = false;
                });
            };

            $scope.delete = function (p) {
                $scope.current = p;
            };

            // Remove existing Article
            $scope.remove = function () {
                if ($scope.current) {
                    $scope.current.$remove();
                    $('#deleteConfirmModal').modal('hide');
                    for (var i in $scope.AdminUsers) {
                        if ($scope.AdminUsers[i] === $scope.current) {
                            $scope.AdminUsers.splice(i, 1);
                        }
                    }
                } else {
                    $scope.current.$remove(function () {
                        $('#deleteConfirmModal').modal('hide');
                        $state.go('home.users');
                    });
                }
            };

            $scope.update = function () {
                var user = $scope.user;
                user.roles[0] = user.role;
                AdminUsers.update($stateParams.id,user, function (err, user) {
                    if (!err) {
                        $state.go('home.users');
                    }
                });
            };
            
            $scope.findOne = function () {
                AdminUsers.get($stateParams.id,function (err,user) {
                    if (!err) {
                        $scope.user = user;
                        $scope.user.role = user.roles[0];
                    }
                });
            };
        }
    ]);
});