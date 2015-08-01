
var subs = { };

Meteor.publish('calendar-list', function() {
    console.log('inside publish');
    // #1 ......
    var subscriptionx = this;
    var calendars = [];
    //var accessToken = this.user().services.google.accessToken;
    var user = Meteor.users.findOne({_id: this.userId}, {});
    console.log('calendar-list id: ' + subscriptionx._subscriptionId);
    //var accessToken = user.services.google.accessToken;
    var refreshToken = user.services.google.refreshToken;
    //var expiresAt = user.services.google.expiresAt;
    subs[subscriptionx._subscriptionId] = subscriptionx;

    // #2...
    var currentTime = new Date();

    //var accessToken = refreshAccessToken2(refreshToken);
    var user = Meteor.users.findOne(this.userId);

    calendars = Meteor.call('getCalendars',user);
    console.log('calendars length: ' + calendars.length);
    //getCalendars(accessToken, refreshToken, function (calendars) {
    //    subscriptionx.added( 'calendarList', 'b_random_id', { calendars: calendars } );
    //});
    subscriptionx.added( 'calendarList', 'b_random_id', { calendars: calendars } );
    // #3...
    subscriptionx.onStop(function() {
        console.log('stop calendar-list id: ' + subscriptionx._subscriptionId);
        delete subs[subscriptionx._subscriptionId];
    });

});

Meteor.methods({
        runtest: function(){
            var user = Meteor.user();
            var list = Meteor.call('getCalendars',user);
            var calevents = [], i, j;
            for (i = 0; i < list.length; i++) {
                console.log(list[i].summary);
                if (i == 0) {
                    calevents = Meteor.call('getCalendarEvents',user,list[i].id);
                    for (j = 0; j < calevents.length; j++) {
                        console.log('cal event: ' + calevents[j].summary);
                    }
                }
            }
        },
        getCalendars: function(user){
            var url = "/calendar/v3/users/me/calendarList?minAccessRole=owner";
            var options = {user:user};
            var calendars = [];
            console.log('getCalendars method on server');

            var result = GoogleApi.get(url, options);

            if (result.err) {
                console.log('err: ' + err);
            } else {
                console.log('success: array len' + result.items.length);
                calendars = result.items;
            }
            return calendars;
        },
        getCalendarEvents: function(user, calendarId) {
            var params = "?maxResults=10";
            params += "&timeMin=" + (new Date()).toISOString();
            params += "&showDeleted=false";
            params += "&singleEvents=true";
            params += "&orderBy=startTime";
            var url = "/calendar/v3/calendars/" + calendarId + "/events" + params;
            console.log("url: " + url);
            var options = {user:user};
            var calendarevents = [];
            console.log('getCalendarEvents method on server');
            var result = GoogleApi.get(url, options);

            if (result.err) {
                console.log('err: ' + err);
            } else {
                console.log('success: array len' + result.items.length);
                calendars = result.items;
            }
            return calendars;

        }
    }
);

