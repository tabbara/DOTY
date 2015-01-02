angular.module('dotyApp')
.controller('DaysCtrl', function($rootScope, $scope, $timeout, signinFac) {
//, $http, $stateParams, $location, $ionicPopup, $timeout

  signinFac.userRemoveData(); // not removal, just an init of a clean data object

  $rootScope.userSession = {
    signedIn: false
  };

  $timeout(function() {
    signinFac.checkSignin();
  }, 250);

  $scope.views = [
    { title: 'Home', url: "/", icon: "ion-home" },
    { title: 'Calendar', url: "calendar", icon: "ion-ios7-calendar-outline" },
    { title: 'Explore', url: "explore", icon: "ion-earth" },
    { title: 'Favorites', url: "favorites", icon: "ion-ios7-heart" },
    { title: 'Profile', url: "profile", icon: "ion-person" },
    { title: 'Settings', url: "settings", icon: "ion-ios7-gear" }
  ];

//  $scope.setFavorite = function (dayid) {
//    var lookup = {};
//    for (var i = 0, len = $scope.days.length; i < len; i++) {
//      lookup[$scope.days[i].id] = i;
//    }
//    $scope.days[lookup[dayid]].liked = !$scope.days[lookup[dayid]].liked;
//
//    if($scope.days[lookup[dayid]].liked){
//      var alertPopup = $ionicPopup.alert({
//        title: $scope.days[lookup[dayid]].title,
//        template: 'has been added to your favourites!',
//        okText: "close"
//      });
//
//      $timeout(function() {
//        alertPopup.close();
//      }, 2750);
//    }
//  };

});


