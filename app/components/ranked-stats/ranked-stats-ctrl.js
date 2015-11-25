angular.module('LeagueViewer')
  .controller('RankedStatsCtrl', [
    '$scope',
    '$location',
    'lolapi',
    '$stateParams',
    '$state',
    function($scope, $location, lolapi, $stateParams, $state) {

      var summonerName = $stateParams.summonerName;
      $scope.summonerName = summonerName;

      var onGetSummonerByNameError = function(reason) {
        $scope.errorMessage = 'Could not get Summoner Info';
      };

      var getSummonerByName = function() {
        lolapi.getSummonerByName(summonerName).then(
          function(result) {
            console.log('test');
            $scope.summonerObject = result[summonerName];
            summonerId = $scope.summonerObject.id;
            getRankedInfo(summonerId);

          },
          onGetSummonerByNameError
        );
      };

      var getRankedInfo = function(summonerId) {
        lolapi.getRankedInfo(summonerId).then(
          function(result) {
            console.log('test2');
            var champions = result.champions;
            console.log("champions:", champions);
            getChampionInfo(champions);
          },
          onGetSummonerByNameError
        );
      };

      var getChampionInfo = function(champions) {
        $scope.champions = champions;
        console.log($scope.champions);
        return $scope.champions;
      };


      $scope.champions = getSummonerByName();

    }
  ]);
