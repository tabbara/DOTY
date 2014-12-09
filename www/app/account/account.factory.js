angular.module("accountModule")
.factory('signinFac', function($rootScope, $q, $http, $ionicModal, $timeout, $ionicActionSheet) {
  var fac = {};

  fac.signin = function(userEmail, userPassword) {
    var deferred = $q.defer();
    console.log("signing in email: " + userEmail + ' with pw: ' + userPassword);

    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/app/user/?login&user_email=' + userEmail + '&password=' + userPassword
    }).
    success(function(data, status) {
      console.log("login query went through", status, data)
      if(data.meta.status === "success") {
        $rootScope.userSession.signedIn = true;
        fac.userSaveCredentials(userEmail, userPassword);

        fac.getUserData(userEmail)
        .then(function(userData) {
          deferred.resolve("succesful login");
          $rootScope.userData = userData;

          //          var loginSuccessSheet = $ionicActionSheet.show({
          //            titleText: 'Hi ' + userData.firstname +"! You're now logged in",
          //          });
          //
          //          $timeout(function() {
          //            loginSuccessSheet();
          //          }, 2500);

        }, function(status) {
          deferred.resolve("succesful login");
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
      url: 'https://www.daysoftheyear.com/app/user/?register&user_email=' + signupFormData.email + '&password=' + signupFormData.pw
    }).
    success(function(data, status) {
      console.log("signup query went through", status, data)
      if(data.meta.status === "success") {
        $rootScope.userData.id = data.result.id;
        console.log($rootScope.userData.id);
        deferred.resolve("succesful signup");
      } else {
        deferred.reject("signup failed, user likely already exists, need error codes");
      }
    }).
    error(function(data, status) {
      deferred.reject("signup query failed, server down?");
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
      url: 'https://www.daysoftheyear.com/app/user/?get_user_data='+userEmail + '&throwaway=' + timeNonce,
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).
    success(function(data, status, headers) {
      console.log("user data query went through");
      console.log(headers());
      if(data.meta.status === "success") {

        var logThis = {
          firstname: data.result.name.firstname,
          lastname: data.result.name.lastname,
          id: data.result.id,
          email: data.result.email,
          dob: data.result.dob
        };

        console.log("succesful user data query" + JSON.stringify(logThis) + " and " + JSON.stringify(data) + " and status of " + status);

        deferred.resolve({
          firstname: data.result.name.firstname,
          lastname: data.result.name.lastname,
          id: data.result.id,
          email: data.result.email,
          dob: data.result.dob
          // add permissions
        });
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
      url: 'https://www.daysoftheyear.com/app/user/?logout'
    }).then(function() {
      fac.userRemoveData();
      fac.removeCredentials();
      fac.signinModalOpen();
    });
  };

  fac.updateProfile = function (profileData) {
    var deferred = $q.defer();

    if (profileData) {
      var logThis = "Updating profile of " + $rootScope.userData.email + " with data: ";
      logThis = logThis + JSON.stringify(profileData);
      console.log(logThis);

      var updateUrl = 'https://www.daysoftheyear.com/app/user/?update&user_id=' + $rootScope.userData.id;

      if (profileData.dob) {
        //updateUrl = updateUrl + '&dob=' + profileData.dob; figure out date format
        console.log(profileData.dob);
      };

      if (profileData.firstname) {
        updateUrl = updateUrl + '&firstname=' + profileData.firstname;
      };

      if (profileData.lastname) {
        updateUrl = updateUrl + '&lastname=' + profileData.lastname;
      };

      $http({
        method: 'GET',
        url: updateUrl,
        withCredentials: true
      }).
      success(function(data, status) {
        console.log("profile update query went through", status, data);
        if(data.meta.status === "success") {
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

  fac.userRemoveData = function () {
    $rootScope.userData = {
      firstname: "",
      lastname: "",
      dob: 0,
      email: "",
      id: 0
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
    if($rootScope.userSession.signedIn) {
      console.log('check signin: already logged in!');
      fac.signinModalClose();
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
          console.log(status);
          fac.signinModalClose();
        }, function(status) {
          console.log(status);
          fac.signinModalOpen();
        });

      } else {
        console.log("check local credentials: no credentials found, show login form");
        fac.signinModalOpen();
      }
    }
  }

  $ionicModal.fromTemplateUrl('/modals/signinModal.html', {
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

  $ionicModal.fromTemplateUrl('../../modals/signupModal.html', {
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

  $ionicModal.fromTemplateUrl('../../modals/signupExtraModal.html', {
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
