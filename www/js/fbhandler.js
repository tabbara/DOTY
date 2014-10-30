// Defaults to sessionStorage for storing the Facebook token
openFB.init({appId: '713826502040102'});
//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});
function login() {
    openFB.login(
            function(response) {
                if(response.status === 'connected') {
                    alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
                } else {
                    alert('Facebook login failed: ' + response.error);
                }
            }, {scope: 'email,read_stream,publish_stream'});
}
function getInfo() {
    openFB.api({
        path: '/me',
        success: function(data) {
            console.log(JSON.stringify(data));
            document.getElementById("userName").innerHTML = data.name;
            document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
        },
        error: errorHandler});
}
function share() {
    openFB.api({
        method: 'POST',
        path: '/me/feed',
        params: {
            message: document.getElementById('Message').value || 'Testing Facebook APIs'
        },
        success: function() {
            alert('the item was posted on Facebook');
        },
        error: errorHandler});
}
function revoke() {
    openFB.revokePermissions(
            function() {
                alert('Permissions revoked');
            },
            errorHandler);
}
function logout() {
    openFB.logout(
            function() {
                alert('Logout successful');
            },
            errorHandler);
}
function errorHandler(error) {
    alert(error.message);
}
