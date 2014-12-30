angular.module('exploreModule')
.controller('exploreCtrl', function($scope, queryAPI, $rootScope) {

  queryAPI.getTags()
  .then(function(data) {
    if(data.status.code === 100)
    {
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
      console.log('Error retrieving Tags: ' + data.status.code);
    }
  }, function (status) {
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
