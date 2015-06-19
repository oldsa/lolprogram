describe('Controller: MainController', function() {

  var scope;
  var $location;

  beforeEach(module('LeagueViewer'));

  beforeEach(inject(function (_$controller_,
                              _$rootScope_,
                              _$location_) {

    scope = _$rootScope_.$new();
    $location = _$location_;

    spyOn($location, 'path');

    MainController = _$controller_('MainController', {
      $scope: scope
    });

  }));

  it('should call location.path on summonerSearch', function() {
    expect($location.path).not.toHaveBeenCalled();
    scope.summonerSearch('testName');
    expect($location.path).toHaveBeenCalledWith('/matchHistory/testName');
  });

});