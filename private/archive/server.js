/**
 * Created by chrisrussi on 7/30/15.
 */
var google, plus, OAuth2, credentials, clientId, clientSecret, redirectUrl, oauth2Client,
    accessToken, refreshToken, calendar;

subscriptions = { };


Meteor.startup(function () {
    console.log('meteor startup');
    credentials = JSON.parse(Assets.getText('client_secret.json'));
    google = Meteor.npmRequire('googleapis');
    plus = google.plus('v1');
    OAuth2 = google.auth.OAuth2;
    clientSecret = credentials.web.client_secret;
    clientId = credentials.web.client_id;
    redirectUrl = credentials.web.redirect_uris[0];
    oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    google.options({ auth: oauth2Client }); // set auth as a global default
});


Meteor.publish('calendar-list', function() {

    // #1 ......
    var subscriptionx = this;
    //var calendars = [];
    //var accessToken = this.user().services.google.accessToken;
    var user = Meteor.users.findOne({_id: this.userId}, {});
    console.log('calendar-list id: ' + subscriptionx._subscriptionId);
    //var accessToken = user.services.google.accessToken;
    var refreshToken = user.services.google.refreshToken;
    //var expiresAt = user.services.google.expiresAt;
    subs[subscriptionx._subscriptionId] = subscriptionx;

    // #2...
    var currentTime = new Date();

    var accessToken = refreshAccessToken2(refreshToken);

    getCalendars(accessToken, refreshToken, function (calendars) {
        subscriptionx.added( 'calendarList', 'b_random_id', { calendars: calendars } );
    });

    // #3...
    subscriptionx.onStop(function() {
        console.log('stop calendar-list id: ' + subscriptionx._subscriptionId);
        delete subs[subscriptionx._subscriptionId];
    });

});


function appendPre(str) {
    console.log(str);
}

/* Get list of user's calendars */
function getCalendars(accessToken, refreshToken, callback) {
    // Retrieve tokens via token exchange explained above or set them:
    //oauth2Client.setCredentials({
    //    access_token: accessToken,
    //    refresh_token: refreshToken,
    //});
    //calendar = google.calendar('v3');
    //var accessTokenString = 'Bearer ' + Meteor.user().services.google.accessToken;
    var accessTokenString = 'Bearer ' + accessToken;

    var calendars = [];
    var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner";
    try {
        HTTP.get(url,
            {
                params: {
                    grant_type : 'refresh_token',
                    refresh_token : refreshToken,
                    client_id : clientId,
                    client_secret : clientSecret,
                    auth: oauth2Client
                }
                ,
                headers: {
                    'Authorization': accessTokenString
                }
            }
            , function(err, resp) {
                if (err) {
                    console.log('err: ' + err);
                } else {
                    console.log('success');
                    calendars = resp.data.items;
                    calendars.map(function(item) {
                        //nextSyncToken
                        console.log(item.summary);
                    })
                }
                callback(calendars);
            });

    } catch(err) {
        console.log(err.message);
    }
}

function refreshAccessToken(refreshToken){

    HTTP.post("https://www.googleapis.com/oauth2/v3/token",
        {
            params: {
                'client_id': clientId,
                'client_secret': clientSecret,
                'refresh_token': refreshToken,
                'grant_type': 'refresh_token'
            }
        },

        function(err, result){
            if (err) {
                console.log('err: ' + err);
            } else {
                console.log('success: ' + result.data.accessToken);
            }
        });
}

function refreshAccessToken2(refreshToken){

    var result = HTTP.post("https://www.googleapis.com/oauth2/v3/token",
        {
            params: {
                'client_id': clientId,
                'client_secret': clientSecret,
                'refresh_token': refreshToken,
                'grant_type': 'refresh_token'
            }
        });
    if (result.statusCode < 300) {
        return result.data.access_token;
    } else {
        return null;
    }
}




