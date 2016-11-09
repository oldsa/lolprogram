var app = angular.module("LeagueViewer");

angular.module("LeagueViewer").factory("lolapi", function($http) {
  var baseUrl = "http://localhost:3000/";

  var getSummonerByName = function(summonerName) {
    return $http.get(baseUrl + 'summoner/' + summonerName)
      .then(function(response) {
        return response.data;
      });
  };

  var getSummoner = function(summonerName) {
    return $http.get(baseUrl + 'summoner2/' + summonerName)
      .then(function(response) {
        return response.data;
      });
  };

  var getMatchHistoryBySummonerId = function(summonerId) {
    return $http.get(baseUrl + 'summoner/' + summonerId + '/matchHistory')
      .then(function(response) {
        return response.data;
      });
  };

  var getMatchHistory1 = function(summonerId) {
    return $http.get(baseUrl + 'summoner3/' + summonerId + '/matchHistory')
      .then(function(response) {
        return response.data;
      });
  };

  var getMatch = function(matchId) {
    return $http.get(baseUrl + 'match/' + matchId)
      .then(function(response) {
        return response.data;
      });
  };

  var getChamp = function(championId) {
    return $http.get(baseUrl + "champion/" + championId )
      .then(function(response) {
        return response.data;
    });
  };

  var getRankedInfo = function(summonerId) {
    return $http.get(baseUrl + "summoner/"  + summonerId + '/rankedStats')
      .then(function(response) {
        return response.data;
      });
  };

  var getAllMatches = function() {
    return $http.get(baseUrl + 'match')
      .then(function(response) {
        return response.data;
      })
  };

  return {
    getSummoner : getSummoner,
    getSummonerByName : getSummonerByName,
    getMatchHistoryBySummonerId: getMatchHistoryBySummonerId,
    getMatchHistory1 : getMatchHistory1,
    getMatch : getMatch,
    getChamp : getChamp,
    getRankedInfo: getRankedInfo,
    getAllMatches: getAllMatches
  };
});
