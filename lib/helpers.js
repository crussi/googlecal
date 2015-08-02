Helpers = {
    getUser : function() {
        var user;
        if (userId && Meteor.isServer) {
            user = Meteor.users.findOne({_id: userId});
        } else {
            user = Meteor.user();
        }
        return user;
    },
    toQueryString : function(obj) {
        return _.map(obj,function(v,k){
            return encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }).join('&');
    }
}