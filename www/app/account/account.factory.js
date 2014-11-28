angular.module("accountModule")
.factory('signinFac', function($rootScope, $ionicModal) {
  var fac = {};

  var signedIn = false; //

  fac.checkSignin = function() {
    if(signedIn) {
      console.log('LOGGED IN!');
      fac.signinModalClose();
    } else {
      console.log('NOT LOGGED IN!');
      fac.signinModalOpen();
    }
  }

  fac.signin = function() {
    signedIn = true;
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
