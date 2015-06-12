angular.module('LeagueViewer')
	.controller('MainController',
	[
		'$scope',
		'$location',
		'$routeParams',
		'lolapi', 
		function($scope, $location, $routeParams, lolapi) {

			$scope.haveResults = false;
			$scope.totalSeconds = 0;
			$scope.totalGoldEarned = 0;
			$scope.webTitle = "Summoner Information";		
			$scope.errorMessage = "";

			var summonerName;

			$scope.summonerSearch = function(username) {
				summonerName = username;
				lolapi.getSummoner(username).then(summonerSearchSuccess, onGetSummonerSearchError);
			};

			var onGetSummonerSearchError = function(error) {
				$scope.errorMessage = "Could not fetch Match History for given summoner.";
			};

			var summonerSearchSuccess = function(response) {
				var summonerInfo = response[summonerName];
				$location.path('/matchHistory/'+  summonerInfo.id);
			};
		}
	]
);
