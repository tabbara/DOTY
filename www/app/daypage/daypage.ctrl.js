angular.module('daypageModule')
.controller('daypageCtrl', function($scope, queryAPI, $stateParams) {

  var pageID = $stateParams.dayID.replace(/:/g,"");

  queryAPI.getDayById(pageID)
  .then(function(data) {
    queryAPI.cleanDay(data.days)
    .then(function (daysObject) {
      $scope.dayObj = daysObject[0];
    });
  }, function (status) {
    console.log(status);
  });


});
