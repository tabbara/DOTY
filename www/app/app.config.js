angular.module("dotyApp")
.config( function($stateProvider, $urlRouterProvider) {
  //  $httpProvider.defaults.withCredentials = true;
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('/', {
    url: "/",
    templateUrl: "views/login.html",
    controller: "loginCtrl"
  })
  .state('home', {
    url: "/home",
    templateUrl: "views/home.html",
    controller: "homeCtrl"
  })
  .state('calendar', {
    url: "/calendar",
    templateUrl: "views/calendar.html",
    controller: "calendarCtrl"
  })
  .state('explore', {
    url: "/explore",
    templateUrl: "views/explore.html",
    controller: "exploreCtrl"
  })
  .state('favorites', {
    url: "/favorites",
    templateUrl: "views/favorites.html",
    controller: "favoritesCtrl"
  })
  .state('profile', {
    url: "/profile",
    templateUrl: "views/profile.html"
  })
  .state('settings', {
    url: "/settings",
    templateUrl: "views/settings.html"
  })
  .state('searchpage', {
    url: "/search",
    templateUrl: "views/searchpage.html",
    controller: 'searchpageCtrl'
  })
  .state('daypage', {
    url: "/:dayID",
    templateUrl: "views/daypage.html",
    controller: "daypageCtrl"
  })
  .state('categorypage', {
    url: "/explore/:categoryID",
    templateUrl: "views/categorypage.html",
    controller: 'categorypageCtrl'
  })
  .state('datepage', {
    url: "/date/:dateID",
    templateUrl: "views/datepage.html",
    controller: 'datepageCtrl'
  })
});
