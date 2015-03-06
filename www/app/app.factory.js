angular.module("dotyApp")
.factory('queryAPI', function($http, $timeout, $q, $rootScope) {
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
    var todayB = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) / 1000;

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

  fac.getDayByDate = function(startDate, endDate) {

    var deferred = $q.defer();

    endDate = endDate || startDate;

    console.log("Grabbing [day-by-date]: https://www.daysoftheyear.com/api/1.5/days/?date_start="
                + startDate +"&date_end=" + endDate + "&limit=100");

    $http({
      method: 'GET',
      url: "https://www.daysoftheyear.com/api/1.5/days/?date_start="
      + startDate +"&date_end=" + endDate + "&limit=100"
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

  fac.getDayByTag = function(options) {

    var tagArray = options.tagArray;
    var limit = options.limit || 10;
    var offset = options.offset || 0;

    var deferred = $q.defer();

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

  fac.getDayBySearch = function (query, offset) {
    var deferred = $q.defer();

    var limit = 10; // Temporary. This function should grab days in the near future. Need to figure out if the API returns date sorted content.
    var offset = offset || 0;
    var url = "https://www.daysoftheyear.com/api/1.5/days/?limit=" + limit + '&s=' + query + '&offset=' + offset;

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
      //      _dayObj.title = _dayObj.title
      //      .replace("&#8217;","'")
      //      .replace("&#038;","&")
      //      .replace("&#x00e9;","é");

      _dayObj.tag = {};
      _dayObj.tagArray = [];
      $.each(_dayObj.tags, function (_tagIndex, _tagValue) {
        _dayObj.tags[_tagIndex].name = _dayObj.tags[_tagIndex].name
        .replace("&amp;","&");

        if (_dayObj.tags[_tagIndex].level === 0) {
          _dayObj.tag = {
            name: _dayObj.tags[_tagIndex].name,
            slug: _dayObj.tags[_tagIndex].slug
          };
        }

        _dayObj.tagArray.push(_dayObj.tags[_tagIndex].slug);
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

      if ($rootScope.userData.pc_days.indexOf(_dayObj.id.toString()) !== -1) {
        _dayObj.bookmarked = true;
      } else {_dayObj.bookmarked = false;}

      _dayObj.content = "<div class='content-text'>" + _dayObj.content + "</div>"
      _dayObj.content = _dayObj.content
      .replace(/<ul>/g, "<ul class='list list-inset'>")
      .replace(/<li>/g, "<li class='item'>")
      .replace(/<h3>/g, "<h4>")
      .replace(/<\/h3>/gi, "</h4>")
      .replace(/<h2>/g, "<h3>")
      .replace(/<\/h2>/gi, "</h3>");
      //      .replace(/<a>/g, "")
      //      .replace(/<\/?a[^>]*>/g, "")
      //      .replace(/<p>/g, "<h2 class='content-text'>")
      //      .replace(/<\/p>/gi, "</h2>");
      //      console.log(_dayObj.content);
    });

    console.log("cleaned up these days");
    console.log(daysArray);
    deferred.resolve(daysArray);

    return deferred.promise;
  };

  fac.cleanCategory = function(categoryArray) {
    $.each(categoryArray, function (index, catObj) {
      catObj.name = catObj.name.replace("&amp;","&");
      console.log(catObj);
      if(catObj.children.length) {
        $.each(catObj.children, function (index, subObj) {
          subObj.name = subObj.name.replace("&amp;","&");
        });
      }
    });
    return categoryArray;
  };

  fac.setDayColors = function () {
    var colors = ["#ea493b", "#7fccbd", "#81c256", "#f6d24c",
                  "#9765b8", "#73a6db", "#9e4f64", "#e6b294"];

    var lightercolors = ["#EE6D62", "#99D6CA", "#9ACE78", "#F8DB70",
                         "#AC84C6", "#8FB8E2", "#B17283", "#EBC1A9"];

    var darkercolors = ["#bf544b", "#549f90", "#649543", "#aa964d",
                        "#70478b", "#4b6e93", "#743a4a", "#9f7258"];

    $timeout(function () {
      $(".card-title").each(function(i) {
        this.style.background = colors[i % 8];
      });

      $(".card-wrapper").each(function(i) {
        this.style.borderColor = colors[i % 8];
        this.style['box-shadow'] = '0px 2px 0px 0px' + darkercolors[i % 8];
        //        rgba(175, 136, 114, 1)'
      });

      $(".dayimage-container").each(function(i) {
        this.style['background-color'] = lightercolors[i % 8];
      });
    }, 0, false);

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
