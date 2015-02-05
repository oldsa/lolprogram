(function(){
  
  var app = angular.module("LeagueViewer", ["ngRoute"]);
  
  app.config(function($routeProvider){
    $routeProvider
      .when("/main", {
        templateUrl: "main.html",
        controller: "MainController"
      })
      .when("/match/:matchId", {
        templateUrl: "match.html",
        controller: "MatchController"
      })
      .otherwise({redirectTo:"/main"});
    
  });
  
}());