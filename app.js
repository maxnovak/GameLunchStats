var app = angular.module('gameStats', []);

app.controller('DataController', function ($scope, $http) {
    $http.get('getPlayers')
        .success(function (data) {
            $scope.players = data;
        });
});