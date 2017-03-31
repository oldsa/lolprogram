var express = require('express');
var https = require('https');
var Promise = require('promise');

var router = express.Router();

const mongoDbName = 'test';
const mongoClient = require('mongodb').MongoClient;

var baseUrl = 'https://na.api.pvp.net/api/lol';
var region = 'na';

var apiKeys = [
  '97cb5a96-660c-40f6-aee5-59c80b50beaf', //smokensleep
  '593a8b66-8b3f-4900-99ca-f3c3a7b37229', //BIGLUIE
  '1a417329-8a55-43cb-9262-928bff0ccec9', //tbroner
  'RGAPI-d69ec951-e1a4-4d1c-aab0-78378cd3e745', //mybigfatashe
  'RGAPI-c2943d92-072d-449c-a426-8b56dc524a32', //bbotts
  '8ffb0850-f422-4a36-acf2-b6905253c81e', //bbottles
];

var dbConnection;
var rateLimitCount = 0;
var apiRequestCount = generateRandomNumber(0, apiKeys.length - 1);

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

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
router.get('/summoner/:summonerName', function(req, res) {
  console.log('GET SUMMONER HIT!');
  var summonerName = req.params.summonerName;
  var requestUrl = `${baseUrl}/${region}/v1.4/summoner/by-name/${summonerName}?api_key=${returnApiKey()}`;

  var mongoQueryData = {
    collectionName: 'summoners',
    key: 'name',
    value: summonerName
  };

  obtainData(requestUrl, mongoQueryData, res);
});

//GET MATCH-HISTORY
router.get('/summoner/:summonerId/matchHistory', function(req, res, next) {
  var res1 = '';
  //var requestUrl = `this is a test`;
  var requestUrl = `${baseUrl}/${region}/v2.2/matchlist/by-summoner/${req.params.summonerId}?api_key=${returnApiKey()}`;
  console.log(`query parameter season: ${req.query.season}`);
  https.get(requestUrl, function(response) {
    response.on('data', function(chunk) {
      res1 += chunk;
    });

    response.on('end', function() {
      var jsonResponse = JSON.parse(res1);
      if (jsonResponse.status) {
        res.status(429);
        res.send('Rate limit exceeded');
      } else {
        if (req.query.season) {
          filterMatchHistoryBySeason(jsonResponse, req.query);
        }
        res.send(JSON.stringify(jsonResponse));
        rateLimitCount = 0;
      }
    });

  });
  //.on('error', function(e) {
  //  console.error(e);
  //});
});

// GET MATCH
router.get('/match/:matchId', function(req, res) {
  var matchId = req.params.matchId;
  var requestUrl = `${baseUrl}/${region}/v2.2/match/${matchId}?api_key=${returnApiKey()}`;

  var mongoQueryData = {
    collectionName: 'matches',
    key: 'matchId',
    value: matchId
  };

  obtainData(requestUrl, mongoQueryData, res);
});

// GET ALL MATCHES
router.get('/match', function(req, res) {
  var mongoCollectionName = 'matches';

  getAllDataFromCollection(mongoCollectionName).then(function(results) {
    res.send(results);
  });
});

function makeRiotRequest(requestUrl, mongoQueryData, res) {
  var responseData = '';

  https.get(requestUrl, function(response) {
    response.on('data', function(data) {
      responseData += data;
    });

    response.on('end', function() {
      responseData = JSON.parse(responseData);

      //Check for 429 Rate Limit Exceeded league
      if (responseData.status) {
        rateLimitCount = rateLimitCount + 1;
        console.log('**********RATE LIMIT COUNT: ' + rateLimitCount + '***********');
        res.status(429)
        res.send('Rate limit exceeded');
      } else {
        if (mongoQueryData.collectionName === 'summoners') {
          responseData = responseData[mongoQueryData.value];
        }
        insertRequestDataIntoMongo(mongoQueryData.collectionName, responseData).then(function() {
          res.send(responseData);
        });
      }
    });

  }).on('error', function(e) {
    console.log(e);
  });
}

function obtainData(requestUrl, mongoQueryData, res) {
  queryMongoWithQueryData(mongoQueryData).then(function(mongoData) {
    if (mongoData) {
      res.send(mongoData);
    } else {
      makeRiotRequest(requestUrl, mongoQueryData, res);
    }
  }).catch(function(err) {
    console.log('returned an error: ' + err);
  });
}

function init() {
  connectToMongo("mongodb://localhost:27017/" + mongoDbName).then(function(db) {
    console.log('connected to db!');
    dbConnection = db;
  }).catch(function(err) {
    console.log('had an error :(: ' + err);
  });
}

function connectToMongo(connectionUrl) {
  return new Promise(function (fulfill, reject) {
    mongoClient.connect(connectionUrl, function(err, db) {
      if (!err) {
        fulfill(db);
      } else {
        console.log('CONNECT FAIL');
        reject(err);
      }
    });
  });
}

function queryMongoWithQueryData(mongoQueryData) {
  var mongoQueryObject = createMongoQueryObject(mongoQueryData);

  return new Promise(function(fulfill, reject) {
    var collection = dbConnection.collection(mongoQueryData.collectionName);
    collection.findOne(mongoQueryObject, function(err, doc) {
      if (err) {
        console.log('QUERY ERROR: ' + err);
        reject(err);
      } else {
        fulfill(doc);
      }
    });
  })
}

function createMongoQueryObject(mongoQueryData) {
  var searchObject = {};
  if (mongoQueryData.collectionName === 'summoners') {
    searchObject[mongoQueryData.key] = {
      '$regex': mongoQueryData.value,
      '$options': 'i'
    }
  } else {
    searchObject[mongoQueryData.key] = mongoQueryData.value;
  }
  return searchObject;
}

function insertRequestDataIntoMongo(mongoCollectionName, value) {
  return new Promise(function(fulfill, reject) {
    var collection = dbConnection.collection(mongoCollectionName);
    if (value.matchId) {
      value.matchId = value.matchId.toString();
    }
    collection.insert(value, function(err) {
      if (err) {
        console.log('INSERT ERROR: ' + err);
        reject(err);
      } else {
        fulfill();
      }
    });
  });
}

function getAllDataFromCollection(mongoCollectionName) {
  return new Promise(function (fulfill, reject) {
    var collection = dbConnection.collection(mongoCollectionName);
    collection.find().toArray(function(err, items) {
      if (err) {
        reject(err);
      } else {
        fulfill(items);
      }
    });
  });
}

function returnApiKey() {
  var currentApiKey = apiRequestCount++ % apiKeys.length;
  console.log(currentApiKey);
  return apiKeys[currentApiKey];
}

//INPUT: data: MatchHistory JSON Object
//       queryParams: Request's query parmaters
//OUTPUT: filtered MatchHistory Object based on season
function filterMatchHistoryBySeason(data, queryParams) {
  var matchArray = data.matches;
  var filtered = matchArray.filter(filterQueryParams);

  function filterQueryParams(match) {
    return queryParams.season ? match.season === queryParams.season : true;
  }
  data.matches = filtered;
}

init();

module.exports = router;
