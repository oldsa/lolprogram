
/* Controllers */

var SummonerController = function($scope, $http){

	var sumDataRecieved = function(response){
		angular.forEach(response.data, function(value, key) {
		  $scope.user = value;
		  $scope.error = "";
		  $http.get("https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+value.id+"?api_key=1a417329-8a55-43cb-9262-928bff0ccec9")
		.then(sumIdRecieved, onError);
		});
		
	};

	var sumIdRecieved = function(response){
		$scope.checkfile = response.data;
		$scope.totalSeconds = 0;
		$scope.totalGoldEarned =0;
		angular.forEach($scope.checkfile.matches, function(match) {
		  $scope.totalSeconds = $scope.totalSeconds + match.matchDuration;
		  $scope.totalGoldEarned = $scope.totalGoldEarned + match.participants[0].stats.goldEarned;
		});
	};
	var onError = function(reason){
		$scope.error = "Could not fetch summoner information";
	};

	$scope.search = function(username){
		$http.get("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+username+"?api_key=1a417329-8a55-43cb-9262-928bff0ccec9")
		.then(sumDataRecieved, onError);
	};

	$scope.webTitle = "Summoner Information";		

};

