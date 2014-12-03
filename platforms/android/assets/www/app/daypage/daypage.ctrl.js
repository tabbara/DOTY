angular.module('daypageModule')
.controller('daypageCtrl', function($scope, queryAPI, $stateParams) {

  var pageID = $stateParams.dayID.replace(/:/g,"");

  queryAPI.getDayById(pageID).then(function(data) {
    $scope.dayObj = queryAPI.cleanDay(data.days)[0];
  });
});
