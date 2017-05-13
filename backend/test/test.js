var assert = require('assert');
var server = require('../app');

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var https = require('https');
var should = chai.should();
var expect = chai.expect;
var PassThrough = require('stream').PassThrough;

chai.use(chaiHttp);

describe('LEAGUE API', function() {
  describe('GET SUMMONER', function() {
    beforeEach(function() {
      this.request = sinon.stub(https, 'get');
    });
    afterEach(function() {
      https.get.restore();
    });

    it('should get a summoner by name', function(done) {
      chai.request(server)
        .get('/summoner/bigluie')
        .end(function(err, res) {
          console.log('response is: ' + res);
          res.should.have.status(200);
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('summonerLevel');
          done();
        });


      //chai.request(server)
      //  .get('/summoner/bigluie')
      //  .end(function(err, result) {
      //
      //  });
    });
  });

  describe('GET MATCH HISTORY', function() {
    xit('should make https get request when get match history is called', function(done) {
      sinon.stub(https, 'get', function(url, callback) {
        console.log('this url was called on httpsGet!');
      });

      chai.request(server)
        .get('/summoner/testId/matchHistory')
        .end(function(err, res) {
          sinon.assert.calledOnce(https.get);
          //res.should.have.status(200);
          done();
        });
    });
  });
});