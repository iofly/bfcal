# bfcal -  A zero dependency Javascript date picker

## Examples

### Simple Example

```html
<link href="css/bfcal.css" rel="stylesheet" />
<script src="js/bfcal.js"></script>
<div id="calendar1"></div>
<script type="text/javascript">
    var cc = BFCal.GetInstance('#calendar1', null, function(date) {
        console.log('on day selected handler 1 ' + JSON.stringify(date) );
    });
</script>
```

### More Complex Example

```html
<link href="css/bfcal.css" rel="stylesheet" />
<script src="js/bfcal.js"></script>

<div id="calendar2"></div>

<script type="text/javascript">
    var customDaysDisabled1 = {
        year: 2018,
        month: 1, //zero based month number
        days: [2,5,7,8,14,22,28] 
    }
    var config2 = {
        Locale: 'en-US', //not used yet, use external /i18n/ js files.
        minDate: new Date(Date.UTC(2018, 1, 12, 0, 0, 0)),
        maxDate: new Date(Date.UTC(2018, 5, 23, 0, 0, 0)),
        selectedDate: new Date(Date.UTC(2018, 5, 13, 0, 0, 0)),
        startDate: new Date(Date.UTC(2018, 5, 1, 0, 0, 0)),
        weekendStart: 6,
        weekendEnd: 0,
        weekendsEnabled: false,
        customDaysDisabled: customDaysDisabled1
    };
    var cc = BFCal.GetInstance('#calendar2', config2,
            function(date) {
                console.log('Calendar 2: on day selected ' + JSON.stringify(date) );
            },
            function(date) {
                console.log('Calendar 2: on before month/year change ' + JSON.stringify(date) );
            },
            function(date) {
                console.log('Calendar 2: on after month/year change ' + JSON.stringify(date) );
            }
        );
</script>
```

## API

API calls accessed via the calendar method "instance.doCommand(string, valParam);".

A useful way to get the instance of the calendar for a particular HTML element is the static methid "BFCal.GetInstance(selector);" where selector is the CSS selector for the element e.g. #calentar1 for an element with id="calendar1".

If there is no calendar associated with that HTML element, then one will be created.

Command | Description
------------ | -------------
nextmonth | Navigate to the next month. Will navigate only if value of maxDate allows, or null.
prevmonth | Navigate to previous month. Will navigate only if value of minDate allows, or null.
nextyear | Navigate to the next year. Will navigate only if value of maxDate allows, or null.
prevyear | Navigate to previous year. Will navigate only if value of minDate allows, or null.
hidemonthselector | Hide month selection pane.
showmonthselector | Show month selection pane.
showyearselector | Show year entry pane.
showcalendar | Return to calendar view pane.
gototoday | Show current month and year in calendar view, and set today as selectedDate.
gotodate | Requires valParam to be passed as Date. Show Date month and year in calendar view, and set Date as selectedDate.
getUTCDatestring | Requires valParam to be passed, as date format string, e.g. "yyyy-MM-dd". Returns Date as string.
clearselection | Clears selected date, sets selectedDate to null.
clearDisabledDays | Clears custom disabled dates.
hide | Hide calendar component.
show | Show calendar component.
applyDisabledDays | Allows custom dates to be disabled. Useful in conjunction with onAfterMonthYearChanges() event and AJAX requests to server to retrieve disabled dates.
buildCalendar | Refresh the calendar.
disableCalendar | Disable interactive date selection. You can still call 'gotodate' or 'gototoday'.
enableCalendar | RE-enable interactive date selection.

## i18n

There is one translation file included, French, in order to show how to implement internationalization. To show the calendar in this language, use the follwing HTML

```html
<script src="js/i18n/bfcal.en-US.js"></script>
```
