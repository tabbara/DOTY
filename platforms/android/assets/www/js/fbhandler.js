// Defaults to sessionStorage for storing the Facebook token
openFB.init({appId: '713826502040102'});
//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

app.factory('fbAPI', function() {
    var fac = {};

    fac.login = function (callback) {
        var callback = callback || function (){};
        openFB.login(
            function(response) {
                if(response.status === 'connected') {
                    console.log('login succeeded, got access token: ' + response.authResponse.token);
                    callback();
                } else {
                    console.log('login failed: ' + response.error);
                }
            }, {scope: 'publish_stream'});
    }

    fac.getInfo = function () {
        return openFB.api({
            path: '/me'
        });
    }

    fac.share = function () {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: document.getElementById('Message').value || 'Testing Facebook APIs'
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: fac.errorHandler});

    }

    fac.revoke = function() {
        openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                },
                fac.errorHandler);
    }

    fac.logout = function (callback) {
        var callback = callback || function (){};
        openFB.logout(
                function() {
                    console.log('Logout successful');
                    callback();
                },
                fac.errorHandler);
    }

    fac.errorHandler = function (error) {
        alert(error.message);
    }

    return fac;
});
