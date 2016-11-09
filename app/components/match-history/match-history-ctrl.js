angular.module('LeagueViewer')
	.controller('MatchHistoryCtrl',
	[
		'$scope',
		'$location',
		'lolapi',
		'$stateParams',
		'$state',
		function($scope, $location, lolapi, $stateParams, $state) {
			var accountId;

			$scope.haveResults = false;
			$scope.totalSeconds = 0;
			$scope.totalGoldEarned = 0;
			$scope.webTitle = "Summoner Information";
			$scope.errorMessage = "";
			$scope.matches = [];

			$scope.goToMatch = function(match) {
				$state.go('main.match', {'matchId': match.gameId});
			};

			$scope.goToRankedStats = function(summonerName) {
				$state.go('main.ranked-stats', {'summonerName': $stateParams.summonerName});
			};

			var summonerSearch = function(username) {
				return lolapi.getSummonerByName(username).then(function(summonerInfo) {
					return summonerInfo.id;
				});
			};

			var getMatchHistory = function(summonerId) {
				return lolapi.getMatchHistoryBySummonerId(summonerId).then(function(results) {
					return results;
				});
			};

			var getChampionImages = function(response) {
				if (response.httpStatus == "404") {
					//TODO: need to not have this call its own callback
					lolapi.getMatchHistory1(accountId).then(getChampionImages, onGetMatchHistoryError);
				}
				else {
					$scope.checkfile = response;
					$scope.summoner = $scope.checkfile.games.games[0].participantIdentities[0].player;
					angular.forEach($scope.checkfile.games.games, function(match) {
							getChampionImage(match);
							$scope.totalSeconds = $scope.totalSeconds + match.gameDuration;
							$scope.totalGoldEarned = $scope.totalGoldEarned + match.participants[0].stats.goldEarned;
					});
					$scope.haveResults = true;
				}

			};

			var getFirst20Matches = function(response) {
				if (response.matches) {
					var matchList = response.matches;
					for (var i = 0; i < 40; i++) {
						var matchId = response.matches[i].matchId;
						getMatchAndSave(matchId);
					}
				}
			};

			var getMatchAndSave = function(matchId) {
				lolapi.getMatch(matchId).then(function(match) {
					$scope.matches.push(match);
					$scope.haveResults = true;
				});
			};

			var getChampionImage = function(match) {
				lolapi.getChamp(match.participants[0].championId).then(
					function(response) {
						match.participants[0].champName = response.name;
						match.participants[0].champImgSrc = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"+ match.participants[0].champName +".png";
					},
				  onGetChampionImageError
			  );
			};

			var onGetChampionImageError = function(reason){
				$scope.errorMessage = 'Could not get Champion Image';
			};

			var onGetMatchHistoryError = function(error) {
				$scope.errorMessage = "Could not fetch Match History for given summoner.";
			};

			var reportProblems = function(error) {
				console.log(error);
				$scope.errorMessage = "Could not fetch Match History for given summoner.";
			};

			var init = function() {
				if ($stateParams.summonerName) {
					summonerSearch($stateParams.summonerName)
							.then(getMatchHistory)
							.then(getFirst20Matches)
							.catch(reportProblems);
				}
			};

			init();
		}
	]
);
