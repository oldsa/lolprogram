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

      var onGetSummoner1Error = function(reason) {
        $scope.errorMessage = 'Could not get Summoner Info';
      };

      var getSummoner1 = function() {
        lolapi.getSummoner1(summonerName).then(
          function(result) {
            console.log('test');
            $scope.summonerObject = result[summonerName];
            summonerId = $scope.summonerObject.id;
            // getSummonerId(); summId
            getRankedInfo(summonerId);

          },
          function(failure) {
            console.log('fail');
          }
        );
      };

      // var getSummonerId = function(summonerId) {  summId
      //   $scope.summonerId = summonerId;
      //   console.log($scope.summonerId);
      //   return $scope.summonerId;
      // };

      // $scope.summonerId = getSummoner1();  summId
      var getRankedInfo = function(summonerId) {
        lolapi.getRankedInfo(summonerId).then(
          function(result) {
            console.log('test2');
            var champions = result.champions;
            console.log("champions:", champions);
            getChampionInfo(champions);
          },
          function(failure) {
            console.log('fail');
          }
        );
      };

      var getChampionInfo = function(champions) {
        $scope.champions = champions;
        console.log($scope.champions);
        return $scope.champions;
      };


      $scope.champions = getSummoner1();




    }
  ]);
