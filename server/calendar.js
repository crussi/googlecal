CalendarEventOptions = {
    maxResults:10,
    timeMin: (new Date()).toISOString(),
    showDeleted:false,
    singleEvents:true,
    orderBy:'startTime'
}
Calendar = {
    calendarListUrl : "/calendar/v3/users/me/calendarList?minAccessRole=owner",
    calendarEventsUrl : "/calendar/v3/calendars/calendarId/events",
    getCalendars : function(user, calevtopt, callback){
        //refresh user's google accesstoken
        this._refreshToken(user);
        calevtopt = calevtopt || {};
        console.log('caleventoptions: ' + calevtopt);
        var i, j, calendars = this._getCalendarList(user);
        for (i = 0; i < calendars.length; i++) {
            console.log(calendars[i].summary);
            _.extend(calendars[i],{events:[]});

            calendars[i].events = this._getCalendarEvents(user, calevtopt, calendars[i].id);
            for (j = 0; j < calendars[i].events.length; j++) {
                console.log('cal event: ' + calendars[i].events[j].summary);
            }
        }
        callback(null,calendars);
    },
    _refreshToken : function(user) {
        //relies on GoogleApi method exchangeRefreshToken
        var result = Meteor.call('exchangeRefreshToken', user && user._id);
        if (result.err) {
            console.log('err refreshing user: ' + refreshres.err);
        }
    },
    _getCalendarList : function(user){
        var options,
            calendars = [],
            result;
        options = {user:user};
        calendars = [];
        result = GoogleApi.get(this.calendarListUrl, options);

        if (result.err) {
            console.log('err: ' + err);
        } else {
            calendars = result.items;
        }

        return calendars;
    },
    _getCalendarEvents : function(user, calevtopt, calendarId) {
        calevtopt = calevtopt || {};
        //var params = "?maxResults=10";
        //params += "&timeMin=" + (new Date()).toISOString();
        //params += "&showDeleted=false";
        //params += "&singleEvents=true";
        //params += "&orderBy=startTime";
        var params = "?" + Helpers.toQueryString(calevtopt);
        console.log('params: ' + params);
        //var url = "/calendar/v3/calendars/" + calendarId + "/events" + params;
        var url = this.calendarEventsUrl.replace("calendarId",calendarId) + params;
        var options = {user:user};
        var calendarevents = [];
        var result = GoogleApi.get(url, options);

        if (result.err) {
            console.log('err: ' + err);
        } else {
            console.log('success: events array len' + result.items.length);
            calendarevents = result.items;
        }
        return calendarevents;

    }

}