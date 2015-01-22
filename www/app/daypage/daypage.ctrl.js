angular.module('daypageModule')
.controller('daypageCtrl', function($scope, queryAPI, $stateParams, $ionicNavBarDelegate, $rootScope, signinFac, $ionicPopover) {

  var pageID = $stateParams.dayID.replace(/:/g,"");

  queryAPI.getDayById([pageID])
  .then(function(data) {
    if (data.status.code === 100) {
      queryAPI.cleanDay(data.result)
      .then(function (daysObject) {
        $scope.dayObj = daysObject[0];

        if ($scope.dayObj.tagArray.length > 0) {
          queryAPI.getDayByTag($scope.dayObj.tagArray, 3)
          .then(function(data) {
            if(data.status.code === 100) {
              queryAPI.cleanDay(data.result)
              .then(function (daysObject) {
                $scope.relatedDays = daysObject;
              });
            } else {
              console.log('Error retrieving DaysByTag: ' + data.status.code);
            }
          }, function (status) {
            console.log(status);
          });
        }

      });
    } else {
      console.log('Error retrieving DayByID: ' + data.status.code);
    }
  }, function (status) {
    console.log(status);
  });

  $scope.goBack = function () {
    $ionicNavBarDelegate.back();
  };

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
