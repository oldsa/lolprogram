(function(){
  
  var app = angular.module("LeagueViewer", ["ngRoute"]);
  
  app.config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "main.html",
        controller: "MainController"
      })
      .when("/main", {
        templateUrl: "main.html",
        controller: "MainController"
      })
      .when("/match/:matchId", {
        templateUrl: "match.html",
        controller: "MatchController"
      })
      .when("/rankedstats", {
        templateUrl: "main.html",
        controller: "MainController"
      });
      //.otherwise({redirectTo:"/main"});  
  });
  
}());