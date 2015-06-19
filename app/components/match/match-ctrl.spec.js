describe('Controller: MatchController', function() {
  var scope;

  beforeEach(module('LeagueViewer'));

  beforeEach(inject(function (_$controller_,
                              _$rootScope_) {

    scope = _$rootScope_.$new();

    MatchController = _$controller_('MatchController', {
      $scope: scope
    });

  }));

  it('should run as true', function() {
    expect(true);
  });

  //TODO: write tests

});