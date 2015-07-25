var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_PATH = 'google.json';
var TOKEN_DIR = 'tokens/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-api-quickstart.json';
//var googleAuth, readline, fs;
var google, plus, OAuth2, credentials, clientId, clientSecret, redirectUrl, oauth2Client,
    accessToken, refreshToken, calendar;


Meteor.startup(function () {
    console.log('meteor startup');
    //googleAuth = Npm.require('google-auth-library');
    //googleAuth = Meteor.npmRequire('google-auth-library');
    //readline = Meteor.npmRequire('readline');
    //fs = Meteor.npmRequire('fs');
    //console.log('googleAuth: ' + googleAuth);
    credentials = JSON.parse(Assets.getText('client_secret.json'));

    //console.log(credentials);

    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    //authorize(credentials, listEvents);


    google = Meteor.npmRequire('googleapis');
    plus = google.plus('v1');
    OAuth2 = google.auth.OAuth2;
    clientSecret = credentials.web.client_secret;
    clientId = credentials.web.client_id;
    redirectUrl = credentials.web.redirect_uris[0];
    oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    google.options({ auth: oauth2Client }); // set auth as a global default





});

Meteor.methods({
    runtest: function () {
        accessToken = Meteor.user().services.google.accessToken;
        refreshToken = Meteor.user().services.google.refreshToken;

        // Retrieve tokens via token exchange explained above or set them:
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,

        });
        googleProfile();
        processCalendars();
    }
    }

);

function appendPre(str) {
    console.log(str);
}

function googleProfile() {
    //plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
    plus.people.get({ userId: 'me' }, function(err, response) {
        // handle err and response
        if (err) {
            console.log('err: ' + err);
        } else {
            console.log('profile: ' + response.displayName);
        }
    });
}

function processCalendars() {

    getCalendars(function(calendars) {
        if (calendars.length > 0) {
            for (i = 0; i < calendars.length; i++) {
                var calendar = calendars[i];
                //listUpcomingEvents(calendar);
                console.log(calendar.summary);
            }
        } else {
            appendPre('No calendars found.','calendars');
        }

    });

}

/* Get list of user's calendars */
function getCalendars(callback) {
    calendar = google.calendar('v3');
    var accessTokenString = 'Bearer ' + Meteor.user().services.google.accessToken;
    //var request = calendar.calendarList.list({
    //    minAccessRole : 'owner'
    //});
    var calendars = [];
    //request.execute(function(resp) {
    //    calendars = resp.items;
    //    callback(calendars);
    //});

    try {
        HTTP.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
            headers: {
                'Authorization': accessTokenString
            }
        }, function(err, resp) {
            if (err) {
                console.log('err: ' + err);
            } else {
                console.log('success');
                calendars = resp.data.items;
                calendars.map(function(item) {
                    console.log(item.summary);
                })
            }
        });

    } catch(err) {
        console.log(err.message);
    }



}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(calendar) {
    console.log('listUpcomingEvents ' + calendar.summary + '  ' + calendar.id);
    var request = calendar.events.list({
        //'calendarId': 'primary',
        'calendarId': calendar.id,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });

    request.execute(function(resp) {
        var events = resp.items;
        appendPre(calendar.summary + '  events:','calendars');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                //console.log(event);
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre('     ' + event.summary + ' (' + when + ')','calendars')
            }
        } else {
            appendPre('No upcoming events found.','output','calendars');
        }

    });
}

function listEvents() {
    var calendar = google.calendar('v3');
    calendar.events.list({
        //auth: oauth2Client,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var events = response.items;
        if (events.length == 0) {
            console.log('No upcoming events found.');
        } else {
            console.log('Upcoming 10 events:');
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s - %s', start, event.summary);
            }
        }
    });
}


