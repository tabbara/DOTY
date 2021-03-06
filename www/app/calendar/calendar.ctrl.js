angular.module('calendarModule')
.controller('calendarCtrl', function ($scope, $rootScope, queryAPI, $q) {

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

    var highlightedDays = [];
    $scope.favoriteDays = [];
    $scope.interestDays = [];
    $scope.calendar.html = '';

    var dayStart = $scope.calendar.date.getDay(),
        dayIterator = 0,
        monthLength = new Date($scope.calendar.year, $scope.calendar.month+1,0).getDate(),
        html = '';

    var tempFirstDay = Math.round(Date.UTC($scope.calendar.year, $scope.calendar.month, 1) / 1000);
    var tempLastDay = Math.round(Date.UTC($scope.calendar.year, $scope.calendar.month, monthLength) / 1000);

    var calendarGetFavorites = function () {
      var deferred = $q.defer();

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
                  highlightedDays.push(daysObject[i].date.getDate());
                }
              }

              if($scope.favoriteDays.length) {
                queryAPI.setDayColors();

                setTimeout( function () {
                  var imagesWrapper = $('#calendar-wrapper');
                  imagesWrapper.imagesLoaded()
                  .progress( onProgress )
                  .always( onAlways );
                }, 0, false);
              }

              deferred.resolve();

            });
          } else {
            console.log('Error retrieving DaysById: ' +data.status.code);
            deferred.resolve();
          }
        }, function (status) {
          console.log(status);
          deferred.resolve();
        });
      } else {
        console.log('no favorites to load in calendar');
        deferred.resolve();
      }

      return deferred.promise;
    }

    var calendarGetInterests = function () {

      var deferred = $q.defer();

      var options = {
        'startDate': tempFirstDay,
        'endDate': tempLastDay
        //      , 'dayGrade': 6
      };

      var tagArray = $rootScope.userData.pc_tags || [];

      if (tagArray.length) {
        options.tagArray = tagArray;

        // add daygrade flag when content has been filled with daygrades properly

        queryAPI.getDayByDate(options)
        .then(function(data) {
          if (data.status.code === 100) {
            queryAPI.cleanDay(data.result)
            .then(function (daysObject) {
              var daysObject = daysObject.sort(function(a,b) { return b.grade - a.grade });
              $scope.interestDays = daysObject.slice(0, 5);
              $scope.interestDays = $scope.interestDays.sort(function (a,b) { return (a.date > b.date) ? 1 : -1 });

              for (var i=0; i<$scope.interestDays.length; i++) {
                highlightedDays.push($scope.interestDays[i].date.getDate());
                //                console.log(highlightedDays);
                console.log('placing', $scope.interestDays[i].date.getDate());
              }

              queryAPI.setDayColors();

              setTimeout( function () {
                var imagesWrapper = $('#calendar-wrapper');
                imagesWrapper.imagesLoaded()
                .progress( onProgress )
                .always( onAlways );
              }, 0, false);

              deferred.resolve();
            });
          } else {
            console.log(data.status.code);
            deferred.resolve();
          }
        }, function (status) {
          console.log(status);
          deferred.resolve();
        });
      } else {
        deferred.resolve();
      }
      console.log('no interest tags to load in calendar');
      return deferred.promise;
    }

//    var prom1 = calendarGetFavorites();
//    var prom2 = calendarGetInterests();

    $q.all([calendarGetFavorites(), calendarGetInterests()]).then(function(){

      for (var w_row = 0; dayIterator-dayStart < monthLength; w_row++) {

        html = html + "<div class='calendar-row'>"

        for (var w_col = 0; w_col < 7; w_col++) {

          var isToday = (dayIterator-dayStart+1) === currentDate.getDate() && $scope.calendar.year === currentDate.getFullYear() && $scope.calendar.month === currentDate.getMonth();

          var isBirthday = birthDay != -1 ? (dayIterator-dayStart+1) === birthDay.getDate() && $scope.calendar.month === birthDay.getMonth() : 0;

          var isHighlighted = highlightedDays.indexOf(dayIterator-dayStart+1);

          if (isToday || isBirthday || isHighlighted != -1) {
            var cellClasses = 'calendar-col-today';
          } else { var cellClasses = ''; }

          if (dayIterator < dayStart) {
            html = html + "<div class='calendar-col " + cellClasses + "'></div>"
          } else {
            if (dayIterator-dayStart > monthLength-1) {
              html = html + "<div class='calendar-col " + cellClasses + "'></div>"
            } else {
              var tempDate = new Date(Date.UTC($scope.calendar.year,$scope.calendar.month, dayIterator-dayStart+1));
              html = html + "<div class='calendar-col " + cellClasses +"'> <a href='#/date/:" + Math.round(tempDate.getTime()/1000) + "'>" + (dayIterator-dayStart+1) + "</a></div>";

            }
          }

          ++dayIterator;
        }

        html = html + "</div>"
      }

      $scope.calendar.html = html;
    });
  }

  $scope.buildCalendar();

});
