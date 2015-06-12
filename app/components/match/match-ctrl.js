angular.module("LeagueViewer")
	.controller('MatchController',
	[
		'$scope',
		'$http',
		'$location',
		'lolapi',
		'$routeParams',		
		function($scope, $http, $location, lolapi, $routeParams) {
			$scope.championImageMap = {};
			$scope.orderProp = '-stat.kills';

			var summonerMatchRecieved = function(matchInfo) {
				$scope.match = matchInfo;
				for (var i = 0; i < $scope.match.participants.length; i++) {
					$scope.match.participants[i].summonerName = $scope.match.participantIdentities[i].player.summonerName;
					$scope.getChampionImage($scope.match.participants[i]);
					if ($scope.match.participants[i].teamId === 100) {
						$scope.match.participants[i].teamColor = 'blue';
					}
					else {
						$scope.match.participants[i].teamColor = 'red';
					}
				}
				console.log('test');
			};

			$http.get('app/config/champions.json').
			  success(function(data, status, headers, config) {
			  	$scope.championImageMap = data.data;
			  }).
			  error(function(data, status, headers, config) {
			  	console.log('could not get champions.json');
			  });

			$scope.getChampionImage = function(participant) {
				var championName = '';
				for (var key in $scope.championImageMap) {
					if ($scope.championImageMap[key].id == participant.championId) {
						championName = key;
					}
				}
				participant.championUrl = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"+ championName +".png";
			};

			var onError = function(error) {
				$scope.error = "Could not fetch match information";
			};

			lolapi.getMatch($routeParams.matchId).then(summonerMatchRecieved, onError);
		}
	]
);