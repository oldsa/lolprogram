(function(){

	var app = angular.module("LeagueViewer");

var MatchController = function($scope, $http, $location, lolapi, $routeParams) {
	
	var sumMatchRecieved = function(response){
		$scope.match= response;
		for (i = 0; i < $scope.match.participantIdentities.length; i++){
			$scope.match.participants[i].summonerName = $scope.match.participantIdentities[i].player.summonerName;
		}
	};

	var onError = function(reason){
		$scope.error = "Could not fetch match information";
	};

		lolapi.getMatch($scope.matchId).then(sumMatchRecieved, onError);
	};
	 
	app.controller("MatchController", MatchController);

}());

