// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = ['email',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button#googlelogin': function(e) {
      e.preventDefault();

      return Meteor.loginWithGoogle({
        //requestPermissions: ['email'],
        requestPermissions: scopes,
        requestOfflineToken: true
      }, function(error) {
        if (error) {
          console.log('google login error');
          return console.log(error.reason);
        } else {
          console.log('google login success');
          //FlowLayout.render('layout-auth', { content: "app" });
          //FlowRouter.go('/dashboard');
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

