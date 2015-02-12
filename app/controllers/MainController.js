(function(){

	var app = angular.module("LeagueViewer");

	var MainController = function($scope, $http, $location, $routeParams, lolapi) {

		$scope.haveResults = false;
		var champName;

		var summonerSearchSuccess = function(response) {
			angular.forEach(response, function(value, key) {
		  		$scope.user = value;
		  		getMatchHistory($scope.user);
			});
		};

		var getMatchHistory = function(summoner) {	
			lolapi.getMatchHistory(summoner.id).then(sumIdRecieved, onError);
		};

		var sumIdRecieved = function(response) {
			$scope.checkfile = response;
			$scope.totalSeconds = 0;
			$scope.totalGoldEarned = 0;
			angular.forEach($scope.checkfile.matches, function(match) {
				getChampImg(match);
		  		$scope.totalSeconds = $scope.totalSeconds + match.matchDuration;
		  		$scope.totalGoldEarned = $scope.totalGoldEarned + match.participants[0].stats.goldEarned;
			});
			$scope.haveResults = true;
		};

		var getChampImg = function(match){
			var promise = lolapi.getChamp(match.participants[0].championId);
			promise.then(
				function(response) {
					match.participants[0].champName = response.name;
					match.participants[0].champImgSrc = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"+ match.participants[0].champName +".png";
				}
			, onError);
		};

		var champRecieved = function(response, match){
			champName = response.name;
		};

		$scope.goTo = function(match){
			$location.path("/match/"+match.matchId);
		};

		var onError = function(reason){
			$scope.error = "Could not fetch summoner information";
		};


		$scope.summonerSearch = function(username){
			lolapi.getSummoner(username).then(summonerSearchSuccess, onError);
		};

		$scope.webTitle = "Summoner Information";		
	};

	app.controller("MainController", MainController);
	
}());
