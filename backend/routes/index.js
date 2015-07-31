var express = require('express');
var router = express.Router();
var http = require('http');

var https = require('https');

var apiKey = '1a417329-8a55-43cb-9262-928bff0ccec9';
var baseUrl = 'https://na.api.pvp.net/api/lol/';

var queries = "?begIndex=0&endIndex=20&queue=0&queue=2&queue=4&queue=6&queue=7&queue=8&queue=9&queue=14&queue=16&queue=17&queue=25&queue=31&queue=32&queue=33&queue=41&queue=42&queue=52&queue=61&queue=65&queue=70&queue=73&queue=76&queue=78&queue=83&queue=91&queue=92&queue=93&queue=96&queue=98&queue=300";

/* GET home page. */

router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8010');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//GET SUMMONER
router.get('/summoner/:summonerName', function(req, res, next) {
	https.get(baseUrl + 'na/v1.4/summoner/by-name/' + req.params.summonerName + '?api_key=' + apiKey, function(response) {
    
		response.on('data', function(data) {
		  res.send(data);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

router.get('/summoner2/:summonerName', function(req, res, next) {
	https.get("https://acs.leagueoflegends.com/v1/players?name=" + req.params.summonerName + "&region=NA" , function (response) {
		response.on('data', function(data) {
			res.send(data);
		});
	}).on('error', function(e) {
		console.error(e);
	});
});

//https://acs.leagueoflegends.com/v1/stats/player_history/NA/36526632
router.get('/summoner2/:summonerId/matchHistory', function(req, res, next) {
	var res1 = '';
	https.get("https://acs.leagueoflegends.com/v1/stats/player_history/NA/" + req.params.summonerId + queries, function(response) { 
		response.on('data', function(chunk) {
		  res1 += chunk;
		});

		response.on('end', function() {
			//saveData(res1);
			res.send(res1);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

router.get('/summoner3/:summonerId/matchHistory', function(req, res, next) {
	var res1 = '';
	https.get("https://acs.leagueoflegends.com/v1/stats/player_history/NA1/" + req.params.summonerId + queries, function(response) { 
		response.on('data', function(chunk) {
		  res1 += chunk;
		});

		response.on('end', function() {
			//saveData(res1);
			res.send(res1);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

//GET MATCH-HISTORY
router.get('/summoner/:summonerId/matchHistory', function(req, res, next) {
	var res1 = '';
	https.get(baseUrl + "na/v2.2/matchhistory/" + req.params.summonerId + "?api_key=" + apiKey, function(response) {
    
		response.on('data', function(chunk) {
		  res1 += chunk;
		});

		response.on('end', function() {
			saveData(res1);
			res.send(res1);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

// GET MATCH
router.get('/match/:matchId', function(req, res, next) {
	var res1 = '';
	https.get(baseUrl + "na/v2.2/match/" + req.params.matchId + "?api_key=" + apiKey, function(response) {
    
		response.on('data', function(chunk) {
		  res1 += chunk;
		});

		response.on('end', function() {
			res.send(res1);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

//GET CHAMPION
router.get('/champion/:championId', function(req, res, next) {
	var res1 = '';
	https.get(baseUrl + "static-data/na/v1.2/champion/" + req.params.championId + "?api_key=" + apiKey, function(response) {
    
		response.on('data', function(chunk) {
		  res1 += chunk;
		});

		response.on('end', function() {
			res.send(res1);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

//GET CHAMPION RANKED STATS
router.get('/champion/:championId/rankedStats', function(req, res, next) {
	var res1 = '';
	https.get(baseUrl + "na/v2.2/match/" + req.params.championId + "?api_key=" + apiKey, function(response) {
    
		response.on('data', function(chunk) {
		  res1 += chunk;
		});

		response.on('end', function() {
			res.send(res1);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

var saveData = function(saveDataSchema, saveData) {
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		// yay!
		var kittySchema = mongoose.Schema({
		    name: String,
	    	test: String
		});

		var Kitten = mongoose.model('Kitten', kittySchema);

		var silence = new Kitten({ name: 'Silence' });
		console.log(silence.name);

		var Kitten = mongoose.model('Kitten', kittySchema);

		var fluffy = new Kitten({ 
			name: 'fluffy',
			test: 'test' 
		});
		//fluffy.speak(); // "Meow name is fluffy"

		fluffy.save(function (err, fluffy) {	
		  if (err) return console.error(err);
		  //fluffy.speak();
		});

		Kitten.find(function (err, kittens) {
		  if (err) return console.error(err);
		  console.log(kittens);
		})
		Kitten.find({ name: /^Fluff/ }, callback);
	});
}

module.exports = router;

