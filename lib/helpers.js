Helpers = {};

if (Meteor.isServer) {

    Helpers = _.extend(Helpers,{
        getUser : function(userId) {
            var user;
            if (userId) {
                user = Meteor.users.findOne({_id: userId});
            }
            return user;
        },
        toQueryString : function(obj) {
            return _.map(obj,function(v,k){
                return encodeURIComponent(k) + '=' + encodeURIComponent(v);
            }).join('&');
        }
    });

} else if (Meteor.isClient) {

    Helpers = _.extend(Helpers,{
        getUser : function() {
            return Meteor.user();
        }
    });
}
