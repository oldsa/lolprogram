var app = angular.module("LeagueViewer");

angular.module("LeagueViewer").factory("lolapi", function($http) {
  var baseUrl = "http://localhost:3000/";

  var getSummoner = function(summonerName) {
    return $http.get(baseUrl + 'summoner2/' + summonerName)
      .then(function(response) {
        return response.data;
      });
  };

  var getMatchHistory = function(summonerId) {
    return $http.get(baseUrl + 'summoner2/' + summonerId + '/matchHistory')
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

  var getRankedStats = function(championId) {
    return $http.get(baseUrl + "champion/" + championId)
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
