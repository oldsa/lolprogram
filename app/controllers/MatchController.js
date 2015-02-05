(function(){

var app = angular.module("LeagueViewer");

var MatchController = function($scope, $http, $location) {
	$scope.test ="matchController Working";
};

app.controller("MatchController", MatchController);

}());

