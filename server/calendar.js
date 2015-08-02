Calendar = {
    calendarListUrl : "/calendar/v3/users/me/calendarList?minAccessRole=owner",
    calendarEventsUrl : "/calendar/v3/calendars/calendarId/events",
    getCalendarList : function(user){
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
    getCalendars : function(user, callback){
        var i, j, calendars = this.getCalendarList(user);
        for (i = 0; i < calendars.length; i++) {
            console.log(calendars[i].summary);
            _.extend(calendars[i],{events:[]});

            calendars[i].events = this.getCalendarEvents(user,calendars[i].id);
            for (j = 0; j < calendars[i].events.length; j++) {
                console.log('cal event: ' + calendars[i].events[j].summary);
            }
        }
        callback(null,calendars);
    },
    getCalendarEvents : function(user, calendarId) {
        var params = "?maxResults=10";
        params += "&timeMin=" + (new Date()).toISOString();
        params += "&showDeleted=false";
        params += "&singleEvents=true";
        params += "&orderBy=startTime";
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