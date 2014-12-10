angular.module('homeModule')
.controller('homeCtrl', function($scope, queryAPI) {
  queryAPI.getDayToday()
  .then(function(data) {
    queryAPI.cleanDay(data.days)
    .then(function (daysObject) {
      $scope.days = daysObject;
      queryAPI.setDayColors();
    });
  }, function (status) {
    console.log(status);
  });
});
