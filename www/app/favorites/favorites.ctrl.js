angular.module('favoritesModule')
.controller('favoritesCtrl', function ($scope, queryAPI, $rootScope, $ionicLoading) {

  if ($rootScope.userData.pc_days.length) {
    $scope.pageLoading = {
      status: true,
      loading: $ionicLoading.show({
        template: '<div class="spinner-animation"></div>',
        noBackdrop: false
      })
    }

    queryAPI.getDayById({'idArray': $rootScope.userData.pc_days})
    .then(function(data) {
      if (data.status.code === 100) {
        $scope.pageLoading.status = false;
        $ionicLoading.hide();

        queryAPI.cleanDay(data.result)
        .then(function (daysObject) {
          $scope.days = daysObject;
          //          queryAPI.setDayColors();
        });
      } else {
        $scope.pageLoading.status = false;
        $ionicLoading.hide();
        console.log('Error retrieving DaysById: ' +data.status.code);
      }
    }, function (status) {
      $scope.pageLoading.status = false;
      $ionicLoading.hide();
      console.log(status);
    });
  } else {
    $scope.pageLoading = {
      status: false
    }
  }

});


