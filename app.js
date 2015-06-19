(function(){
  
  var app = angular.module("LeagueViewer", ["ngRoute"]);
  
  app.config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "app/components/main/main.html",
        controller: "MainController"
      })
      .when("/main", {
        templateUrl: "app/components/main/main.html",
        controller: "MainController"
      })
      .when("/matchHistory/:summonerName", {
        templateUrl: "app/components/match-history/match-history.html",
        controller: "MatchHistoryCtrl"
      })
      .when("/match/:matchId", {
        templateUrl: "app/components/match/match.html",
        controller: "MatchController"
      })
      .when("/rankedstats", {
        templateUrl: "app/components/main/main.html",
        controller: "MainController"
      });
      //.otherwise({redirectTo:"/main"});  
  });
  
}());