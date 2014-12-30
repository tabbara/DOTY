angular.module('categorypageModule')
.controller('categorypageCtrl', function ($scope, queryAPI, $stateParams, $rootScope) {

  var pageID = $stateParams.categoryID.replace(/:/g,"");

  $scope.currentCategory = {'name': 'category'};

  if ($rootScope.currentCategory) {
    $scope.currentCategory.name = $rootScope.currentCategory.name;
  };

  console.log($scope.currentCategory);

  var tagArray = [pageID];

  queryAPI.getDayByTag(tagArray)
  .then(function(data) {
    if(data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.days = daysObject;
        queryAPI.setDayColors();
      });
    } else {
      console.log('Error retrieving DaysByTag: ' + data.status.code);
    }
  }, function (status) {
    console.log(status);
  });

});
