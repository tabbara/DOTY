angular.module('dotyApp')
.controller('DaysCtrl', function($rootScope, $scope, signinFac) {
//, $http, $stateParams, $location, $ionicPopup, $timeout

  signinFac.userRemoveData(); // not removal, just an init of a clean data object

  $rootScope.userSession = {
    signedIn: false
  };

  $scope.views = [
    { title: 'Home', url: "home", icon: "ion-home", color: 'sm-0' },
    { title: 'Calendar', url: "calendar", icon: "ion-ios7-calendar-outline", color: 'sm-1' },
    { title: 'Explore', url: "explore", icon: "ion-earth", color: 'sm-2' },
    { title: 'Favorites', url: "favorites", icon: "ion-ios7-heart", color: 'sm-3' },
    { title: 'Profile', url: "profile", icon: "ion-person", color: 'sm-4' },
    { title: 'Settings', url: "settings", icon: "ion-ios7-gear", color: 'sm-5' }
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


