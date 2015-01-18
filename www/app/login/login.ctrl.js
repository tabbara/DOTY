angular.module('loginModule')
.controller('loginCtrl', function ($scope, $state, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $timeout, signinFac) {

  $ionicSideMenuDelegate.canDragContent(false);

  $scope.startApp = function() {
    $state.go('home');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.showIntroduction = false;

  signinFac.checkSignin()
  .then(function (status) {
    console.log(status);
    signinFac.signinModalClose();
    $scope.startApp();
    //    $scope.showIntroduction = true;
  }, function (status) {
    console.log(status);
    signinFac.signinModalOpen();
  });

  $scope.$on('showIntroductionHandle', function (event, show) {
    $scope.showIntroduction = show;
    if (!show) {
      $scope.startApp();
    }
  });

  //  $timeout(function() {
  //  signinFac.checkSignin();
  //  }, 10);

  //  queryAPI.getDayToday()
  //  .then(function(data) {
  //    if (data.status.code === 100) {
  //      queryAPI.cleanDay(data.result)
  //      .then(function (daysObject) {
  //        $scope.days = daysObject;
  //        queryAPI.setDayColors();
  //      });
  //    } else {
  //      console.log(data.status.code);
  //    }
  //  }, function (status) {
  //    console.log(status);
  //  });
});
