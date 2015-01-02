angular.module('favoritesModule')
.controller('favoritesCtrl', function ($scope, queryAPI, $rootScope) {

  if ($rootScope.userData.pc_days.length) {

    queryAPI.getDayById($rootScope.userData.pc_days)
    .then(function(data) {
      if (data.status.code === 100) {
        queryAPI.cleanDay(data.result)
        .then(function (daysObject) {
          $scope.days = daysObject;
//          queryAPI.setDayColors();
        });
      } else {
        console.log('Error retrieving DaysById: ' +data.status.code);
      }
    }, function (status) {
      console.log(status);
    });
  }

});


