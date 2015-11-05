angular.module('LeagueViewer')
	.controller('MatchHistoryCtrl',
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
			$scope.sumID = "";

			$scope.summonerSearch = function(summonerName) {
				$location.path('/matchHistory/'+  summonerName);
			};

			$scope.goTo = function(match) {
				$location.path('/match/'+  match.gameId);
			};

			var summonerSearch = function(username) {
				//summonerName = username;
				//$location.path('/matchHistory/'+  username);
				lolapi.getSummoner(username).then(summonerSearchSuccess, onGetSummonerSearchError);
			};

			var onGetSummonerSearchError = function(error) {
				$scope.errorMessage = "Could not fetch Match History for given summoner.";
			};

			var summonerSearchSuccess = function(response) {
				//$scope.summoner = response[summonerName];
				//$location.path('/matchHistory/'+  summonerInfo.id);
				$scope.sumID = response.accountId;
				getMatchHistory(response.accountId);
			};

			var getMatchHistory = function(summonerId) {	
				lolapi.getMatchHistory(summonerId).then(onGetMatchHistorySuccess, onGetMatchHistoryError);
			};

			var onGetMatchHistorySuccess = function(response) {
				if (response.httpStatus == "404") {
					lolapi.getMatchHistory1($scope.sumID).then(onGetMatchHistorySuccess, onGetMatchHistoryError);
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

			var getChampionImage = function(match){
				var promise = lolapi.getChamp(match.participants[0].championId);
				promise.then(
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

			summonerSearch($routeParams.summonerName);
		}
	]
);
