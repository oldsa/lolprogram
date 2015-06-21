var app = angular.module("LeagueViewer");

angular.module("LeagueViewer").factory("lolapi", function($http) {
  var apiKey = "1a417329-8a55-43cb-9262-928bff0ccec9";
  var baseUrl = "http://localhost:3000/";

  var getSummoner = function(summonerName) {
    return $http.get('http://localhost:3000/summoner/' + summonerName)
      .then(function(response) {
        return response.data;
      });
  };

  var getMatchHistory = function(summonerId) {
    return $http.get('http://localhost:3000/summoner/' + summonerId + '/matchHistory')
      .then(function(response) {
        return response.data;
      });
  };

  var getMatch = function(matchId) {
    return $http.get('http://localhost:3000/match/' + matchId)
      .then(function(response) {
        return response.data;
      });
  };

  var getChamp = function(championId) {
    return $http.get(baseUrl + "champion" + championId )
      .then(function(response) {
        return response.data;
    });
  };

  var getRankedStats = function(championId) {
    return $http.get(baseUrl + "champion" + championId)
      .then(function(response) {
        return response.data;
    });
  };

  return {
    getSummoner : getSummoner,
    getMatchHistory : getMatchHistory,
    getMatch : getMatch,
    getChamp : getChamp
  };
});
