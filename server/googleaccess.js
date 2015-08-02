GoogleAccess = {
    refreshToken : function(user) {
        //relies on GoogleApi method exchangeRefreshToken
        var result = Meteor.call('exchangeRefreshToken', user && user._id);
        if (result.err) {
            console.log('err refreshing user: ' + refreshres.err);
        }
    },
}