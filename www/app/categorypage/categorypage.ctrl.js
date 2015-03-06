angular.module('categorypageModule')
.controller('categorypageCtrl', function ($scope, queryAPI, $stateParams, $rootScope, $ionicLoading, $ionicPopover, $ionicScrollDelegate) {

  $scope.currentPage = $stateParams.categoryID.replace(/:/g,"");;

  $scope.currentCategory = {'name': 'category'};

  if ($rootScope.currentCategory) {
    $scope.currentCategory.name = $rootScope.currentCategory.name;
  };

  var tagArray = [$scope.currentPage];

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

  $scope.madeLookup = {
    'results': 0,
    'showing': 0,
    'offset': 0,
    'findingmore': false
  };

  queryAPI.getDayByTag({'tagArray': tagArray, 'limit': 10, 'offset': $scope.madeLookup.offset})
  .then(function(data) {
    if(data.status.code === 100) {
      $scope.madeLookup.results = data.meta.results_total;
      $scope.madeLookup.showing = Math.min(10,data.meta.results_total);

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

  $scope.showMore = function () {
    if (!$scope.madeLookup.findingMore) {
      $scope.madeLookup.findingMore = true;
      $scope.madeLookup.offset += 10;

      queryAPI.getDayByTag({'tagArray': tagArray, 'limit': 10, 'offset': $scope.madeLookup.offset})
      .then(function(data) {
        if(data.status.code === 100) {
          $scope.madeLookup.showing = Math.min($scope.madeLookup.offset+10,data.meta.results_total);

          queryAPI.cleanDay(data.result)
          .then(function (daysObject) {

            $scope.days = $scope.days.concat(daysObject);
            queryAPI.setDayColors();

            setTimeout( function () {
              var imagesWrapper = $('#categorypage-wrapper');
              imagesWrapper.imagesLoaded()
              .progress( onProgress )
              .always( onAlways );

              $ionicScrollDelegate.scrollBy(0, 300, 1);

            }, 0, false);

          });
        } else {
          $scope.madeLookup.offset -= 10;
          console.log('Error retrieving DaysByTag: ' + data.status.code);
        }
        $scope.madeLookup.findingMore = false;
      }, function (status) {
        console.log(status);
        $scope.madeLookup.findingMore = false;
        $scope.madeLookup.offset -= 10;
      });
    }
  }

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
    if ($rootScope.categoryList[i].slug === $scope.currentPage) {
      $scope.subcategories = $rootScope.categoryList[i].children;
    }
  }

});
