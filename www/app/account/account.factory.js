angular.module("accountModule")
.factory('signinFac', function($rootScope, $q, $http, $state, $ionicModal, $timeout, $ionicActionSheet) {
  var fac = {};

  fac.showIntroductionBroadcast = function (show) {
    $rootScope.$broadcast('showIntroductionHandle', show);
  };

  fac.signin = function(userEmail, userPassword) {
    var deferred = $q.defer();
    console.log("signing in email: " + userEmail + ' with pw: ' + userPassword);
    var timeNonce = new Date().getTime();

    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/api/1.5/users/?login&email=' + userEmail + '&password=' + userPassword + '&throwaway=' + timeNonce
    }).
    success(function(data, status, headers) {
      console.log("login query went through", status, data)
      //      console.log({'a': headers()});

      if(data.status.code === 100) {
        $rootScope.userSession.signedIn = true;
        fac.userSaveCredentials(userEmail, userPassword);

        fac.getUserData(userEmail)
        .then(function(userData) {
          $rootScope.userData = userData;
          deferred.resolve("succesful login & data retrieval");

          //          var loginSuccessSheet = $ionicActionSheet.show({
          //            titleText: 'Hi ' + userData.firstname +"! You're now logged in",
          //          });
          //
          //          $timeout(function() {
          //            loginSuccessSheet();
          //          }, 2500);

        }, function(status) {
          deferred.resolve("succesful login, automatic data retrieval failed");
          console.log(status);
        });

      } else {
        $rootScope.userSession.signedIn = false;
        fac.removeCredentials();
        deferred.reject("wrong email or password");
      }
    }).
    error(function(data, status) {
      $rootScope.userSession.signedIn = false;
      deferred.reject("login query failed, server down?");
    });

    return deferred.promise;
  };

  fac.signup = function(signupFormData) {
    var deferred = $q.defer();
    console.log("signing up new user with email: " + signupFormData.email + ' with pw: ' + signupFormData.pw);

    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/api/1.5/users/?register&user_email=' + signupFormData.email + '&password=' + signupFormData.pw
    }).
    success(function(data, status) {
      console.log("signup query went through", status, data)

      if(data.status.code === 100) {
        $rootScope.userData.id = data.result.id;
        deferred.resolve("succesful signup, new user id: " + data.result.id);
      } else {
        if(data.status.code === 302) {
          deferred.reject(302, "signup failed (302) user already exists");
        } else {
          deferred.reject(-1, "signup failed, unknown status code");
        }
      }

    }).
    error(function(data, status) {
      deferred.reject(-1, "signup query failed, server down?");
    });

    return deferred.promise;
  };

  fac.signupExtra = function(signupExtraFormData) {
    fac.updateProfile(signupExtraFormData)
    .then(function (status) {
      console.log(status);
      fac.getUserData($rootScope.userData.email)
      .then(function (userData) {
        $rootScope.userData = userData;
      }, function (status) {
        console.log(status);
      });
    }, function (status) {
      console.log(status);
    });
  };

  fac.getUserData = function(userEmail) {
    var deferred = $q.defer();
    console.log("grabbing user data for: " + userEmail);
    var timeNonce = new Date().getTime();

    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/api/1.5/users/?get_user_data=' + userEmail + '&throwaway=' + timeNonce
      //      ,
      //      withCredentials: true,
      //      headers: {
      //        'Cache-Control': 'no-cache'
      //      }
    }).
    success(function(data, status, headers) {
      console.log("user data query went through");
      //      console.log({'a': headers()});
      if(data.status.code === 100) {

        var logThis = {
          firstname: data.result.name_first,
          lastname: data.result.name_last,
          id: data.result.id,
          email: data.result.email,
          dob: data.result.dob, // still a string
          permissions: data.result.permissions
        };

        if (logThis.permissions.hasOwnProperty('email_newsletter')) {
          logThis.permissions.email_newsletter = logThis.permissions.email_newsletter == 'true';
        }

        if (data.result.bookmarks.hasOwnProperty("tags")) {
          if (data.result.bookmarks.tags.length > 0) {
            logThis.pc_tags = data.result.bookmarks.tags;
          } else {
            logThis.pc_tags = [];
          }
        } else { logThis.pc_tags = []; }

        if (data.result.bookmarks.hasOwnProperty("days")) {
          if (data.result.bookmarks.days.length > 0) {
            logThis.pc_days = data.result.bookmarks.days;
          } else {
            logThis.pc_days = [];
          }
        } else { logThis.pc_days = []; }

        console.log(logThis);
        console.log("succesful user data query");
        deferred.resolve(logThis);
      } else {
        fac.removeCredentials();
        deferred.reject("user data query error, login credentials wrong?");
      }
    }).
    error(function(data, status) {
      deferred.reject("user data query failed");
    });

    return deferred.promise;
  };

  fac.logout = function() {
    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/api/1.5/users/?logout'
    }).then(function() {
      fac.userRemoveData();
      fac.removeCredentials();
      $rootScope.userSession.signedIn = false;
      $state.go('/');
      //      fac.signinModalOpen();
    });
  };

  fac.updateProfile = function (profileData) {
    var deferred = $q.defer();

    if (profileData) {
      var logThis = "Updating profile of " + $rootScope.userData.email + " with data: ";
      logThis = logThis + JSON.stringify(profileData);
      console.log(logThis);

      var updateUrl = 'https://www.daysoftheyear.com/api/1.5/users/?update&user_id=' + $rootScope.userData.id;

      if (profileData.hasOwnProperty('dob')) {
        updateUrl = updateUrl + '&dob=' + profileData.dob;
      };

      if (profileData.hasOwnProperty('firstname')) {
        updateUrl = updateUrl + '&name_first=' + profileData.firstname;
      };

      if (profileData.hasOwnProperty('lastname')) {
        updateUrl = updateUrl + '&name_last=' + profileData.lastname;
      };

      $http({
        method: 'GET',
        url: updateUrl
      }).
      success(function(data, status) {
        console.log("profile update query went through", status, data);
        if(data.status.code === 100) {
          deferred.resolve("succesful profile update");
        } else {
          deferred.reject("profile update error, login credentials wrong?");
        }
      }).
      error(function(data, status) {
        deferred.reject("profile update query failed");
      });
    } else {
      deferred.reject("no profiledata passed to update function");
    };

    return deferred.promise;
  };

  fac.updatePermissions = function (permissionsData) {
    var deferred = $q.defer();

    if (permissionsData) {
      var logThis = "Updating permissions of " + $rootScope.userData.email + " with data: ";
      logThis = logThis + JSON.stringify(permissionsData);
      console.log(logThis);

      var updateUrl = 'https://www.daysoftheyear.com/api/1.5/users/?permissions&user_id=' + $rootScope.userData.email;

      if (permissionsData.hasOwnProperty('subscribed')) {
        updateUrl = updateUrl + '&subscribed=' + permissionsData.subscribed;
      };

      if (permissionsData.hasOwnProperty('email_newsletter')) {
        updateUrl = updateUrl + '&email_newsletter=' + permissionsData.email_newsletter;
      };

      $http({
        method: 'GET',
        url: updateUrl
      }).
      success(function(data, status) {
        console.log("permissions update query went through", status, data);
        if(data.status.code === 100) {
          deferred.resolve("succesful permissions update");
        } else {
          deferred.reject("permissions update error, login credentials wrong?");
        }
      }).
      error(function(data, status) {
        deferred.reject("permissions update query failed");
      });
    } else {
      deferred.reject("no permissionsdata passed to update function");
    };

    return deferred.promise;
  };

  fac.updateBookmarks = function (bookmarkData) {
    var deferred = $q.defer();

    if (bookmarkData) {
      var logThis = "Updating bookmarks of " + $rootScope.userData.email + " with data: ";
      logThis = logThis + JSON.stringify(bookmarkData);
      console.log(logThis);

      var updateUrl = 'https://www.daysoftheyear.com/api/1.5/users/?bookmarks&user_id=' + $rootScope.userData.id +'&type=' + bookmarkData.type;

      if (bookmarkData.add) {
        updateUrl = updateUrl + '&add=' + bookmarkData.add.valueOf();
      }

      if (bookmarkData.remove) {
        updateUrl = updateUrl + '&remove=' + bookmarkData.remove.valueOf();
      }

      $http({
        method: 'GET',
        url: updateUrl
//        ,
//        withCredentials: true
      }).
      success(function(data, status) {
        console.log("bookmarks update query went through", status, data);
        if(data.status.code === 100) {
          deferred.resolve("succesful bookmarks update");
        } else {
          deferred.reject("profile bookmarks error, login credentials wrong?");
        }
      }).
      error(function(data, status) {
        deferred.reject("bookmarks update query failed");
      });
    } else {
      deferred.reject("no bookmark data passed to update function");
    };

    return deferred.promise;
  };

  fac.userRemoveData = function () {
    $rootScope.userData = {
      firstname: "",
      lastname: "",
      dob: null,
      email: "",
      id: 0,
      pc_days: [],
      pc_tags: [],
      permissions: {}
    };
  };

  fac.userSaveCredentials = function (userEmail, userPassword) {
    console.log("saving login credentials: " + userEmail + " / " + userPassword);
    localStorage["userData"] = JSON.stringify({
      'user': userEmail,
      'pw': userPassword
    })
  };

  fac.removeCredentials = function () {
    console.log("removing local login credentials");
    localStorage.removeItem('userData');
  };

  fac.checkSignin = function() {
    var deferred = $q.defer();

    if($rootScope.userSession.signedIn) {
      deferred.resolve('check signin: already logged in!');
    } else {
      console.log('check signin: not logged in!');
      var getStorage = localStorage["userData"];
      if(getStorage) {
        console.log("check local credentials: credentials found");
        getStorage = JSON.parse(getStorage);

        var userStored = getStorage.user, pwStored = getStorage.pw;
        console.log('Trying login with local creds- user: ' + userStored + ' pw: ' + pwStored);

        fac.signin(userStored, pwStored)
        .then(function(status) {
          deferred.resolve(status);
        }, function(status) {
          deferred.reject(status);
        });

      } else {
        deferred.reject("check local credentials: no credentials found, show login form");
      }
    }

    return deferred.promise;
  }

  $ionicModal.fromTemplateUrl('modals/signinModal.html', {
    scope: $rootScope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    fac.signinModal = modal;
  });
  fac.signinModalOpen = function() {
    fac.signinModal.show();
    console.log('Opening signin modal');
  };
  fac.signinModalClose = function() {
    fac.signinModal.hide();
    console.log('Closing signin modal');
  };
  //Cleanup the modal when we're done with it!
  $rootScope.$on('$destroy', function() {
    fac.signinModal.remove();
    console.log('Destroying In Modal');
  });

  $ionicModal.fromTemplateUrl('modals/signupModal.html', {
    scope: $rootScope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    fac.signupModal = modal;
  });
  fac.signupModalOpen = function() {
    fac.signupModal.show();
    console.log('Opening signup modal');
  };
  fac.signupModalClose = function() {
    fac.signupModal.hide();
    console.log('Closing signup modal');
  };
  //Cleanup the modal when we're done with it!
  $rootScope.$on('$destroy', function() {
    fac.signupModal.remove();
    console.log('Destroying Up Modal');
  });

  $ionicModal.fromTemplateUrl('modals/signupExtraModal.html', {
    scope: $rootScope,
    animation: 'slide-in-up',
    backdropClickToClose: true,
    hardwareBackButtonClose: true
  }).then(function(modal) {
    fac.signupExtraModal = modal;
  });
  fac.signupExtraModalOpen = function() {
    fac.signupExtraModal.show();
    console.log('Opening signup-extra modal');
  };
  fac.signupExtraModalClose = function() {
    fac.signupExtraModal.hide();
    console.log('Closing signup-extra modal');
  };
  //Cleanup the modal when we're done with it!
  $rootScope.$on('$destroy', function() {
    fac.signupExtraModal.remove();
    console.log('Destroying UpExtra Modal');
  });

  return fac;
});
