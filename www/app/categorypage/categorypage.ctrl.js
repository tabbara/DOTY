angular.module('categorypageModule')
.controller('categorypageCtrl', function ($scope, queryAPI, $stateParams, $rootScope, $ionicLoading, $ionicPopover) {

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

  $ionicPopover.fromTemplateUrl('modals/showCategories.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
    console.log('Opening showMore popover');
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
    console.log('Closing showMore popover');
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
    console.log('Destroying showMore popover');
  });

  $scope.subcategories = [];
  for (var i = 0; i < $rootScope.categoryList.length; i++) {
    if ($rootScope.categoryList[i].slug === pageID) {
      $scope.subcategories = $rootScope.categoryList[i].children;
      //        break;
    }
  }

  $scope.setSubcategory = function (slug) {
    console.log('setting to: ' + slug);
  }
});
