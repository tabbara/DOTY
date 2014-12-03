angular.module("dotyApp")
.factory('queryAPI', function($http) {
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
