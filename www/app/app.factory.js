angular.module("dotyApp")
.factory('queryAPI', function($http, $timeout, $q) {
  var fac = {};

  fac.logout = function() {
    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/api/1.5/user/?logout'
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

    console.log("Grabbing [day-by-date]: https://www.daysoftheyear.com/api/1.5/days/?date_start="
                + today +"&date_end=" + today + "&limit=100");

    $http({
      method: 'GET',
      url: "https://www.daysoftheyear.com/api/1.5/days/?date_start="
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

  fac.getDayById = function(idArray) {
    var deferred = $q.defer();

    var url = "https://www.daysoftheyear.com/api/1.5/days?";

    var idArrayLength = idArray.length;

    if (idArrayLength) {
      url = url + '&ids=' + idArray[0];
      for(var i = 1; i < idArrayLength; i++) {
        url = url + ',' + idArray[i];
      };

      console.log("grabbing [day-by-id]: " + url);

      $http({
        method: 'GET',
        url: url
      })
      .success(function (data) {
        deferred.resolve(data)
      })
      .error(function () {
        deferred.reject('could not retrieve day-id data');
      });
    } else {
      deferred.reject('no ids passed to getDayById!');
    }

    return deferred.promise;
  };

  fac.getDayByTag = function(tagArray) {
    var deferred = $q.defer();

    var limit = 10; // Temporary. This function should grab days in the near future. Need to figure out if the API returns date sorted content.
    var url = "https://www.daysoftheyear.com/api/1.5/days?limit=" + limit;

    var tagArrayLength = tagArray.length;

    if (tagArrayLength) {
      url = url + '&tags=' + tagArray[0];
      for(var i = 1; i < tagArrayLength; i++) {
        url = url + ',' + tagArray[i];
      };

      console.log('Grabbing [day-by-tag]: ' + url);

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
    }  else {
      deferred.reject('no tags passed to getDayByTag!');
    }

    return deferred.promise;
  };

  fac.getDayBySearch = function (query) {
    var deferred = $q.defer();

    var limit = 10; // Temporary. This function should grab days in the near future. Need to figure out if the API returns date sorted content.
    var url = "https://www.daysoftheyear.com/api/1.5/days/?limit=" + limit + '&s=' + query;

    console.log('Grabbing [day-by-search]: ' + url);

    $http({
      method: 'GET',
      url: url
    })
    .success(function (data) {
      deferred.resolve(data);
    })
    .error(function () {
      deferred.reject('could not retrieve days by search query');
    });

    return deferred.promise;
  };

  fac.getTags = function() {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: "https://www.daysoftheyear.com/api/1.5/tags"
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
      //      _dayObj.title = _dayObj.title.replace("&#8217;","'");
      //      _dayObj.title = _dayObj.title.replace("&#038;","&");
      _dayObj.tag = {};
      $.each(_dayObj.tags, function (_tagIndex, _tagValue) {
        _dayObj.tags[_tagIndex].name = _dayObj.tags[_tagIndex].name
        .replace("&amp;","&");

        if (_dayObj.tags[_tagIndex].level === 0) {
          _dayObj.tag = {
            name: _dayObj.tags[_tagIndex].name,
            slug: _dayObj.tags[_tagIndex].slug
          };
        }
      });

      var currentTime = new Date().getTime() / 1000;
      var timeDiff = 0;
      var timeIndex = -1;

      $.each(_dayObj.dates, function (_dateIndex, _dateValue) {
        var dateDiff = Math.abs(parseInt(_dayObj.dates[_dateIndex]) - currentTime);
        if (dateDiff < timeDiff || timeIndex === -1) {
          timeDiff = dateDiff;
          timeIndex = _dateIndex;
        }
      });

      _dayObj.date = new Date(parseInt(_dayObj.dates[timeIndex]) * 1000);

      //      console.log('a', _dayObj.tags);
      //      console.log('tag', _dayObj.tag);

//      $.each(_dayObj.dates, function (_dateIndex, _dateValue) {
//        _dayObj.dates[_dateIndex] = new Date(parseInt(_dateValue) * 1000);
//      });

      //      for (var d in $scope.days) {
      //        $scope.days[d].date = new Date(parseInt($scope.days[d].dates[0]) * 1000);
      //      }

      _dayObj.content = _dayObj.content
      .replace(/<a>/g, "")
      .replace(/<\/?a[^>]*>/g, "")
      .replace(/<p>/g, "<h2 class='content-text'>")
      .replace(/<\/p>/gi, "</h2>");
      //      .replace(/\r\n/g,"<BR>")
    });

    console.log("cleaned up these days");
    console.log(daysArray);
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
