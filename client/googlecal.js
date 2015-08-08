// generate a url that asks permissions for Google+ and Google Calendar scopes
var winston = Winston;
winston.level = 'debug';

var scopes = ['email',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

Meteor.subscribe('calendar-list');
Meteor.subscribe('calendar-events');

// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
  counter: function () {
    return Session.get('counter');
  },

  calendarList: function () {
    var list = CalendarList.findOne({});
    if (list && list.calendars) {
      console.log('calendarList displayed');
      return list.calendars;
    } else {
      console.log('calendarList NOT displayed');
      return [];
    }
  },
  calendarEvents: function () {
    var list = CalendarEvents.findOne({});
    if (list && list.calevents) {
      console.log('calendarEvents displayed');
      return list.calevents;
    } else {
      console.log('calendarEvents NOT displayed');
      return [];
    }
  }

});

Template.hello.events({
  'click button#googlelogin': function(e) {
    e.preventDefault();

    return Meteor.loginWithGoogle({
      forceApprovalPrompt: true,
      requestPermissions: scopes,
      requestOfflineToken: true
    }, function(error) {
      if (error) {
        console.log('google login error');
        return console.log(error.reason);
      } else {
        console.log('google login success');//Meteor.user().services.google.refreshToken;
      }
    });
  }
});

