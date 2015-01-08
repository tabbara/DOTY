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
    'finished': false,
    'started': false
  };

  $scope.search = function () {
    if($scope.data.searchQuery !== '') {
      $scope.madeSearch.found = false;
      $scope.madeSearch.finished = false;
      $scope.madeSearch.started = true;
      //FORM SUBMIT SEARCH
      queryAPI.getDayBySearch($scope.data.searchQuery)
      .then(function (data) {
        if(data.status.code === 100) {
          if(data.meta.results_total === 0) {
            console.log('no results found for: ' + $scope.data.searchQuery);
            $scope.days = [];
            $scope.madeSearch.found = false;
            $scope.madeSearch.finished = true;
          } else {
            queryAPI.cleanDay(data.result) // ERROR THERE IS NO data.days ANYMORE, CHECK API, RETURNS data.result NOW!
            .then(function (daysObject) {
              $scope.days = daysObject;
              queryAPI.setDayColors();
              $scope.madeSearch.found = true;
              $scope.madeSearch.finished = true;
            });
          }
        } else {
          if(data.status.code === 901) {
            console.log("no results found for" + $scope.data.searchQuery);
            $scope.days = [];
            $scope.madeSearch.found = false;
            $scope.madeSearch.finished = true;
          } else {
            if(data.status.code === 304) {
              console.log("user not logged in");
              $scope.days = [];
              $scope.madeSearch.found = false;
              $scope.madeSearch.finished = true;
            };
          }
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
