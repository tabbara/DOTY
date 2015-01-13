angular.module('calendarModule')
.controller('calendarCtrl', function ($scope, $rootScope) {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  var currentDate = new Date();
  $scope.calendar = {
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    monthName: monthNames[currentDate.getMonth()],
    date: new Date(currentDate.getFullYear(), currentDate.getMonth())
  };

  $scope.nextMonth = function () {
    $scope.calendar.month = $scope.calendar.month+1;
    if ($scope.calendar.month > 11) {
      $scope.calendar.year = $scope.calendar.year+1;
      $scope.calendar.month = 0;
    }
    $scope.calendar.monthName = monthNames[$scope.calendar.month];
    $scope.calendar.date = new Date($scope.calendar.year, $scope.calendar.month);

    $scope.buildCalendar();
  };

  $scope.previousMonth = function () {
    $scope.calendar.month = $scope.calendar.month-1;
    if ($scope.calendar.month < 0) {
      $scope.calendar.year = $scope.calendar.year-1;
      $scope.calendar.month = 11;
    }
    $scope.calendar.monthName = monthNames[$scope.calendar.month];
    $scope.calendar.date = new Date($scope.calendar.year, $scope.calendar.month);

    $scope.buildCalendar();
  };

  if($rootScope.userData.dob != null) {
    var birthDay = new Date(parseInt($rootScope.userData.dob)*1000);
    console.log ('a', birthDay);
  } else { var birthDay = -1; console.log ('b', birthDay);}

  $scope.buildCalendar = function () {

    var dayStart = $scope.calendar.date.getDay(),
        dayIterator = 0,
        monthLength = new Date($scope.calendar.year, $scope.calendar.month+1,0).getDate(),
        html = '',
        percentageClass = '';

    var rowNumber = Math.ceil((dayStart+monthLength) / 7);
    if (rowNumber === 4) { var percentageClass = "row-four" }
    if (rowNumber === 5) { var percentageClass = "row-five" }
    if (rowNumber === 6) { var percentageClass = "row-six" }

    for (var w_row = 0; dayIterator-dayStart < monthLength; w_row++) {

      html = html + "<div class='row calendar-row " + percentageClass + "'>"

      for (var w_col = 0; w_col < 7; w_col++) {

        var isToday = (dayIterator-dayStart+1) === currentDate.getDate() && $scope.calendar.year === currentDate.getFullYear() && $scope.calendar.month === currentDate.getMonth();

        var isBirthday = birthDay != -1 ? (dayIterator-dayStart+1) === birthDay.getDate() && $scope.calendar.month === birthDay.getMonth() : 0;
        console.log(isBirthday);

        if (isBirthday) {console.log(birthDay.getDate());}

        if (isToday || isBirthday) {
          var cellClasses = 'calender-col-highlighted';
        } else { var cellClasses = ''; }

        if (dayIterator < dayStart) {
          html = html + "<div class='col calendar-col " + cellClasses + "'></div>"
        } else {
          if (dayIterator-dayStart > monthLength-1) {
            html = html + "<div class='col calendar-col " + cellClasses + "'></div>"
          } else {
            var tempDate = new Date(Date.UTC($scope.calendar.year,$scope.calendar.month, dayIterator-dayStart+1));
            html = html + "<div class='col calendar-col " + cellClasses +"'> <a href='#/date/:" + Math.round(tempDate.getTime()/1000) + "'>" + (dayIterator-dayStart+1) + "</a></div>"
          }
        }

        ++dayIterator;
      }

      html = html + "</div>"
    }

//    html.replace("percentageclass"
    $scope.calendar.html = html;
  }

  $scope.buildCalendar();

});
