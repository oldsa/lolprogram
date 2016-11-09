angular.module('LeagueViewer')
  .controller('StatisticsCtrl',
    [
      '$scope',
      '$location',
      'lolapi',
      '$stateParams',
      '$state',
      function($scope, $location, lolapi, $stateParams, $state) {
        $scope.haveResults = false;
        $scope.totalSeconds = 0;
        $scope.totalGoldEarned = 0;
        $scope.webTitle = "Summoner Information";
        $scope.errorMessage = "";

        $scope.countingResults = {};
        $scope.trueFalseStats = ['firstBaron', 'firstBlood', 'firstDragon', 'firstInhibitor', 'firstTower'];
        $scope.countingStats = ['towerKills', 'inhibitorKills', 'baronKills', 'dragonKills'];

        $scope.allTeamRelevantStats = ['firstBaron', 'firstBlood', 'firstDragon', 'firstInhibitor', 'firstTower', 'towerKills', 'inhibitorKills', 'baronKills', 'dragonKills'];
        $scope.allTeamRelevantStatsAggregatedResults  = {};

        $scope.participantRelevantStats = ['visionWardsBoughtInGame', 'wardsPlaced', 'wardsKilled', 'totalTimeCrowdControlDealt', 'neutralMinionsKilledEnemyJungle'];
        $scope.winningParticipantResults = {};
        $scope.losingParticipantResults = {};

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
          if (response.matches) {
            for (var i = 0; i < $scope.matchCount; i++) {
              var matchId = response.matches[i].matchId;
              getMatchAndSave(matchId);
            }
          }
        };

        var getMatchAndSave = function(matchId) {
          lolapi.getMatch(matchId).then(function(match) {
            analyzeAndRecordMatchStatisticsByTeam(match);
            analyzeAndRecordMatchStatisticsByParticipant(match);
          });
        };

        function analyzeAndRecordMatchStatisticsByParticipant(match) {
          var matchParticipants = match.participants;
          matchParticipants.forEach(function(participant) {
            if (participant.participantId <= 5) {
              //LOSING TEAM
              $scope.participantRelevantStats.forEach(function(stat) {
                if ($scope.losingParticipantResults[stat]) {
                  $scope.losingParticipantResults[stat] += participant.stats[stat];
                } else {
                  $scope.losingParticipantResults[stat] = participant.stats[stat];
                }
              });
            } else {
              //WINNING TEAM
              $scope.participantRelevantStats.forEach(function(stat) {
                if ($scope.winningParticipantResults[stat]) {
                  $scope.winningParticipantResults[stat] += participant.stats[stat];
                } else {
                  $scope.winningParticipantResults[stat] = participant.stats[stat];
                }
              });
            }
          });
        }

        function analyzeAndRecordMatchStatisticsByTeam(match) {
          var winningTeam, losingTeam;
          if (match.teams[0].winner) {
            winningTeam = match.teams[0];
            losingTeam = match.teams[1];
          } else {
            winningTeam = match.teams[1];
            losingTeam = match.teams[0];
          }

          $scope.allTeamRelevantStats.forEach(function(stat) {
            if ($scope.allTeamRelevantStatsAggregatedResults[stat]) {
              $scope.allTeamRelevantStatsAggregatedResults[stat] += Number(winningTeam[stat]);
            } else {
              $scope.allTeamRelevantStatsAggregatedResults[stat] = Number(winningTeam[stat]);
            }
          });
        }

        var reportProblems = function(error) {
          console.log(error);
          $scope.errorMessage = "Could not fetch Match History for given summoner.";
        };

        function summonerSearchAndDisplayData(summonerName) {
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
