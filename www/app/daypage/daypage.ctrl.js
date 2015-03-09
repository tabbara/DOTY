angular.module('daypageModule')
.controller('daypageCtrl', function($scope, queryAPI, $stateParams, $rootScope, signinFac, $ionicPopover, $ionicLoading) {

  var pageID = $stateParams.dayID.replace(/:/g,"");
  //  <div class="spinner-animation"></div>

  $scope.relatedDays = {
    loading: true,
  }

  $scope.pageLoading = {
    status: true,
    loading: $ionicLoading.show({
      template: '<div class="spinner-animation"></div>',
      noBackdrop: false
    })
  }

  function onProgress (imgLoad, image) {
    console.log('loaded: ' + image.img.src);
    var $imageEl = $(image.img).parent();
    $(image.img).css('opacity', 1);
//    $imageEl.removeClass('image-loading');
//    $imageEl.children(".spinner-animation").remove();
  }

  queryAPI.getDayById({'idArray': [pageID]})
  .then(function(data) {
    if (data.status.code === 100) {
      $scope.pageLoading.loading = false;
      $ionicLoading.hide();
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.dayObj = daysObject[0];

        setTimeout( function () {
          var imagesWrapper = $('.content-image-container');
          imagesWrapper.imagesLoaded()
          .progress( onProgress );
        }, 0, false);

        if ($scope.dayObj.tagArray.length > 0) {
          queryAPI.getDayByTag({'tagArray': $scope.dayObj.tagArray, 'limit': 5})
          .then(function(data) {
            if(data.status.code === 100) {
              $scope.relatedDays.loading = false;

              var responseLength = data.result.length;
              var removeEntry = -1;
              if (responseLength) {
                for (var i=0; i<responseLength;i++) {
                  if ($scope.dayObj.id === data.result[i].id) {
                    removeEntry = i;
                  }
                }

                if (removeEntry !== -1) {
                  data.result.splice(removeEntry, 1);
                } else {
                  data.result.splice(data.result.length - 1, 1);
                }
              }
              queryAPI.cleanDay(data.result)
              .then(function (daysObject) {
                $scope.relatedDays.days = daysObject;
              });
            } else {
              $scope.relatedDays.loading = false;
              console.log('Error retrieving DaysByTag: ' + data.status.code);
            }
          }, function (status) {
            $scope.relatedDays.loading = false;
            console.log(status);
          });
        } else {
          console.log('no tags so no related content');
          $scope.relatedDays.loading = false;
        }

      });
    } else {
      $scope.pageLoading.loading = false;
      $ionicLoading.hide();
      $scope.relatedDays.loading = false;
      console.log('Error retrieving DayByID: ' + data.status.code);
    }
  }, function (status) {
    $scope.pageLoading.loading = false;
    $ionicLoading.hide();
    $scope.relatedDays.loading = false;
    console.log(status);
  });

  //  $scope.goBack = function () {
  //    $ionicHistory.goBack();
  //  };

  //  $ionicNavBarDelegate.showBackButton(true);

  $scope.setCategoryName = function (categoryname) {
    console.log(categoryname);
    console.log("setting cat name to: " + categoryname);
    $rootScope.currentCategory = {
      'name': categoryname
    };
  };

  $scope.bookmarkDay = function () {
    if ($scope.dayObj) {
      var profileData = {
        'type': 'days'
      };

      if ($scope.dayObj.bookmarked) {
        profileData.remove = [$scope.dayObj.id];
        if (typeof $rootScope.userData.pc_days !== 'undefined') {
          while ($rootScope.userData.pc_days.indexOf($scope.dayObj.id.toString()) !== -1) {
            $rootScope.userData.pc_days.splice($rootScope.userData.pc_days.indexOf($scope.dayObj.id.toString()),1)
          };
          console.log('days bookmarks: ', $rootScope.userData.pc_days);
        }
      } else {
        profileData.add = [$scope.dayObj.id];
        if (typeof $rootScope.userData.pc_days !== 'undefined') {
          if($rootScope.userData.pc_days.indexOf($scope.dayObj.id.toString()) === -1) {
            $rootScope.userData.pc_days.push($scope.dayObj.id.toString());
            console.log('days bookmarks: ', $rootScope.userData.pc_days);
          }
        }
      }

      $scope.dayObj.bookmarked = !$scope.dayObj.bookmarked;

      signinFac.updateBookmarks(profileData)
      .then(function (status) {
        console.log(status);
      }, function (status) {
        console.log(status);
        //        $scope.dayObj.bookmarked = !$scope.dayObj.bookmarked;
      });
    }
    else {
      console.log("Can't bookmark, no day loaded yet");
    }
  };

  $ionicPopover.fromTemplateUrl('modals/showMore.html', {
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
});
