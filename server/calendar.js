Calendar = {
    getCalendars : function(user){
        var url = "/calendar/v3/users/me/calendarList?minAccessRole=owner";
        var options = {user:user};
        var calendars = [];
        console.log('getCalendars2 method on server');

        var result = GoogleApi.get(url, options);

        if (result.err) {
            console.log('err: ' + err);
        } else {
            console.log('success: array len' + result.items.length);
            calendars = result.items;
        }
        for (i = 0; i < calendars.length; i++) {
            console.log(calendars[i].summary);
            //if (i == 0) {
            _.extend(calendars[i],{events:[]});

                calendars[i].events = this.getCalendarEvents(user,calendars[i].id);
                for (j = 0; j < calendars[i].events.length; j++) {
                    console.log('cal event: ' + calendars[i].events[j].summary);
                }
            //}
        }
        return calendars;
    },
    getCalendarEvents : function(user, calendarId) {
        var params = "?maxResults=10";
        params += "&timeMin=" + (new Date()).toISOString();
        params += "&showDeleted=false";
        params += "&singleEvents=true";
        params += "&orderBy=startTime";
        var url = "/calendar/v3/calendars/" + calendarId + "/events" + params;
        console.log("url: " + url);
        var options = {user:user};
        var calendarevents = [];
        console.log('getCalendarEvents method on server');
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