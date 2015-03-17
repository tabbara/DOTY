//if (jQuery) {
//  var originalFn = $.fn.data;
//  $.fn.data = function() {
//    if (arguments[0] !== '$binding')
//      return originalFn.apply(this, arguments);
//  }
//}

angular.module("dotyApp")
.config( function($stateProvider, $urlRouterProvider, $compileProvider) {

  // TURN THIS TO FALSE FOR PRODUCTION!
  //  $compileProvider.debugInfoEnabled(false)

  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('/', {
    cache: false,
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
    cache: false,
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
    cache: false,
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
    cache: false,
    url: "/explore/:categoryID",
    templateUrl: "views/categorypage.html",
    controller: 'categorypageCtrl'
  })
  .state('datepage', {
    cache: false,
    url: "/date/:dateID",
    templateUrl: "views/datepage.html",
    controller: 'datepageCtrl'
  })
});
