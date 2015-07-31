
var subs = { };

Meteor.publish('calendar-list', function() {

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
    calendars = Meteor.call('getCalendars');
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
            var list = Meteor.call('getCalendars');
            for (var i = 0; i < list.length; i++) {
                console.log(list[i].summary);
            }
        },
        getCalendars: function(){
            var url = "/calendar/v3/users/me/calendarList?minAccessRole=owner";
            var options = {};
            var calendars = [];
            console.log('runtest on server');

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

