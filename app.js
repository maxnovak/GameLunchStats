var app = angular.module('gameStats', []);

app.controller('DataController', function ($scope, $http) {
    $http.get('getPlayers')
        .success(function (data) {
            $scope.players = data;
        });
    $scope.getGameStats = function () {
        var searchPlayer = $("#playerList option:selected").val();
        $("#GameData").html("");
        $http({
                method: 'POST',
                url: "/data",
                data: {
                    player: searchPlayer
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function (data, status) {
                var games = data[0].GameList;
                for (var item of games) {
                    $("#GameData").append(item.GameName + " " + item.Outcome + "</br>");
                }
            });
    };
});