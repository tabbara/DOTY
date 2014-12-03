angular.module("accountModule")
.controller('signinController', function($rootScope,
                                          $scope,
                                          signinFac,
                                          $timeout,
                                          $ionicActionSheet) {

  $scope.signin = function() { //FORM SUBMIT SIGNIN
    var signinFormData = {
      email: $scope.signinData.signinEmail,
      pw: $scope.signinData.signinPassword
    };
    console.log("signing in email: " + signinFormData.email + ' with pw: ' + signinFormData.pw);

    signinFac.signin(signinFormData.email, signinFormData.pw)
    .then(function(status) {
      console.log(status);

      $rootScope.userSession = {
        signedIn: true
      };

      signinFac.signinModalClose();

      signinFac.getUserData(signinFormData.email)
      .then(function(userData){
        // got user data;
        $rootScope.userData = userData;
        var loginSuccessSheet = $ionicActionSheet.show({
          titleText: 'Hi ' + userData.firstname +"! You're now logged in",
        });

        $timeout(function() {
          loginSuccessSheet();
        }, 2500);

      }, function(status){
        console.log(status);
      });
    }, function(status) {
      console.log(status);
      alert("Please check your email and password were entered correctly and try again");
    });
  }

  $scope.logout = function() {
    signinFac.logout();
  }

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

})
.controller('accountmodalController', function($ionicModal) {

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
