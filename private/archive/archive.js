// The helper publication
Meteor.publish('helperPublication', function() {

    // #1 ...
    var subscription = this;
    console.log('servertime id: ' + subscription._subscriptionId);
    subs[subscription._subscriptionId] = subscription;

    // #2
    subscription.added( 'serverTime', 'a_random_id', {date: new Date()} );

    // #3
    subscription.onStop(function() {
        console.log('stop servertime id: ' + subscription._subscriptionId);
        delete subs[subscription._subscriptionId];
    });
});

Meteor.setInterval(function() {
    var currentTime = new Date();
    for (var subscriptionID in subs) {
        var subscription = subs[subscriptionID];
        subscription.changed( 'serverTime', 'a_random_id', {date: currentTime} );
    }
}, 1000);

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

    getCalendars2(function(calendars) {
        if (calendars.length > 0) {
            for (i = 0; i < calendars.length; i++) {
                var calendar = calendars[i];
                //listUpcomingEvents(calendar);
                console.log(calendar.summary);
            }
        } else {
            appendPre('No calendars found.','calendars');
        }
        callback(calendars);
    });

}

function getCalendars2(callback) {
    // Retrieve tokens via token exchange explained above or set them:
    calendar = google.calendar('v3');
    var accessTokenString = 'Bearer ' + Meteor.user().services.google.accessToken;
    var calendars = [];
    var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner";
    try {
        HTTP.get(url,
            {
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

