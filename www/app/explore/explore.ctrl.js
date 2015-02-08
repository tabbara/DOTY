angular.module('exploreModule')
.controller('exploreCtrl', function($scope, queryAPI, $rootScope, $ionicLoading) {

  $scope.pageLoading = {
    status: true,
    loading: $ionicLoading.show({
      template: '<div class="spinner-animation"></div>',
      noBackdrop: false
    })
  }

  queryAPI.getTags()
  .then(function(data) {
    if(data.status.code === 100) {
      $scope.pageLoading.status = false;
      $ionicLoading.hide();

      var tags = data.result;
      $scope.categories = [];

      for (var tag in tags) {
        obj = tags[tag];
        if (obj.parent === "0") {
          $scope.categories.push(obj);
        };
      };

      $scope.categories = queryAPI.cleanCategory($scope.categories);
      queryAPI.setCategoryColors();

    } else {
      $scope.pageLoading.status = false;
      $ionicLoading.hide();
      console.log('Error retrieving Tags: ' + data.status.code);
    }
  }, function (status) {
    $scope.pageLoading.status = false;
    $ionicLoading.hide();
    $scope.categories = [];
    console.log(status);
  });

  $scope.setCategoryName = function (categoryname) {
    console.log("setting cat name to: " + categoryname);
    $rootScope.currentCategory = {
      'name': categoryname
    };
  };

});
