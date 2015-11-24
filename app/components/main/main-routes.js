(function () {
  'use strict';

  angular.module('LeagueViewer')
    .config(function ($stateProvider) {
      $stateProvider
          .state('main', {
              url: '/main',
              templateUrl: 'app/components/main/main.html',
              controller: 'MainController'
              // resolve: {
              //   userObj: function(Auth) {
              //       return Auth.getCurrentUser().$promise;
              //  }
              // }
          });
  });


}());
