angular.module('LeagueViewer')
  .controller('StatisticsCtrl',
    [
      '$scope',
      '$location',
      'lolapi',
      '$stateParams',
      '$state',
      'analyzeMatch',
      '$q',
      function($scope, $location, lolapi, $stateParams, $state, analyzeMatch, $q) {
        $scope.webTitle = "Summoner Information";
        $scope.errorMessage = "";
        $scope.doneProcessing = false;

        $scope.trueFalseStats = ['firstBaron', 'firstBlood', 'firstDragon', 'firstInhibitor', 'firstTower'];
        $scope.countingStats = ['towerKills', 'inhibitorKills', 'baronKills', 'dragonKills'];

        $scope.teamRelevantStats  = ['firstBaron', 'firstBlood', 'firstDragon', 'firstInhibitor', 'firstTower', 'towerKills', 'inhibitorKills', 'baronKills', 'dragonKills'];
        $scope.teamRelevantStatsAggregatedResults   = {};
        $scope.participantRelevantStats = ['visionWardsBoughtInGame', 'wardsPlaced', 'wardsKilled', 'totalTimeCrowdControlDealt', 'neutralMinionsKilledEnemyJungle'];
        $scope.winningParticipantResults = {};
        $scope.losingParticipantResults = {};

        $scope.previousSearchMatchCount;

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

        var getMatches = function(response) {
          var promiseArray = [];
          if (response.matches) {
            for (var i = 0; i < $scope.matchCount; i++) {
              var matchId = response.matches[i].matchId;
              var deferred = $q.defer();

              promiseArray.push(deferred.promise);
              getMatchAndSave(matchId, deferred);
            }
          }
          $q.all(promiseArray).then(function() {
            $scope.doneProcessing = true;
          });
        };

        var getMatchAndSave = function(matchId, promise) {
          lolapi.getMatch(matchId).then(function(match) {
            analyzeAndRecordMatchStatisticsByTeam(match);
            analyzeAndRecordMatchStatisticsByParticipant(match);
            promise.resolve();
          });
        };

        function analyzeAndRecordMatchStatisticsByParticipant(match) {
          analyzeMatch.parseParticipantDataAndUpdateWinnerLoserHash(match, $scope.participantRelevantStats, $scope.winningParticipantResults, $scope.losingParticipantResults);
        }

        function analyzeAndRecordMatchStatisticsByTeam(match) {
          analyzeMatch.parseTeamDataAndUpdateWinnerHash(match, $scope.teamRelevantStats , $scope.teamRelevantStatsAggregatedResults );
        }

        var reportProblems = function(error) {
          console.log(error);
          $scope.errorMessage = "Could not fetch Match History for given summoner.";
        };

        function summonerSearchAndDisplayData(summonerName) {
          $scope.previousSearchMatchCount = $scope.matchCount;
          summonerSearch(summonerName)
            .then(getMatchHistory)
            .then(getMatches)
            .catch(reportProblems);
        }

        function init() {
          $scope.matchCount = $stateParams.matchCount ? $stateParams.matchCount : 40;
          if ($stateParams.summonerName) {
            $scope.summonerName = $stateParams.summonerName;
            summonerSearchAndDisplayData($stateParams.summonerName);
          }
        }

        $scope.summonerSearch = function() {
          $state.go('statistics', {'summonerName': $scope.summonerName, 'matchCount': $scope.matchCount});
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
              console.log($scope.getAllMatchesResults);

            });

        };

        init();
      }
    ]
  );
