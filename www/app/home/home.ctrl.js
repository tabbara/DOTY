angular.module('homeModule')
.controller('homeCtrl', function ($scope, queryAPI, $ionicSideMenuDelegate, $stateParams) {

  $ionicSideMenuDelegate.canDragContent(true);

  var tempDate = new Date();
  var tempToday = Math.round(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()) / 1000);

  $scope.page = {};
  $scope.page.timestamp = tempToday;
  $scope.page.date = new Date(Math.round($scope.page.timestamp * 1000));
  $scope.page.previous = { timestamp: $scope.page.timestamp - 86400 };
  $scope.page.next = { timestamp: $scope.page.timestamp + 86400 }
  $scope.page.dateName = "Today";

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

//$scope.page.dateName = $scope.page.date.getDate() + " " + monthNames[$scope.page.date.getMonth()] + " " + $scope.page.date.getFullYear();
//console.log('page date is: ' + $scope.page.dateName);
//
//if (dateToday.valueOf() === $scope.page.timestamp) { $scope.page.dateName = "Today"; }
//if (dateToday.valueOf() === $scope.page.timestamp + 86400) { $scope.page.dateName = "Yesterday" }
//if (dateToday.valueOf() === $scope.page.timestamp - 86400) { $scope.page.dateName = "Tomorrow" }
//
//console.log(dateToday);
//console.log(dateToday.valueOf()+86400);
//console.log(dateToday.valueOf()-86400);
//
//console.log($scope.page);
