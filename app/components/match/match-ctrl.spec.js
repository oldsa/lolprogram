describe('Controller: MatchController', function() {
  var scope;

  beforeEach(module('LeagueViewer'));

  beforeEach(inject(function (_$controller_,
                              _$rootScope_) {

    scope = _$rootScope_.$new();

    scope.championImageMap = {
      "Ahri" : { 
        "id" : 103,
        "key" : "Ahri",
        "name" : "Ahri",
        "title" : "the Nine-Tailed Fox"
      }
    };

    MatchController = _$controller_('MatchController', {
      $scope: scope
    });

  }));

  it('should run as true', function() {
    expect(true);
  });

  it('should set championImageUrl on setChampionImage', function() {
    var champion = {
      'championId': 103,
      championUrl: ''
    };
    expect(champion.championUrl).toBe('');
    scope.setChampionImageUrl(champion);
    expect(champion.championUrl).toBe('http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/Ahri.png');
  });
  //TODO: write tests

});