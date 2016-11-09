angular.module('LeagueViewer')
  .controller('StatisticsCtrl',
    [
      '$scope',
      '$location',
      'lolapi',
      '$stateParams',
      '$state',
      function($scope, $location, lolapi, $stateParams, $state) {
        var accountId;

        $scope.haveResults = false;
        $scope.totalSeconds = 0;
        $scope.totalGoldEarned = 0;
        $scope.webTitle = "Summoner Information";
        $scope.errorMessage = "";

        $scope.countingResults = {};
        $scope.trueFalseStats = ['firstBaron', 'firstBlood', 'firstDragon', 'firstInhibitor', 'firstTower'];
        $scope.countingStats = ['towerKills', 'inhibitorKills', 'baronKills', 'dragonKills'];

        var summonerSearch = function(username) {
          return lolapi.getSummonerByName(username).then(function(summonerInfo) {
            return summonerInfo.id;
          });
        };

        var getMatchHistory = function(summonerId) {
          return lolapi.getMatchHistoryBySummonerId(summonerId).then(function(results) {
            return results;
          });
        };

        var getChampionImages = function(response) {
          if (response.httpStatus == "404") {
            //TODO: need to not have this call its own callback
            lolapi.getMatchHistory1(accountId).then(getChampionImages, onGetMatchHistoryError);
          }
          else {
            $scope.checkfile = response;
            $scope.summoner = $scope.checkfile.games.games[0].participantIdentities[0].player;
            angular.forEach($scope.checkfile.games.games, function(match) {
              getChampionImage(match);
              $scope.totalSeconds = $scope.totalSeconds + match.gameDuration;
              $scope.totalGoldEarned = $scope.totalGoldEarned + match.participants[0].stats.goldEarned;
            });
            $scope.haveResults = true;
          }

        };

        var getFirst20Matches = function(response) {
          if (response.matches) {
            var matchList = response.matches;
            for (var i = 0; i < 100; i++) {
              var matchId = response.matches[i].matchId;
              getMatchAndSave(matchId);
            }
          }
        };

        var getMatchAndSave = function(matchId) {
          lolapi.getMatch(matchId).then(function(match) {
            console.log(match);
            getWinningTeamValues(match, $scope.results);
          });
        };

        function getWinningTeamValues(match, results) {
          var winningTeam;
          if (match.teams) {
            if (match.teams[0].winner) {
              winningTeam = match.teams[0];
            } else {
              winningTeam = match.teams[1];
            }
            for (var i in $scope.trueFalseStats) {
              var stat = $scope.trueFalseStats[i];
              if (winningTeam[stat]) {
                if (!results[stat]) {
                  results[stat] = 1;
                } else {
                  results[stat]++;
                }
              }
            }
            $scope.countingStats.forEach(function(stat) {
              if (!results[stat]) {
                results[stat] = winningTeam[stat];
              } else {
                results[stat] += winningTeam[stat];
              }
            });
          }
        }

        var onGetMatchHistoryError = function(error) {
          $scope.errorMessage = "Could not fetch Match History for given summoner.";
        };

        var reportProblems = function(error) {
          console.log(error);
          $scope.errorMessage = "Could not fetch Match History for given summoner.";
        };

        var init = function() {
          if ($stateParams.summonerName) {
            summonerSearch($stateParams.summonerName)
              .then(getMatchHistory)
              .then(getFirst20Matches)
              .catch(reportProblems);
          }
          //lolapi.getAllMatches()
          //  .then(function(valuesReturned) {
          //    console.log(valuesReturned);
          //    //$scope.allResults = valuesReturned;
          //    for ()
          //  });
        };

        $scope.getAllMatches = function() {
          $scope.getAllMatchesResults = {};

          lolapi.getAllMatches()
            .then(function(data) {
              $scope.getAllMatchesResults['matchCount'] = data.length;
              data.forEach(function(match) {
                getWinningTeamValues(match, $scope.getAllMatchesResults);
              });
              for (var datapoint in $scope.getAllMatchesResults) {
                if ($scope.trueFalseStats.indexOf(datapoint) > -1) {
                  $scope.getAllMatchesResults[datapoint] = Math.round($scope.getAllMatchesResults[datapoint] * 100 / $scope.getAllMatchesResults['matchCount']);
                } else if ($scope.countingStats.indexOf(datapoint) > -1) {
                  $scope.getAllMatchesResults[datapoint] = $scope.getAllMatchesResults[datapoint] / $scope.getAllMatchesResults['matchCount'];
                }
              }
            });
        };

        init();
      }
    ]
  );
