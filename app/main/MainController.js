var app = angular.module("LeagueViewer");

var MainController = function($scope, $location, $routeParams, lolapi) {

	$scope.haveResults = false;
	$scope.totalSeconds = 0;
	$scope.totalGoldEarned = 0;
	$scope.webTitle = "Summoner Information";		
	$scope.errorMessage = "";

	var summonerSearchSuccess = function(response) {
		angular.forEach(response, function(value, key) {
	  		$scope.summoner = value;
	  		getMatchHistory($scope.summoner);
		});
	};

	var getMatchHistory = function(summoner) {	
		lolapi.getMatchHistory(summoner.id).then(onGetMatchHistorySuccess, onGetMatchHistoryError);
	};

	var onGetMatchHistorySuccess = function(response) {
		$scope.checkfile = response;
		angular.forEach($scope.checkfile.matches, function(match) {
			getChampionImage(match);
	  		$scope.totalSeconds = $scope.totalSeconds + match.matchDuration;
	  		$scope.totalGoldEarned = $scope.totalGoldEarned + match.participants[0].stats.goldEarned;
		});
		$scope.haveResults = true;
	};

	var getChampionImage = function(match){
		var promise = lolapi.getChamp(match.participants[0].championId);
		promise.then(
			function(response) {
				match.participants[0].champName = response.name;
				match.participants[0].champImgSrc = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"+ match.participants[0].champName +".png";
			}
		, onGetChampionImageError);
	};


	$scope.summonerSearch = function(username){
		lolapi.getSummoner(username).then(summonerSearchSuccess, onGetSummonerSearchError);
	};

	$scope.goTo = function(match) {
		$location.path('/match/'+  match.matchId);
	};

	var onGetChampionImageError = function(reason){
		$scope.errorMessage = 'Could not get Champion Image';
	};

	var onGetMatchHistoryError = function(error) {
		$scope.errorMessage = "Could not fetch Match History for given summoner.";
	};

	var onGetSummonerSearchError = function(error) {
		$scope.errorMessage = "Could not fetch summoner information.";
	};

};

app.controller("MainController", MainController);
