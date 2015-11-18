var routerApp = angular.module('LeagueViewer', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('main', {
      url: '/home',
      templateUrl: 'app/components/main/main.html',
      controller: 'MainController'
    })
    .state('main.matchHistory', {
      url: '/match-history/:summonerName',
      templateUrl: 'app/components/match-history/match-history.html',
      controller: 'MatchHistoryCtrl'
    })
    .state('main.match', {
      url: '/match/:matchId',
      templateUrl: 'app/components/match/match.html',
      controller: 'MatchController'
    });
});