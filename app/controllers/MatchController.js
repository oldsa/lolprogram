(function(){

var app = angular.module("LeagueViewer");

var MatchController = function($scope, $http, $location, lolapi) {
	$scope.sortOrder ="name";
	$scope.match= lolapi.getMatch();
};
 
app.controller("MatchController", MatchController);

}());

