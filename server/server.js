
var subscriptions = { };
winston = Winston;
winston.level = 'debug';

Meteor.publish('calendar-list', function() {
    winston.debug('inside publish calendar-list');
    var subscription = this;
    var subscriptionId = this._subscriptionId;
    var calendars = [];
    var user = Helpers.getUser(this.userId);
    subscriptions[subscriptionId] = subscription;
    subscription.added( 'calendarList', 'b_random_id', { calendars: calendars } );
    subscription.onStop(function() {
        winston.debug('stop subscription to calendar-list id: ' + subscriptionId);
        delete subscriptions[subscriptionId];
    });
    var calevtopts = _.extend({},Calendar.CalendarEventOptions);
    Calendar.getCalendars(user, calevtopts, function (err, calendars) {
        winston.debug('subscription to calendar-list changed id: ' + subscriptionId);
        subscription.changed( 'calendarList', 'b_random_id', { calendars: calendars } );
    });
});

Meteor.publish('calendar-events', function() {
    winston.debug('inside publish calendar-events');
    var subscription = this;
    var subscriptionId = this._subscriptionId;
    var calevents = [];
    var user = Helpers.getUser(this.userId);
    subscriptions[subscriptionId] = subscription;
    subscription.added( 'calendarEvents', 'c_random_id', { calevents: calevents } );
    subscription.onStop(function() {
        winston.debug('stop subscription to calendar-events id: ' + subscriptionId);
        delete subscriptions[subscriptionId];
    });
    var calevtopts = _.extend({},Calendar.CalendarEventOptions);

    Calendar.getEvents(user, calevtopts, function(err, calevents) {
        //some change
        console.log('done');
        console.log(calevents.length);
        winston.debug('subscription to calendar-events changed id: ' + subscriptionId);
        subscription.changed( 'calendarEvents', 'c_random_id', { calevents: calevents } );

    });
});

