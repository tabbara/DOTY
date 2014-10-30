var app = angular.module("doty", ["ionic","ui.router"]);

app.controller('DaysCtrl', function($scope, $http, $stateParams, $location, $ionicPopup, $timeout ) {

    $scope.views = [
        { title: 'Home', url: "/", icon: "ion-home" },
        { title: 'Calendar', url: "calendar", icon: "ion-ios7-calendar-outline" },
        { title: 'Explore', url: "explore", icon: "ion-earth" },
        { title: 'Favorites', url: "favorites", icon: "ion-ios7-heart" },
        { title: 'Settings', url: "settings", icon: "ion-ios7-gear" }
    ];

    $scope.setFavorite = function (dayid) {
        var lookup = {};
        for (var i = 0, len = $scope.days.length; i < len; i++) {
            lookup[$scope.days[i].id] = i;
        }
        $scope.days[lookup[dayid]].liked = !$scope.days[lookup[dayid]].liked;

        if($scope.days[lookup[dayid]].liked){
            var alertPopup = $ionicPopup.alert({
                 title: $scope.days[lookup[dayid]].title,
                 template: 'has been added to your favourites!',
                 okText: "close"
            });

            $timeout(function() {
                alertPopup.close();
            }, 2750);
        }
    };

//    $http.get("http://app.daysoftheyear.com/api.php?date_start=16-10-2014&date_end=18-10-2014&limit=100")
//        .then(function(res){
//    $scope.days = res.data.days;
//
//    $.each($scope.days, function (index, _dayObj) {
//        _dayObj.liked = false;
//        _dayObj.title = _dayObj.title.replace("&#8217;","'");
//
//        _dayObj.content = _dayObj.content.replace(/\r\n/g,"<BR>").replace(/<a>/g, "").replace(/<\/?a[^>]*>/g, "");
//
//    });

//////// Set 'dayObj' to the selected day in the JSON-loaded list of days
//      Old Style (faster, but doesn't work on reload). <a on-tap="setPage({{day}})">
//        $scope.setPage = function (day) {
//        $scope.dayObj = day;
//    }

//    if ($location.path() != "/") {
//        $scope.dayID = [{id: $stateParams.dayID}];
//        var lookup = {};
//        for (var i = 0, len = $scope.days.length; i < len; i++) {
//            lookup[$scope.days[i].id] = $scope.days[i];
//        }
//        $scope.dayObj = lookup[$stateParams.dayID.replace(/:/g,"")];
//    }
//
//    });
////////

});

//app.factory('countriesService', function($http, $scope) {
//    return {
//        getCountryData: function(done) {
//            $scope.dataLoaded = false;
//            $http.get('/resources/json/countries.json')
//            .success(function(data) {
//                done(data);
//                $scope.dataLoaded = true;
//             })
//            .error(function(error) {
//                alert('An error occured');
//            });
//        }
//    }
//});

app.factory('queryAPI', function($http) {
    var fac = {};

    fac.getDayToday = function() {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();

        if(dd<10) { dd='0'+dd; }
        if(mm<10) { mm='0'+mm; }

        today = dd+'-'+mm+'-'+yyyy;

        return $http.get("http://app.daysoftheyear.com/api.php?date_start="
        + today +"&date_end=" + today + "&limit=100")
        .then(function(res) {
            return res.data;
        });
    }

    fac.getDayById = function(id) {

        return $http.get("http://app.daysoftheyear.com/api.php?day_ids="
        + id)
        .then(function(res) {
            return res.data;
        });
    }

    // Clean Title
    fac.cleanDayTitle = function(daysArray) {
        $.each(daysArray, function (index, _dayObj) {
            _dayObj.title = _dayObj.title.replace("&#8217;","'");
        });
        return daysArray;
    }

    // Clean Title and Content
    fac.cleanDay = function(daysArray) {
        $.each(daysArray, function (index, _dayObj) {
            _dayObj.title = _dayObj.title.replace("&#8217;","'");
            _dayObj.content = _dayObj.content
            .replace(/\r\n/g,"<BR>")
            .replace(/<a>/g, "").replace(/<\/?a[^>]*>/g, "");
        });
        return daysArray;
    };

    return fac;
});

app.controller('homeCtrl', function($scope, queryAPI) {
    queryAPI.getDayToday().then(function(data) {
        $scope.days = queryAPI.cleanDay(data.days);
    });
});

app.controller('daypageCtrl', function($scope, queryAPI) {
    queryAPI.getDayById(14097).then(function(data) {
        $scope.dayObj = queryAPI.cleanDay(data.days)[0];
    });
});

app.config( function($stateProvider, $urlRouterProvider) {
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
    .state('settings', {
      url: "/settings",
      templateUrl: "views/settings.html"
    })
    .state('daypage', {
      url: "/:dayID",
      templateUrl: "views/daypage.html"
      ,controller: "daypageCtrl"
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
