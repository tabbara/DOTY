var app = angular.module("doty", ["ionic","ui.router"]);

app.controller('DaysCtrl', function($scope, $http) {

    $scope.views = [
        { title: 'Home', url: "home" },
        { title: 'Explore', url: "explore" },
        { title: 'Favorites', url: "favorites" },
        { title: 'Settings', url: "settings" }
    ];

    $http.get("http://app.daysoftheyear.com/api.php?date_start=16-10-2014&date_end=16-10-2014&limit=100")
        .then(function(res){
    $scope.datadays = res.data;
    });
});

app.config( function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html"
    })
    .state('explore', {
      url: "/explore",
      templateUrl: "views/explore.html"
    })
    .state('favorites', {
      url: "/favorites",
      templateUrl: "views/favorites.html"
    })
    .state('settings', {
      url: "/settings",
      templateUrl: "views/settings.html"
    })
});

var jsapp = {
    // Application Constructor

    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
    },

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
