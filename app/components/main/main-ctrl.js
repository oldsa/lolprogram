angular.module('LeagueViewer')
	.controller('MainController',
	[
		'$scope',
		'$location',
		'$routeParams',
		'lolapi', 
		function($scope, $location, $routeParams, lolapi) {
			$scope.summonerSearch = function(summonerName) {
				$location.path('/matchHistory/'+  summonerName);
			};
		}
	]
);
