angular.module('categorypageModule')
.controller('categorypageCtrl', function ($scope, queryAPI, $stateParams, $rootScope, $ionicLoading) {

  var pageID = $stateParams.categoryID.replace(/:/g,"");

  $scope.currentCategory = {'name': 'category'};

  if ($rootScope.currentCategory) {
    $scope.currentCategory.name = $rootScope.currentCategory.name;
  };

  var tagArray = [pageID];

  function onAlways (imgLoad) {
    console.log('finished loading images', imgLoad);

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

  queryAPI.getDayByTag(tagArray)
  .then(function(data) {
    if(data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.pageLoading.status = false;
        $ionicLoading.hide();

        $scope.days = daysObject;
        queryAPI.setDayColors();

        setTimeout( function () {
          var imagesWrapper = $('#categorypage-wrapper');
          imagesWrapper.imagesLoaded()
          .progress( onProgress )
          .always( onAlways );
        }, 0, false);

      });
    } else {
      $scope.pageLoading.status = false;
      $ionicLoading.hide();
      console.log('Error retrieving DaysByTag: ' + data.status.code);
    }
  }, function (status) {
    $scope.pageLoading.status = false;
    $ionicLoading.hide();
    console.log(status);
  });

});
