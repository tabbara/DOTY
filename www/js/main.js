app.factory('signinFac', function($rootScope) {
  var fac = {};

  var signedIn = false; //

  fac.checkSignin = function() {
    $rootScope.$broadcast('signedIn', { 'signedIn' : signedIn });
    return signedIn;
  }

  fac.signin = function() {
    signedIn = true;
    $rootScope.$broadcast('signedIn', { 'signedIn' : signedIn });
  }

  return fac;
});

app.controller('signinController', function(signinFac) {

  this.signinData = {};

  this.signin = function() {
    console.log('log in attempt');
  };
});

app.controller('DaysCtrl', function($scope, $http, $stateParams, $location, $ionicPopup, $timeout, fbAPI, $ionicModal, signinFac) {

  $scope.profile = {
    "logged": false
  }

  $scope.views = [
    { title: 'Home', url: "/", icon: "ion-home" },
    { title: 'Calendar', url: "calendar", icon: "ion-ios7-calendar-outline" },
    { title: 'Explore', url: "explore", icon: "ion-earth" },
    { title: 'Favorites', url: "favorites", icon: "ion-ios7-heart" },
    { title: 'Profile', url: "profile", icon: "ion-person" },
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

  $scope.$on('signedIn', function(event,message) {
    if(message.signedIn === true) {
      console.log('LOGGED IN!');
      $scope.signinModal.hide();
    } else {
      console.log('NOT LOGGED IN!');
      $scope.signinModal.show();
    }
  });

  $scope.signin = function(){
    signinFac.signin();
  }

  $timeout(function() {
    signinFac.checkSignin();
  }, 500);


  $ionicModal.fromTemplateUrl('modals/signinModal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.signinModal = modal;
    console.log('Creating Signin Modal');
  });
  $scope.signinModalOpen = function() {
    $scope.signinModal.show();
    console.log('Opening In Modal');
  };
  $scope.signinModalClose = function() {
    $scope.signinModal.hide();
    console.log('Closing In Modal');
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.signinModal.remove();
    console.log('Destroying In Modal');
  });

  $ionicModal.fromTemplateUrl('modals/signupModal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.signupModal = modal;
    console.log('Creating Signup Modal');
  });
  $scope.signupModalOpen = function() {
    $scope.signupModal.show();
    console.log('Opening Up Modal');
  };
  $scope.signupModalClose = function() {
    $scope.signupModal.hide();
    console.log('Closing Up Modal');
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.signupModal.remove();
    console.log('Destroying Up Modal');
  });

  $ionicModal.fromTemplateUrl('modals/signupExtraModal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: true,
    hardwareBackButtonClose: true
  }).then(function(modal) {
    $scope.signupExtraModal = modal;
    console.log('Creating SignupExtra Modal');
  });
  $scope.signupExtraModalOpen = function() {
    $scope.signupExtraModal.show();
    console.log('Opening UpExtra Modal');
  };
  $scope.signupExtraModalClose = function() {
    $scope.signupExtraModal.hide();
    console.log('Closing UpExtra Modal');
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.signupExtraModal.remove();
    console.log('Destroying UpExtra Modal');
  });

});


app.controller('profileCtrl', function($scope, fbAPI) {
  var showLoginButton = false;

  $scope.loginButton = function() {
    showLoginButton = true;
  }

  $scope.logoutButton = function() {
    fbAPI.logout(function() {
      showLoginButton = false;
      $scope.fbName = "";
      $scope.fbImage = "";
    });
  }

  $scope.loginButtonShow = function() {
    return showLoginButton;
  }

  $scope.facebookLogin = function() {
    fbAPI.login(function (){
      $scope.facebookGetInfo();
      $scope.loginButton();
    });
  };

  $scope.facebookGetInfo = function() {
    var request = fbAPI.getInfo(),
        response;

    request.onreadystatechange = function () {

      if (request.readyState === 4) {
        if (request.status === 200) {
          response = JSON.parse(request.responseText);
          $scope.fbName = response.name;
          $scope.fbImage = "http://graph.facebook.com/" +
            response.id + "/picture?type=large";
          $scope.$apply();
        } else {
          console.log("error with login request");
        }
      }
    }
  };

  //    $scope.facebookGetInfo();

});

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

    return $http.get("https://www.daysoftheyear.com/app/days/?date_start="
                     + today +"&date_end=" + today + "&limit=100")
    .then(function(res) {
      return res.data;
    });
  }

  fac.getDayById = function(id) {

    return $http.get("https://www.daysoftheyear.com/app/days/?day_ids="
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

app.controller('daypageCtrl', function($scope, queryAPI, $stateParams) {

  var pageID = $stateParams.dayID.replace(/:/g,"");

  queryAPI.getDayById(pageID).then(function(data) {
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
  .state('profile', {
    url: "/profile",
    templateUrl: "views/profile.html",
    controller: "profileCtrl"
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
