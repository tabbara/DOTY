angular.module('searchpageModule')
.controller('searchpageCtrl', function ($scope, queryAPI, $rootScope, $ionicNavBarDelegate) {

  //  var tagArray = [pageID];
  //
  //  queryAPI.getDayByTag(tagArray)
  //  .then(function(data) {
  //    queryAPI.cleanDay(data.days)
  //    .then(function (daysObject) {
  //      $scope.days = daysObject;
  //      queryAPI.setDayColors();
  //    });
  //  }, function (status) {
  //    console.log(status);
  //  });

  $scope.data = {
    'searchQuery': ''
  };

  $scope.days = [];

  $scope.madeSearch = {
    'found': false,
    'finished': false
  };

  $scope.search = function () {
    if($scope.data.searchQuery !== '')
    {
      $scope.madeSearch.found = false;
      $scope.madeSearch.finished = false;
      //FORM SUBMIT SEARCH
      queryAPI.getDayBySearch($scope.data.searchQuery)
      .then(function (data) {
        if(data.meta.results_total === 0) {
          console.log('no results found for: ' + $scope.data.searchQuery);
          $scope.days = [];
          $scope.madeSearch.found = false;
          $scope.madeSearch.finished = true;
        } else {
          queryAPI.cleanDay(data.days)
          .then(function (daysObject) {
            $scope.days = daysObject;
            queryAPI.setDayColors();
            $scope.madeSearch.found = true;
            $scope.madeSearch.finished = true;
          });
        }
      }, function (status) {
        console.log(status);
        $scope.madeSearch.found = false;
        $scope.madeSearch.finished = true;
      });
    }
  };

  $scope.goBack = function() {
    console.log('back');
    $ionicNavBarDelegate.back();
  };

});
