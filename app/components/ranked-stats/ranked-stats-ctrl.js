angular.module('LeagueViewer')
  .controller('RankedStatsCtrl', [
    '$scope',
    '$http',
    '$location',
    'lolapi',
    '$stateParams',
    function($scope, $http, $location, lolapi, $stateParams) {
        $scope.championImageMap = {};
        $scope.summonerName = $stateParams.summonerName;

        var setChampionImageUrl = function(champion) {
            var championName = '';
            for (var key in $scope.championImageMap) {
                if ($scope.championImageMap[key].id == champion.id) {
                    championName = key;
                }

            }
            champion.championUrl = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"+ championName +".png";
        };


      var onGetSummonerByNameError = function() {
        $scope.errorMessage = 'Could not get Summoner Info';
      };

      var getSummonerIdByName = function(summonerName) {
        return lolapi.getSummonerByName(summonerName).then(
          function(result) {
            $scope.summonerObject = result[summonerName];
            return $scope.summonerObject.id;
          },
          onGetSummonerByNameError
        );
      };

      var getRankedInfo = function(summonerId) {
        return lolapi.getRankedInfo(summonerId).then(
          function(result) {
            $scope.champions = result.champions;
          },
          onGetSummonerByNameError
        );
      };

      var createStats = function() {
        ($scope.champions).forEach(function(champion) {
          champion.stats.winPercentage = (champion.stats.totalSessionsWon / (champion.stats.totalSessionsPlayed)).toFixed(2);
          champion.stats.kda = ((champion.stats.totalChampionKills + champion.stats.totalAssists) / (champion.stats.totalDeathsPerSession)).toFixed(2);
        });
      };


      var init = function() {
          getChampionImages();
          if ($stateParams.summonerName) {
          getSummonerIdByName($stateParams.summonerName)
            .then(getRankedInfo)
            .then(createStats)
              .then(champImageReceived)
            .catch(onGetSummonerByNameError);
        }
      };

        var getChampionImages = function() {
            return $http.get('app/assets/data/champions.json')
                .success(function(data) {
                    $scope.championImageMap = data.data;
                })
                .error(onError);
        };

        var champImageReceived = function() {
            console.log($scope.champions);
            for (var i = 0; i < $scope.champions.length; i++) {
                setChampionImageUrl($scope.champions[i]);
            }
        };


        var onError = function(error) {
            $scope.error = "Could not fetch match information";
        };

      init();

    }
  ]);
