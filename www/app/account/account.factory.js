angular.module("accountModule")
.factory('signinFac', function($rootScope, $q, $http, $ionicModal) {
  var fac = {};

  //  localStorage["userData"] = JSON.stringify({
  //    'user': 'app_test_user@doty.com',
  //    'pw': 'app_test_pw_123'
  //  })

  fac.signin = function(userEmail, userPassword) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/app/user/?login&user_email='+userEmail+'&password='+userPassword
    }).
    success(function(data, status) {
      console.log("login query went through", status, data)
      if(data.meta.status === "success") {
        deferred.resolve("succesful login");
      } else {
        localStorage.removeItem('userData'); // removed faulty saved credentials
        deferred.reject("wrong email or password");
      }
    }).
    error(function(data, status) {
      deferred.reject("login query failed, server down?");
    });

    return deferred.promise;
  }

  fac.getUserData = function(userEmail) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'https://www.daysoftheyear.com/app/user/?get_user_data='+userEmail,
      withCredentials: true
    }).
    success(function(data, status) {
      console.log("user data query went through", status, data);
      if(data.meta.status === "success") {
        console.log("succesful user data query");
        deferred.resolve({
          firstname: data.result.name.firstname,
          lastname: data.result.name.lastname,
          id: data.result.id,
          email: data.result.email,
          dob: data.result.dob
        });
      } else {
        deferred.reject("user data query error, login credentials wrong?");
      }
    }).
    error(function(data, status) {
      deferred.reject("user data query failed");
    });

    return deferred.promise;
  }

  //  var getStorage = localStorage["userData"];
  //  if(getStorage){
  //    getStorage = JSON.parse(getStorage);
  //    var userStored = getStorage.user;
  //    var pwStored = getStorage.pw;
  //
  //    console.log('Trying login with: ', userStored, pwStored);
  //
  //    fac.signin(userStored, pwStored)
  //    .then(function(status) {
  //    console.log(status);
  //      fac.getUserData(userStored)
  //      .then(function(userData){
  //        $rootScope.userData = userData;
  //      },function(status){
  //        console.log(status);
  //      });
  //    }, function(status) {
  //      // eror with signin
  //    });
  //
  //  } else {
  //
  //  }

  fac.checkSignin = function() {
    if($rootScope.userSession.signedIn) {
      console.log('LOGGED IN!');
      fac.signinModalClose();
    } else {
      console.log('NOT LOGGED IN!');
      fac.signinModalOpen();
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
    console.log('Opening In Modal');
  };
  fac.signinModalClose = function() {
    fac.signinModal.hide();
    console.log('Closing In Modal');
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
    console.log('Opening Up Modal');
  };
  fac.signupModalClose = function() {
    fac.signupModal.hide();
    console.log('Closing Up Modal');
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
    console.log('Opening UpExtra Modal');
  };
  fac.signupExtraModalClose = function() {
    fac.signupExtraModal.hide();
    console.log('Closing UpExtra Modal');
  };
  //Cleanup the modal when we're done with it!
  $rootScope.$on('$destroy', function() {
    fac.signupExtraModal.remove();
    console.log('Destroying UpExtra Modal');
  });

  return fac;
});
