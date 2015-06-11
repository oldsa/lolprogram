(function(){
  
  var app = angular.module("LeagueViewer", ["ngRoute"]);
  
  app.config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "app/main/main.html",
        controller: "MainController"
      })
      .when("/main", {
        templateUrl: "app/main/main.html",
        controller: "MainController"
      })
      .when("/match/:matchId", {
        templateUrl: "app/match/match.html",
        controller: "MatchController"
      })
      .when("/rankedstats", {
        templateUrl: "app/main/main.html",
        controller: "MainController"
      });
      //.otherwise({redirectTo:"/main"});  
  });
  
}());