angular.module("dotyApp")
.config( function($stateProvider, $urlRouterProvider) {
//  $httpProvider.defaults.withCredentials = true;
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('/', {
    url: "/",
    templateUrl: "views/home.html",
    controller: "homeCtrl"
  })
  .state('calendar', {
    url: "/calendar",
    templateUrl: "views/calendar.html"
  })
  .state('explore', {
    url: "/explore",
    templateUrl: "views/explore.html"
  })
  .state('favorites', {
    url: "/favorites",
    templateUrl: "views/favorites.html",
  })
  .state('profile', {
    url: "/profile",
    templateUrl: "views/profile.html"
  })
  .state('settings', {
    url: "/settings",
    templateUrl: "views/settings.html"
  })
  .state('daypage', {
    url: "/:dayID",
    templateUrl: "views/daypage.html",
    controller: "daypageCtrl"
  })
});
