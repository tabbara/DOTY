angular.module('calendarModule')
.controller('calendarCtrl', function ($scope) {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  var currentDate = new Date();
  $scope.calendar = {
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    monthName: monthNames[currentDate.getMonth()],
    date: new Date(currentDate.getFullYear(), currentDate.getMonth())
  };

  console.log($scope.calendar);

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

  $scope.buildCalendar = function () {

    var dayStart = $scope.calendar.date.getDay(),
        dayIterator = 0,
        monthLength = new Date($scope.calendar.year, $scope.calendar.month+1,0).getDate(),
        html = '';
    //    dayStart = 0;


    for (var w_row = 0; dayIterator-dayStart < monthLength; w_row++) {

      html = html + "<div class='row calendar-row'>"

      for (var w_col = 0; w_col < 7; w_col++) {

        var logThis = 'R' + w_row +': '

        if (dayIterator < dayStart) {
          html = html + "<div class='col calendar-col'></div>"
        } else {
          if (dayIterator-dayStart > monthLength-1) {
            html = html + "<div class='col calendar-col'></div>"
          } else {
            html = html + "<div class='col calendar-col'>" + (dayIterator-dayStart+1) + "</div>"
          }
        }

        ++dayIterator;
      }

      html = html + "</div>"
    }

    $scope.calendar.html = html;
  }

  $scope.buildCalendar();

});


//<div class="calendar-box">
//  <div class='row calendar-row'>
//    <div class='col calendar-col'>.col</div>
//    <div class='col calendar-col'>.col</div>
//    <div class='col calendar-col'>.col</div>
//    <div class='col calendar-col'>.col</div>
//    <div class='col calendar-col'>.col</div>
//    <div class='col calendar-col'>.col</div>
//    <div class='col calendar-col'>.col</div>
//  </div>
//</div>
