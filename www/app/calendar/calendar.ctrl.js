angular.module('calendarModule')
.controller('calendarCtrl', function ($scope, $rootScope, queryAPI) {

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
  } else { var birthDay = -1;}

  function onAlways () {
    console.log('finished loading images');
  }

  function onProgress (imgLoad, image) {
    //    console.log('loaded: ' + image.img.src);
    var $imageEl = $(image.img).parent();
    $imageEl.removeClass('image-loading');
    $imageEl.children(".spinner-animation").remove();
  }

  $scope.buildCalendar = function () {
    console.log('building calendar');

    var dayStart = $scope.calendar.date.getDay(),
        dayIterator = 0,
        monthLength = new Date($scope.calendar.year, $scope.calendar.month+1,0).getDate(),
        html = '';

    var tempFirstDay = Math.round(Date.UTC($scope.calendar.year, $scope.calendar.month, 1) / 1000);
    var tempLastDay = Math.round(Date.UTC($scope.calendar.year, $scope.calendar.month, monthLength) / 1000);

    console.log(tempFirstDay,tempLastDay);

    $scope.favoriteDays = [];

    var idArray = $rootScope.userData.pc_days || [];

    if (idArray.length) {
      queryAPI.getDayById({'idArray': idArray})
//      'startDate': tempFirstDay, 'endDate': tempLastDay,
      .then(function(data) {
        if (data.status.code === 100) {
          queryAPI.cleanDay(data.result)
          .then(function (daysObject) {

            for (var i=0; i < daysObject.length; i++) {
              var happeningThisMonth = 0;

              for (var ii = 0; ii < daysObject[i].dates.length; ii++) {
                var timestampInt = parseInt(daysObject[i].dates[ii]);
                if (timestampInt >= tempFirstDay && timestampInt <= tempLastDay) {
                  happeningThisMonth = 1;
                }
              }

              if (happeningThisMonth) {
                $scope.favoriteDays.push(daysObject[i]);
              }
            }

            console.log($scope.favoriteDays);

            if($scope.favoriteDays.length) {
              queryAPI.setDayColors();

              setTimeout( function () {
                var imagesWrapper = $('#calendar-wrapper');
                imagesWrapper.imagesLoaded()
                .progress( onProgress )
                .always( onAlways );
              }, 0, false);
            }

          });
        } else {
          console.log('Error retrieving DaysById: ' +data.status.code);
        }
      }, function (status) {
        console.log(status);
      });
    } else {
      console.log('no favorites to load in calendar');
    }

    var options = {
      'startDate': tempFirstDay,
      'endDate': tempLastDay,
      'dayGrade': 6
    };

    var tagArray = $rootScope.userData.pc_tags || [];
    if (tagArray.length) {
      options.tagArray = tagArray;


      $scope.interestDays = [];

      // add daygrade flag when content has been filled with daygrades properly

      queryAPI.getDayByDate(options)
      .then(function(data) {
        if (data.status.code === 100) {
          queryAPI.cleanDay(data.result)
          .then(function (daysObject) {
            $scope.interestDays = daysObject;

            queryAPI.setDayColors();

            setTimeout( function () {
              var imagesWrapper = $('#calendar-wrapper');
              imagesWrapper.imagesLoaded()
              .progress( onProgress )
              .always( onAlways );
            }, 0, false);

          });
        } else {
          console.log(data.status.code);
        }
      }, function (status) {
        console.log(status);
      });
    }

    //    var percentageClass = '';
    //    var rowNumber = Math.ceil((dayStart+monthLength) / 7);
    //    if (rowNumber === 4) { var percentageClass = "row-four" }
    //    if (rowNumber === 5) { var percentageClass = "row-five" }
    //    if (rowNumber === 6) { var percentageClass = "row-six" }

    for (var w_row = 0; dayIterator-dayStart < monthLength; w_row++) {

      //      html = html + "<div class='row calendar-row " + percentageClass + "'>"
      html = html + "<div class='calendar-row'>"

      for (var w_col = 0; w_col < 7; w_col++) {

        var isToday = (dayIterator-dayStart+1) === currentDate.getDate() && $scope.calendar.year === currentDate.getFullYear() && $scope.calendar.month === currentDate.getMonth();

        var isBirthday = birthDay != -1 ? (dayIterator-dayStart+1) === birthDay.getDate() && $scope.calendar.month === birthDay.getMonth() : 0;

        //        console.log(isBirthday);
        //        if (isBirthday) {console.log(birthDay.getDate());}

        if (isToday || isBirthday) {
          var cellClasses = 'calendar-col-today';
        } else { var cellClasses = ''; }

        if (dayIterator < dayStart) {
          html = html + "<div class='calendar-col " + cellClasses + "'></div>"
        } else {
          if (dayIterator-dayStart > monthLength-1) {
            html = html + "<div class='calendar-col " + cellClasses + "'></div>"
          } else {
            var tempDate = new Date(Date.UTC($scope.calendar.year,$scope.calendar.month, dayIterator-dayStart+1));
            html = html + "<div class='calendar-col " + cellClasses +"'> <a href='#/date/:" + Math.round(tempDate.getTime()/1000) + "'>" + (dayIterator-dayStart+1) + "</a></div>"
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
