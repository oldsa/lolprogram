describe('Controller: MatchHistoryCtrl', function() {

  var scope;

  beforeEach(module('LeagueViewer'));

  beforeEach(inject(function (_$controller_,
                              _$rootScope_) {

    scope = _$rootScope_.$new();

    MatchHistoryCtrl = _$controller_('MatchHistoryCtrl', {
      $scope: scope
    });

  }));

  it('should run as true', function() {
    expect(true);
  });

  //TODO: write tests

});