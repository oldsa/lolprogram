angular.module('LeagueViewer')
	.controller('MainController',
	[
		'$scope',
		'$location',
		'lolapi',
		'$state',
		function($scope, $location, lolapi, $state) {
			$scope.summonerSearch = function(summonerName) {
				$state.go('statistics', {'summonerName': summonerName});
			};
		}
	]
);