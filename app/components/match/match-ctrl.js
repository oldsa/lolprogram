angular.module("LeagueViewer")
	.controller('MatchController',
	[
		'$scope',
		'$http',
		'$location',
		'lolapi',
		'$stateParams',
		function($scope, $http, $location, lolapi, $stateParams) {
			$scope.championImageMap = {};
			$scope.orderProp = '-stat.kills';

			var setChampionImageUrl = function(participant) {
				var championName = '';
				for (var key in $scope.championImageMap) {
					if ($scope.championImageMap[key].id == participant.championId) {
						championName = key;
					}
				}
				participant.championUrl = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"+ championName +".png";
			};

			var init = function() {
				getChampionImages();
				getMatchById($stateParams.matchId)
						.then(summonerMatchReceived)
						.catch(onError);
			};

			var getChampionImages = function() {
				return $http.get('app/assets/data/champions.json')
										.success(function(data) {
											$scope.championImageMap = data.data;
										})
										.error(onError);
			};

			var getMatchById = function(matchId) {
				return lolapi.getMatch(matchId).then(function(matchInfo) {
					return matchInfo;
				});
			};

			var summonerMatchReceived = function(matchInfo) {
				$scope.match = matchInfo;
				for (var i = 0; i < $scope.match.participants.length; i++) {
					$scope.match.participants[i].summonerName = $scope.match.participantIdentities[i].player.summonerName;
					setChampionImageUrl($scope.match.participants[i]);
					if ($scope.match.participants[i].teamId === 100) {
						$scope.match.participants[i].teamStyle = 'blue-team';
					}
					else {
						$scope.match.participants[i].teamStyle = 'red-team';
					}
				}
			};

			var onError = function(error) {
				$scope.error = "Could not fetch match information";
			};

			init();
		}
	]
);