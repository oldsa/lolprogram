(function(){

var app = angular.module("LeagueViewer");

var MatchController = function($scope, $http, $location, lolapi, $routeParams) {
	
	var sumMatchRecieved = function(response){
		$scope.match= response;
	};

	var onError = function(reason){
		$scope.error = "Could not fetch match information";
	};

	$scope.sortOrder ="-stats.kills";
	$scope.matchId = $routeParams.matchId;
	lolapi.getMatch($scope.matchId).then(sumMatchRecieved, onError);
};
 
app.controller("MatchController", MatchController);

}());

