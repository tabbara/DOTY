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
    var todayB = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()+3) / 1000;

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
  };

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
  };

  fac.getDayByTag = function(tagArray) {
    var deferred = $q.defer();

    var limit = 7; // Temporary. This function should grab days in the near future. Need to figure out if the API returns date sorted content.
    var url = "https://www.daysoftheyear.com/api/days?limit=" + limit;

    var tagArrayLength = tagArray.length;

    if (tagArrayLength) {
      url = url + '&tags=' + tagArray[0];
      for(var i = 1; i < tagArrayLength; i++) {
        url = url + ',' + tagArray[i];
      };
    } else {
      console.log('no tags passed to getDayByTag!');
    };

    console.log('Grabbing: ' + url);

    $http({
      method: 'GET',
      url: url
    })
    .success(function (data) {
      deferred.resolve(data)
    })
    .error(function () {
      deferred.reject('could not retrieve days by tag data');
    });

    return deferred.promise;
  };

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


  fac.getTags = function() {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: "https://www.daysoftheyear.com/api/tags"
    })
    .success(function (data) {
      deferred.resolve(data)
    })
    .error(function () {
      deferred.reject('could not retrieve tags');
    });

    return deferred.promise;
  };



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

  fac.cleanCategory = function(categoryArray) {
    $.each(categoryArray, function (index, catObj) {
      catObj.name = catObj.name.replace("&amp;","&");
    });
    return categoryArray;
  };

  fac.setDayColors = function () {
    var colors = ["#ea493b", "#7fccbd", "#81c256", "#f6d24c",
                  "#9765b8", "#73a6db", "#9e4f64", "#e6b294"];

    $timeout(function () {
      $(".card-title").each(function(i) {
        this.style.background = colors[i % 8];
      });

      $(".card-wrapper").each(function(i) {
        this.style.borderColor = colors[i % 8];
      });
    }, 1);

  };

  fac.setCategoryColors = function () {
    var colors = ["#ea493b", "#7fccbd", "#81c256", "#f6d24c",
                  "#9765b8", "#73a6db", "#9e4f64", "#e6b294"];

    $timeout(function () {
      $(".explore-category").each(function(i) {
        this.style.background = colors[i % 8];
      });
    }, 1);

  };

  return fac;
});
