angular.module('exploreModule')
.controller('exploreCtrl', function($scope, queryAPI, $rootScope) {

  queryAPI.getTags()
  .then(function(data) {
    var tags = data;
    $scope.categories = [];

    for (var tag in tags) {
      obj = tags[tag];
      if (obj.parent === "0") {
        $scope.categories.push(obj);
      };
    };

    $scope.categories = queryAPI.cleanCategory($scope.categories);
    queryAPI.setCategoryColors();

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
