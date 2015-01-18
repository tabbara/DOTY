angular.module("accountModule")
.controller('accountController', function($rootScope,
                                           $scope,
                                           signinFac) {

  if (!$scope.signupData) {
    $scope.signupData = {
      signupNewsletter: true
    }
  }

  $scope.signin = function () { //FORM SUBMIT SIGNIN
    var signinFormData = {
      email: $scope.signinData.signinEmail,
      pw: $scope.signinData.signinPassword
    };

    signinFac.signin(signinFormData.email, signinFormData.pw)
    .then(function(status) {
      console.log(status);
      signinFac.signinModalClose();
      signinFac.showIntroductionBroadcast(false);
    }, function(status) {
      console.log(status);
      alert("Please check your email and password were entered correctly and try again");
    });
  };

  $scope.signup = function () {
    var signupFormData = {
      email: $scope.signupData.signupEmail,
      pw: $scope.signupData.signupPassword,
      dob: Math.round((new Date($scope.signupData.signupDob)).getTime()/1000),
      newsletter: $scope.signupData.signupNewsletter
    };

    console.log(JSON.stringify(signupFormData));

    signinFac.signup(signupFormData)
    .then(function (status) {
      console.log(status);
      signinFac.signin(signupFormData.email, signupFormData.pw)
      .then(function (status) {
        console.log(status);
        signinFac.updateProfile(signupFormData);
      }, function (status) {
        console.log(status);
      });
      $scope.signupModalClose();
      $scope.signupExtraModalOpen();
    }, function (status) {
      console.log(status);
      alert("something went wrong, please try registering again"); // could already be registered, need error code checking
    });
  };

  $scope.signupExtra = function () {
    var signupExtraFormData = {
      firstname: $scope.signupExtraData.signupExtrafirstname,
      lastname: $scope.signupExtraData.signupExtralastname
    };

    console.log("extra signup info: " + JSON.stringify(signupExtraFormData));

    signinFac.signupExtra(signupExtraFormData);

    $scope.signupExtraModalClose();
  };

  $scope.signupExtraSkip = function () {
    $scope.signupExtraModalClose();
  };

  $scope.logout = function() {
    signinFac.logout();
  };

  //Attach factory functions to scope to be called in DOM
  $scope.signinModalOpen = function() {
    signinFac.signinModalOpen();
  };

  $scope.signinModalClose = function() {
    signinFac.signinModalClose();
  };

  $scope.signupModalOpen = function() {
    signinFac.signupModalOpen();
  };

  $scope.signupModalClose = function() {
    signinFac.signupModalClose();
  };

  $scope.signupExtraModalOpen = function() {
    signinFac.signupExtraModalOpen();
  };

  $scope.signupExtraModalClose = function() {
    signinFac.signupExtraModalClose();
  };

});

//app.controller('profileCtrl', function($scope, fbAPI) {
//  var showLoginButton = false;
//
//  $scope.loginButton = function() {
//    showLoginButton = true;
//  }
//
//  $scope.logoutButton = function() {
//    fbAPI.logout(function() {
//      showLoginButton = false;
//      $scope.fbName = "";
//      $scope.fbImage = "";
//    });
//  }
//
//  $scope.loginButtonShow = function() {
//    return showLoginButton;
//  }
//
//  $scope.facebookLogin = function() {
//    fbAPI.login(function (){
//      $scope.facebookGetInfo();
//      $scope.loginButton();
//    });
//  };
//
//  $scope.facebookGetInfo = function() {
//    var request = fbAPI.getInfo(),
//        response;
//
//    request.onreadystatechange = function () {
//
//      if (request.readyState === 4) {
//        if (request.status === 200) {
//          response = JSON.parse(request.responseText);
//          $scope.fbName = response.name;
//          $scope.fbImage = "http://graph.facebook.com/" +
//            response.id + "/picture?type=large";
//          $scope.$apply();
//        } else {
//          console.log("error with login request");
//        }
//      }
//    }
//  };
//
//  //    $scope.facebookGetInfo();
//
//});
