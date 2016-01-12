angular.module('LeagueViewer')
  .controller('RankedStatsCtrl', [
    '$scope',
    '$location',
    'lolapi',
    '$stateParams',
    '$state',
    function($scope, $location, lolapi, $stateParams, $state) {

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

      var init = function() {
        if ($stateParams.summonerName) {
          getSummonerIdByName($stateParams.summonerName)
            .then(getRankedInfo)
            .catch(onGetSummonerByNameError);
        }
      }

      init();

    }
  ]);
