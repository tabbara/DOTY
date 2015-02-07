angular.module('searchpageModule')
.controller('searchpageCtrl', function ($scope, queryAPI, $rootScope) {

  function onAlways () {
    console.log('finished loading images');
  }

  function onProgress (imgLoad, image) {
    console.log('loaded: ' + image.img.src);
    var $imageEl = $(image.img).parent();
    $imageEl.removeClass('image-loading');
    $imageEl.children(".spinner-animation").remove();
  }

  $scope.data = {
    'searchQuery': ''
  };

  $scope.days = [];

  $scope.madeSearch = {
    'found': false,
    'finished': false,
    'started': false,
    'results': 0,
    'showing': 0,
    'offset': 0,
    'findingmore': false
  };

  $scope.search = function () {
    if($scope.data.searchQuery !== '') {
      $scope.madeSearch.found = false;
      $scope.madeSearch.finished = false;
      $scope.madeSearch.started = true;
      $scope.madeSearch.results = 0;
      $scope.madeSearch.showing = 0;
      $scope.madeSearch.offset = 0;
      $scope.madeSearch.findingmore = false;

      //FORM SUBMIT SEARCH
      queryAPI.getDayBySearch($scope.data.searchQuery, $scope.madeSearch.offset)
      .then(function (data) {
        if(data.status.code === 100) {
          $scope.madeSearch.results = data.meta.results_total;
          $scope.madeSearch.showing = Math.min(10,data.meta.results_total);
          if(data.meta.results_total === 0) {
            console.log('no results found for: ' + $scope.data.searchQuery);
            $scope.days = [];
            $scope.madeSearch.found = false;
            $scope.madeSearch.finished = true;
          } else {
            queryAPI.cleanDay(data.result)
            .then(function (daysObject) {
              $scope.days = daysObject;
              queryAPI.setDayColors();

              setTimeout( function () {
                var imagesWrapper = $('#searchpage-wrapper');
                imagesWrapper.imagesLoaded()
                .progress( onProgress )
                .always( onAlways );
              }, 0, false);

              $scope.madeSearch.found = true;
              $scope.madeSearch.finished = true;
            });
          }
        } else {
          if(data.status.code === 901) {
            console.log("no results found for" + $scope.data.searchQuery);
            $scope.days = [];
            $scope.madeSearch.found = false;
            $scope.madeSearch.finished = true;
          } else {
            if(data.status.code === 304) {
              console.log("user not logged in");
              $scope.days = [];
              $scope.madeSearch.found = false;
              $scope.madeSearch.finished = true;
            };
          }
        }
      }, function (status) {
        console.log(status);
        $scope.madeSearch.found = false;
        $scope.madeSearch.finished = true;
      });
    }
  };

  $scope.showMore = function () {
    if (!$scope.madeSearch.findingMore) {
      $scope.madeSearch.findingMore = true;
      $scope.madeSearch.offset += 10;

      queryAPI.getDayBySearch($scope.data.searchQuery, $scope.madeSearch.offset)
      .then(function (data) {
        if(data.status.code === 100) {
          $scope.madeSearch.showing = Math.min($scope.madeSearch.offset+10,data.meta.results_total);
          if(data.meta.results_total === 0) {
            console.log('no results found for: ' + $scope.data.searchQuery);
          } else {
            queryAPI.cleanDay(data.result)
            .then(function (daysObject) {
              $scope.days = $scope.days.concat(daysObject);
              queryAPI.setDayColors();

              setTimeout( function () {
                var imagesWrapper = $('#searchpage-wrapper');
                imagesWrapper.imagesLoaded()
                .progress( onProgress )
                .always( onAlways );
              }, 0, false);

            });
          }
        } else {
          if(data.status.code === 901) {
            console.log("no results found for" + $scope.data.searchQuery);
          } else {
            if(data.status.code === 304) {
              console.log("user not logged in");
            };
          }
        }
        $scope.madeSearch.findingMore = false;
      }, function (status) {
        $scope.madeSearch.offset -= 10;
        console.log(status);
        $scope.madeSearch.findingMore = false;
      });
    };
  }

});
