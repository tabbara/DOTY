angular.module("accountModule")
.controller('signinController', function($scope, signinFac, $timeout) {

  this.signinData = {};

//  this.signinn = function() {
//    console.log('log in attempt');
//  };

  $scope.signin = function(){
    signinFac.signin();
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
