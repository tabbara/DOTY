angular.module('categorypageModule')
.controller('categorypageCtrl', function ($scope, queryAPI, $stateParams, signinFac, $rootScope) {

  var pageID = $stateParams.categoryID.replace(/:/g,"");

  $scope.currentCategory = {'name': 'category'};

  if ($rootScope.currentCategory) {
      $scope.currentCategory.name = $rootScope.currentCategory.name;
  };

  console.log($scope.currentCategory);

  var tagArray = [pageID];

  queryAPI.getDayByTag(tagArray)
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
