angular.module('homeModule')
.controller('homeCtrl', function ($scope, queryAPI, $ionicSideMenuDelegate) {

  $ionicSideMenuDelegate.canDragContent(true);

  queryAPI.getDayToday()
  .then(function(data) {
    if (data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.days = daysObject;
        queryAPI.setDayColors();
      });
    } else {
      console.log(data.status.code);
    }
  }, function (status) {
    console.log(status);
  });
});
