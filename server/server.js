
var subs = { };

Meteor.publish('calendar-list', function() {
    console.log('inside publish');
    // #1 ......
    var subscriptionx = this;
    var calendars = [], i, j;
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

    subscriptionx.added( 'calendarList', 'b_random_id', { calendars: calendars } );
    // #3...
    subscriptionx.onStop(function() {
        console.log('stop calendar-list id: ' + subscriptionx._subscriptionId);
        delete subs[subscriptionx._subscriptionId];
    });

    //calendars = Meteor.call('getCalendars',user);
    GoogleAccess.refreshToken(user);
    Calendar.getCalendars(user, function (err, calendars) {
        console.log('calendars changed length: ' + calendars.length);
        subscriptionx.changed( 'calendarList', 'b_random_id', { calendars: calendars } );


    });
});

Meteor.methods({
        runtest: function(){
            console.log('runtest');
        }
    }
);
