define([
    'app',
    '../../configuration/services/boards.client.service'
], function (app) {
    'use strict';

    app.controller('BoardController', ['$scope', '$stateParams', '$state', 'Authentication', 'Boards',
        function ($scope, $stateParams, $state, Authentication, Boards) {
            $scope.authentication = Authentication;
            $scope.focusName = true;
            $scope.board = {
                name:null
            };

            $scope.create = function () {
                var board = new Boards({
                    name: this.board.name
                });

                board.$save(function (response) {
                    $state.go('home.boards');
                    $scope.name = '';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            $scope.delete = function (p) {
                $scope.current = p;
            };

            $scope.remove = function () {
                if ($scope.current) {
                    $scope.current.$remove();
                    $('#deleteConfirmModal').modal('hide');
                    for (var i in $scope.Boards) {
                        if ($scope.Boards[i] === $scope.current) {
                            $scope.Boards.splice(i, 1);
                        }
                    }
                } else {
                    $scope.current.$remove(function () {
                        $('#deleteConfirmModal').modal('hide');
                        $state.go('home.boards');
                    });
                }
            };

            $scope.update = function () {
                var board = $scope.board;

                board.$update(function () {
                    $state.go('home.boards');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data;
                });
            };

            $scope.find = function () {
                $scope.Boards = Boards.query();
            };

            $scope.findOne = function () {
                $scope.board = Boards.get({
                    boardId: $stateParams.id
                });
            };
        }
    ]);
});