angular.module('homeModule')
.controller('homeCtrl', function($scope, queryAPI) {
  queryAPI.getDayToday().then(function(data) {
    $scope.days = queryAPI.cleanDay(data.days);
  });
});
