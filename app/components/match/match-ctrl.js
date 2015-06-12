angular.module("LeagueViewer")
	.controller('MatchController',
	[
		'$scope',
		'$http',
		'$location',
		'lolapi',
		'$routeParams',		
		function($scope, $http, $location, lolapi, $routeParams) {
			
			var summonerMatchRecieved = function(matchInfo) {
				$scope.match = matchInfo;
				for (var i = 0; i < $scope.match.participantIdentities.length; i++) {
					$scope.match.participants[i].summonerName = $scope.match.participantIdentities[i].player.summonerName;
				}
			};

			var onError = function(error) {
				$scope.error = "Could not fetch match information";
			};

			lolapi.getMatch($routeParams.matchId).then(summonerMatchRecieved, onError);
		}
	]
);