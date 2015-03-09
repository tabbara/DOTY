angular.module('datepageModule')
.controller('datepageCtrl', function ($scope, queryAPI, $stateParams, $ionicSideMenuDelegate, $ionicLoading) {

  //  $ionicSideMenuDelegate.canDragContent(true);
  // not working atm

  function onAlways () {
    console.log('finished loading images');
  }

  function onProgress (imgLoad, image) {
    console.log('loaded: ' + image.img.src);
    var $imageEl = $(image.img).parent();
    $imageEl.removeClass('image-loading');
    $imageEl.children(".spinner-animation").remove();
  }

  $scope.pageLoading = {
    status: true,
    loading: $ionicLoading.show({
      template: '<div class="spinner-animation"></div>',
      noBackdrop: false
    })
  }

  $scope.page = {};
  $scope.page.timestamp = parseInt($stateParams.dateID.replace(/:/g,""));
  $scope.page.date = new Date(parseInt($scope.page.timestamp) * 1000);
  $scope.page.previous = { timestamp: $scope.page.timestamp - 86400 };
  $scope.page.next = { timestamp: $scope.page.timestamp + 86400 }

  var tempDate = new Date();
  var dateToday = Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()) / 1000;

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  $scope.page.dateName = $scope.page.date.getDate() + " " + monthNames[$scope.page.date.getMonth()] + " " + $scope.page.date.getFullYear();
  console.log('page date is: ' + $scope.page.dateName);

  if (dateToday.valueOf() === $scope.page.timestamp) { $scope.page.dateName = "Today"; }
  if (dateToday.valueOf() === $scope.page.timestamp + 86400) { $scope.page.dateName = "Yesterday" }
  if (dateToday.valueOf() === $scope.page.timestamp - 86400) { $scope.page.dateName = "Tomorrow" }

  console.log(dateToday);
  console.log(dateToday.valueOf()+86400);
  console.log(dateToday.valueOf()-86400);

  console.log($scope.page);

  queryAPI.getDayByDate({'startDate': $scope.page.timestamp})
  .then(function(data) {
    if (data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.pageLoading.status = false;
        $ionicLoading.hide();

        $scope.days = daysObject;
        queryAPI.setDayColors();

        setTimeout( function () {
          var imagesWrapper = $('#datepage-wrapper');
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
