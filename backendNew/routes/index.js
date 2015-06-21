var express = require('express');
var router = express.Router();
var http = require('http');

var https = require('https');

var apiKey = '1a417329-8a55-43cb-9262-928bff0ccec9';
var baseUrl = 'https://na.api.pvp.net/api/lol/';

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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  http.get("http://www.google.com/index.html", function(res1) {
	  res.send("Got response: " + res1.statusCode);
	}).on('error', function(e) {
	 	res.send("Got error: " + e.message);
	});
});

router.get('/summoner/:summonerName', function(req, res, next) {
	https.get(baseUrl + 'na/v1.4/summoner/by-name/' + req.params.summonerName + '?api_key=' + apiKey, function(response) {
    
		response.on('data', function(data) {
		  res.send(data);
		});

	}).on('error', function(e) {
		console.error(e);
	});
});

router.get('/summoner/:summonerId/matchHistory', function(req, res, next) {
	var res1 = '';
	https.get(baseUrl + "na/v2.2/matchhistory/" + req.params.summonerId + "?api_key=" + apiKey, function(response) {
    
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

router.get('/champion/:championId', function(req, res, next) {
	var res1 = '';
	https.get(baseUrl + "static-data/na/v1.2/champion/" + req.params.champId + "?api_key=" + apiKey, function(response) {
    
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

module.exports = router;

