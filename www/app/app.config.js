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

var jsapp = {
  setDayColors: function () {
    var colors = ["#ea493b", "#7fccbd", "#81c256", "#f6d24c",
                  "#9765b8", "#73a6db", "#73a6db", "#e6b294"];

    $(".day-title").each( function(i) {
      this.style.background = colors[i % 8];
    });

    $(".day-image-container").each( function(i) {
      this.style["border-color"] = colors[i % 8];
    });

    $(window).trigger('resize');

  }
};
