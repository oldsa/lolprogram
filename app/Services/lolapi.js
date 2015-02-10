(function() {

  var lolapi = function($http) {


    var getSummoner = function(username) {

      return $http.get("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+username+"?api_key=1a417329-8a55-43cb-9262-928bff0ccec9")
        .then(function(response) {
          return response.data;
        });

    };

    var getMatchHistory = function(id){
      return $http.get("https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + id + "?api_key=1a417329-8a55-43cb-9262-928bff0ccec9")
        .then(function(response){
          return response.data;
        });
    };

    var getMatch = function(matchId){
        return $http.get("https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchId + "?api_key=1a417329-8a55-43cb-9262-928bff0ccec9")
          .then(function(response){
            return response.data;
          });

    };


    return {
      getSummoner : getSummoner,
      getMatchHistory : getMatchHistory,
      getMatch : getMatch
    };
  };

  var module = angular.module("LeagueViewer");
  module.factory("lolapi", lolapi);
  
}());