angular.module('exploreModule')
.controller('exploreCtrl', function($scope, queryAPI, $rootScope, $ionicLoading, $rootScope) {

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

      $rootScope.categoryList = [];
      var tags = data.result;

      $rootScope.categoryListFull = {};
      var lookupParent = {};
      for (var tag in tags) {
        obj = tags[tag];

        if ($rootScope.userData.pc_tags.indexOf(obj.slug) === -1) {
          console.log('not bookmarked: ' + obj.slug);
          obj.bookmarked = false;
        } else {
          console.log('bookmarked: ' + obj.slug);
          obj.bookmarked = true;
        }

        if (obj.parent === "0") {
          $rootScope.categoryList.push(obj);
          $rootScope.categoryList[$rootScope.categoryList.length-1].children = [];
          lookupParent[obj.term_id] = obj;
          lookupParent[obj.term_id].elementInArray = $rootScope.categoryList.length-1;
        };

        $rootScope.categoryListFull[obj.slug] = obj;
      };

      for (var tag in tags) {
        obj = tags[tag];
        if (lookupParent[obj.parent]) {
          $rootScope.categoryList[lookupParent[obj.parent].elementInArray].children.push(obj);
        };
      };

      $rootScope.categoryList = queryAPI.cleanCategory($rootScope.categoryList);
      queryAPI.setCategoryColors();

    } else {
      $scope.pageLoading.status = false;
      $ionicLoading.hide();
      $rootScope.categoryList = [];
      console.log('Error retrieving Tags: ' + data.status.code);
    }
  }, function (status) {
    $scope.pageLoading.status = false;
    $ionicLoading.hide();
    $rootScope.categoryList = [];
    console.log(status);
  });

});
