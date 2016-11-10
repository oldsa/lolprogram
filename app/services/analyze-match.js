angular.module('LeagueViewer').factory('analyzeMatch', function($http) {

  function parseParticipantDataAndUpdateWinnerLoserHash(match, arrayOfStats, winnerHash, loserHash) {
    var matchParticipants = match.participants;
    matchParticipants.forEach(function(participant) {
      //SELECT WINNING / LOSING HASH based on participantId
      var currentParticipantHash = participant.participantId <= 5 ? loserHash : winnerHash;
      arrayOfStats.forEach(function (stat) {
        if (currentParticipantHash[stat]) {
          currentParticipantHash[stat] += participant.stats[stat];
        } else {
          currentParticipantHash[stat] = participant.stats[stat];
        }
      });
    });
  }

  function parseTeamDataAndUpdateWinnerHash(match, arrayOfStats, winningTeamHash) {
    var winningTeam, losingTeam;
    if (match.teams[0].winner) {
      winningTeam = match.teams[0];
      losingTeam = match.teams[1];
    } else {
      winningTeam = match.teams[1];
      losingTeam = match.teams[0];
    }

    arrayOfStats.forEach(function(stat) {
      if (winningTeamHash[stat]) {
        winningTeamHash[stat] += Number(winningTeam[stat]);
      } else {
        winningTeamHash[stat] = Number(winningTeam[stat]);
      }
    });
  }

  return {
    parseParticipantDataAndUpdateWinnerLoserHash : parseParticipantDataAndUpdateWinnerLoserHash,
    parseTeamDataAndUpdateWinnerHash: parseTeamDataAndUpdateWinnerHash
  };
});
