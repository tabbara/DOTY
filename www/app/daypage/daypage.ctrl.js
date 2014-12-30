angular.module('daypageModule')
.controller('daypageCtrl', function($scope, queryAPI, $stateParams, $ionicNavBarDelegate) {

  var pageID = $stateParams.dayID.replace(/:/g,"");

  queryAPI.getDayById(pageID)
  .then(function(data) {
    if (data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.dayObj = daysObject[0];
      });
    } else {
      console.log('Error retrieving DayByID: ' + data.status.code);
    }
  }, function (status) {
    console.log(status);
  });

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

});
