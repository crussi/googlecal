// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = ['email',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

if (Meteor.isClient) {
  Meteor.subscribe('calendar-list');
  Meteor.subscribe('helperPublication');
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    },

    //servertime: function () {
    //  return ServerTime.findOne({});
    //},
    calendarList: function () {
      var list = CalendarList.findOne({});
      if (list && list.calendars) {
        console.log('calendarList displayed');
        return list.calendars;
      } else {
        console.log('calendarList NOT displayed');
        return [];
      }
    }
  });

  Template.hello.events({
    'click button#googlelogin': function(e) {
      e.preventDefault();

      return Meteor.loginWithGoogle({
        //requestPermissions: ['email'],
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
    },
    'click button#runtest': function (e) {
      e.preventDefault();
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      console.log('before runtest');
      Meteor.call('runtest');
    }
  });
}

