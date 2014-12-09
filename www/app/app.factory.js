angular.module("dotyApp")
.factory('queryAPI', function($http) {
  var fac = {};

  fac.getDayToday = function() {

    var todayDate = new Date();
    var today = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) / 1000;

    console.log("grabbing: https://www.daysoftheyear.com/app/days/?date_start="
                     + today +"&date_end=" + today + "&limit=100");

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
