angular.module('LeagueViewer').factory('analyzeMatch', function($http) {

  function parseParticipantDataAndUpdateWinnerLoserHash(match, arrayOfStats, winnerHash, loserHash) {
    var matchParticipants = match.participants;
    matchParticipants.forEach(function(participant) {
      //SELECT WINNING / LOSING HASH based on participantId
      var currentParticipantHash = participant.participantId <= 5 ? loserHash : winnerHash;
      incrementOrAssignHashValue(arrayOfStats, currentParticipantHash, participant.stats);
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

    incrementOrAssignHashValue(arrayOfStats, winningTeamHash, winningTeam);
  }

  function parseIndividualDataAndUpdateIndividualHash(match, summonerId, arrayOfStats, individualHash) {
    var participantId;
    var participantData;
    match.participantIdentities.forEach(function(participant) {
      if (participant.player.summonerId === summonerId) {
        participantId = participant.participantId;
      }
    });
    if (!participantId) {
    }

    participantData = match.participants[participantId - 1].stats;
    incrementOrAssignHashValue(arrayOfStats, individualHash, participantData);
  }

  function incrementOrAssignHashValue(arrayOfStats, dataHash, currentMatchStats) {
    arrayOfStats.forEach(function(stat) {
      if (currentMatchStats['firstBloodAssist']) {
        console.log('first blood assist');
      }
      if (dataHash[stat]) {
        dataHash[stat] += Number(currentMatchStats[stat] || null);
      } else {
        dataHash[stat] = Number(currentMatchStats[stat] || null);
      }
    });
  }

  return {
    parseParticipantDataAndUpdateWinnerLoserHash : parseParticipantDataAndUpdateWinnerLoserHash,
    parseTeamDataAndUpdateWinnerHash: parseTeamDataAndUpdateWinnerHash,
    parseIndividualDataAndUpdateIndividualHash: parseIndividualDataAndUpdateIndividualHash
  };
});
