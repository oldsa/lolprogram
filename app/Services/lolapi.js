(function() {

  var lolapi = function($http) {
    var apiKey = "1a417329-8a55-43cb-9262-928bff0ccec9";

    var getSummoner = function(summonerName) {
      return $http.get("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + summonerName + "?api_key=" + apiKey)
        .then(function(response) {
          return response.data;
        });
    };

    var getMatchHistory = function(summonerId){
      return $http.get("https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + summonerId + "?api_key=" + apiKey)
        .then(function(response){
          return response.data;
        });
    };

    var getMatch = function(matchId){
        return $http.get("https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchId + "?api_key=" + apiKey)
          .then(function(response){
            return response.data;
          });
    };

    var getChamp = function(championId){
        return $http.get("https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + championId + "?api_key=" + apiKey)
          .then(function(response){
            return response.data;
        });
    };

    var getRankedStats = function(championId) {
        return $http.get("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/" + championId + "/ranked?api_key=" + apiKey)
          .then(function(response){
            return response.data;
        });
    };

    return {
      getSummoner : getSummoner,
      getMatchHistory : getMatchHistory,
      getMatch : getMatch,
      getChamp : getChamp
    };
  };

  var module = angular.module("LeagueViewer");
  module.factory("lolapi", lolapi);
  
}());