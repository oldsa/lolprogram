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

      var createStats = function() {
        _($scope.champions).forEach(function(champion) {
          champion.stats.winPercentage = champion.stats.totalSessionsWon / (champion.stats.totalSessionsPlayed);
        });
      }

      var init = function() {
        if ($stateParams.summonerName) {
          getSummonerIdByName($stateParams.summonerName)
            .then(getRankedInfo)
            .then(createStats)
            .catch(onGetSummonerByNameError);
        }
      };

      init();

    }
  ]);
