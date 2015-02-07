angular.module('homeModule')
.controller('homeCtrl', function ($scope, queryAPI, $ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicHistory, $stateParams, $ionicLoading) {

  $ionicSideMenuDelegate.canDragContent(true);
  $ionicHistory.clearHistory();

  function onAlways () {
    console.log('finished loading images');
  }

  function onProgress (imgLoad, image) {
    console.log('loaded: ' + image.img.src);
    var $imageEl = $(image.img).parent();
    $imageEl.removeClass('image-loading');
    $imageEl.children(".spinner-animation").remove();
  }

  var tempDate = new Date();
  var tempToday = Math.round(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()) / 1000);

  $scope.page = {};
  $scope.page.timestamp = tempToday;
  $scope.page.date = new Date(Math.round($scope.page.timestamp * 1000));
  $scope.page.previous = { timestamp: $scope.page.timestamp - 86400 };
  $scope.page.next = { timestamp: $scope.page.timestamp + 86400 }
  $scope.page.dateName = "Today";

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  $scope.pageLoading = {
    status: true,
    loading: $ionicLoading.show({
      template: '<div class="spinner-animation"></div>',
      noBackdrop: false
    })
  }

  queryAPI.getDayToday()
  .then(function(data) {
    if (data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.pageLoading.status = false;
        $ionicLoading.hide();
        $scope.days = daysObject;
        queryAPI.setDayColors();

        setTimeout( function () {
          var imagesWrapper = $('#content-wrapper');
          imagesWrapper.imagesLoaded()
          .progress( onProgress )
          .always( onAlways );
        }, 0, false);

      });
    } else {
      $scope.pageLoading.status = false;
      $ionicLoading.hide();
      console.log(data.status.code);
    }
  }, function (status) {
    $scope.pageLoading.status = false;
    $ionicLoading.hide();
    console.log(status);
  });
});
