angular.module("dotyApp")
.factory('queryAPI', function($http, $timeout, $q) {
  var fac = {};

  fac.logout = function() {
    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/app/user/?logout'
    }).then(function() {
      fac.userRemoveData();
      fac.removeCredentials();
      fac.signinModalOpen();
    });
  };

  fac.getDayToday = function() {

    var deferred = $q.defer();

    var todayDate = new Date();
    var today = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) / 1000;
    var todayB = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()+5) / 1000;

    console.log("grabbing: https://www.daysoftheyear.com/app/days/?date_start="
                + today +"&date_end=" + today + "&limit=100");

    $http({
      method: 'GET',
      url: "https://www.daysoftheyear.com/app/days/?date_start="
      + today +"&date_end=" + todayB + "&limit=100"
    })
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function () {
      deferred.reject('could not retrieve days (getDayToday)');
    });

    return deferred.promise;
  }

  fac.getDayById = function(id) {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: "https://www.daysoftheyear.com/app/days/?day_ids=" + id
    })
    .success(function (data) {
      deferred.resolve(data)
    })
    .error(function () {
      deferred.reject('could not retrieve day-id data');
    });

    return deferred.promise;
  }

  //  // Clean Title
  //  fac.cleanDayTitle = function(daysArray) {
  //    var deferred = $q.defer();
  //
  //    $.each(daysArray, function (index, _dayObj) {
  //      _dayObj.title = _dayObj.title.replace("&#038;","'");
  //      _dayObj.title = _dayObj.title.replace("&#8217;","'");
  //
  //    });
  //
  //    deferred.resolve(daysArray);
  //
  //    return deferred.promise;
  //  }

  // Clean Title and Content
  fac.cleanDay = function(daysArray) {
    var deferred = $q.defer();

    $.each(daysArray, function (index, _dayObj) {
      _dayObj.title = _dayObj.title.replace("&#8217;","'");
      _dayObj.title = _dayObj.title.replace("&#038;","&");
      _dayObj.content = _dayObj.content
      .replace(/\r\n/g,"<BR>")
      .replace(/<a>/g, "")
      .replace(/<\/?a[^>]*>/g, "")
      .replace(/<p>/g, "<h2 class='content-text'>")
      .replace(/<\/p>/gi, "</h2>");
    });

    deferred.resolve(daysArray);

    return deferred.promise;
  };


  fac.setDayColors = function () {
    var colors = ["#ea493b", "#7fccbd", "#81c256", "#f6d24c",
                  "#9765b8", "#73a6db", "#9e4f64", "#e6b294"];

    $timeout(function () {
      $(".card-title").each(function(i) {
        this.style.background = colors[i % 8];
      });
    }, 1);


    //    $(".day-image-container").each( function(i) {
    //      this.style["border-color"] = colors[i % 8];
    //    });

    //    $(window).trigger('resize');
  };

  return fac;
});
