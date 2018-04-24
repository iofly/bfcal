if((bfclocale==null)||(bfclocale==undefined)||(!bfclocale))
{
    var bfclocale = {};
    bfclocale.locale = "en-US";
    bfclocale.localeName = "US English";
    bfclocale.defaultDateFormat = "MM/dd/yyyy";

    bfclocale.dow = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    bfclocale.dow_short = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    bfclocale.dow_firstletter = [
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S"
    ];

    bfclocale.months = [
        "January",
        "Februrary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    bfclocale.months_short = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    bfclocale.strings = {
        ok: "Ok",
        cancel: "Cancel"
    };
}


class BFCal {

    constructor(elementSelector, config, onSelectDay, onBeforeMonthYearChange, onAfterMonthYearChange) {
        "use strict";

        this.elementSelector = elementSelector;
        this.config = {};
        this.loadConfig(config);
        this.onSelectDay = onSelectDay;
        this.onBeforeMonthYearChange = onBeforeMonthYearChange;
        this.onAfterMonthYearChange = onAfterMonthYearChange;

        this.buildCalendar();
    }

    loadDefaultConfig() {
        "use strict";

        var d = new Date();
        this.config = {
            Locale: 'en-US',
            minDate: null,
            maxDate: null,
            selectedDate: null,
            startDate: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)),
            weekendStart: 5,
            weekendEnd: 6,
            weekendsEnabled: true
        };
    }

    loadConfig(cfg) {
        "use strict";

        if (!cfg) {
            this.loadDefaultConfig();
        } else {
            this.config.Locale = cfg.Locale || 'en-US';

            if (cfg.minDate)
                this.config.minDate = cfg.minDate;
            else
                this.config.minDate = null;

            if (cfg.maxDate)
                this.config.maxDate = cfg.maxDate;
            else
                this.config.maxDate = null;

            if (cfg.selectedDate)
                this.config.selectedDate = cfg.selectedDate;
            else
                this.config.selectedDate = null;

            this.config.weekendsEnabled = cfg.weekendsEnabled;
            this.config.weekendEnd = cfg.weekendEnd;
            this.config.weekendStart = cfg.weekendStart;
            this.config.customDaysDisabled = cfg.customDaysDisabled;

            var d = new Date();
            d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
            this.config.startDate = cfg.startDate || d;
        }
    }

    buildCalendar() {
        "use strict";

        this.clear();
        var nextMonthButtonEnabled = true;
        var nextYearButtonEnabled = true;
        var prevMonthButtonEnabled = true;
        var prevYearButtonEnabled = true;

        var minEndOfMonth = null;
        var minStartOfMonth = null;
        var maxEndOfMonth = null;
        var maxStartOfMonth = null;

        var blank = null;

        this.config.startDate = BFCal.GetStartOfMonth(this.config.startDate);

        if ((this.config.minDate) && (this.config.maxDate)) {

            maxEndOfMonth = BFCal.GetLastDayOfMonth(this.config.maxDate);
            maxStartOfMonth = BFCal.GetStartOfMonth(this.config.maxDate);
            minEndOfMonth = BFCal.GetLastDayOfMonth(this.config.minDate);
            minStartOfMonth = BFCal.GetStartOfMonth(this.config.minDate);

            if (this.config.selectedDate) {
                if (this.config.selectedDate.getTime() < this.config.minDate.getTime()) {
                    this.config.selectedDate = this.config.minDate;
                }
                else if (this.config.selectedDate.getTime() > this.config.maxDate.getTime()) {
                    this.config.selectedDate = this.config.maxDate;
                }
            }

            if ((this.config.startDate.getTime() < minStartOfMonth.getTime()) && (this.config.startDate.getTime() < maxStartOfMonth.getTime())) {
                this.config.startDate = minStartOfMonth;
                prevMonthButtonEnabled = false;
                prevYearButtonEnabled = false;
            }
            else if (this.config.startDate.getTime() === minStartOfMonth.getTime()) {
                prevMonthButtonEnabled = false;
                prevYearButtonEnabled = false;
            }
            else if (this.config.startDate.getTime() === maxStartOfMonth.getTime()) {
                nextMonthButtonEnabled = false;
                nextYearButtonEnabled = false;
            }
            //else if ((this.config.startDate.getTime() >= minStartOfMonth.getTime()) && (this.config.startDate.getTime() < maxStartOfMonth.getTime())) {
            //    //all good
            //    console.log('3 new this.config.startDate = ' + this.config.startDate + ' minStartOfMonth = ' + minStartOfMonth + ' maxStartOfMonth=' + maxStartOfMonth);
            //}
            else if ((this.config.startDate.getTime() >= minStartOfMonth.getTime()) && (this.config.startDate.getTime() >= maxStartOfMonth.getTime())) {
                this.config.startDate = maxStartOfMonth;
                nextYearButtonEnabled = false;
                nextMonthButtonEnabled = false;
            }
            if (minStartOfMonth.getTime() == maxStartOfMonth.getTime()) {
                nextMonthButtonEnabled = false;
                nextYearButtonEnabled = false;
                prevMonthButtonEnabled = false;
                prevYearButtonEnabled = false;
            }
        }
        else if (this.config.minDate) {

            if (this.config.selectedDate) {
                if (this.config.selectedDate.getTime() < this.config.minDate.getTime()) {
                    this.config.selectedDate = this.config.minDate;
                }
            }

            minEndOfMonth = BFCal.GetLastDayOfMonth(this.config.minDate);
            minStartOfMonth = BFCal.GetStartOfMonth(this.config.minDate);

            if (this.config.startDate.getTime() === minStartOfMonth.getTime()) {
                prevMonthButtonEnabled = false;
                prevYearButtonEnabled = false;
            }
            else if (this.config.startDate.getTime() < minStartOfMonth.getTime()) {
                this.config.startDate = minStartOfMonth;
                prevMonthButtonEnabled = false;
                prevYearButtonEnabled = false;
            }
        }
        else if (this.config.maxDate) {

            if (this.config.selectedDate) {
                if (this.config.selectedDate.getTime() > this.config.maxDate.getTime()) {
                    this.config.selectedDate = this.config.maxDate;
                }
            }

            maxEndOfMonth = BFCal.GetLastDayOfMonth(this.config.maxDate);
            maxStartOfMonth = BFCal.GetStartOfMonth(this.config.maxDate);

            if (this.config.startDate.getTime() === maxStartOfMonth.getTime()) {
                nextMonthButtonEnabled = false;
                nextYearButtonEnabled = false;
            }
            else if (this.config.startDate.getTime() > maxStartOfMonth.getTime()) {
                this.config.startDate = maxStartOfMonth;
                nextMonthButtonEnabled = false;
                nextYearButtonEnabled = false;
            }
        }

        this.handleOnBeforeMonthYearChange(this.config.startDate);
        var container = document.querySelector(this.elementSelector);
        container.BFCalInstance = this;
        if (!container) {
            throw "Calendar container described by selector '"+this.elementSelector+"' not found.";
        }

        var rows = BFCal.getCalendarRowCount(this.config.startDate);
        var offset = BFCal.getFirstDayOfMonth(this.config.startDate);
        var daysInMonth = BFCal.getUTCDaysInMonth(this.config.startDate);

        var startOfMonth = new Date(Date.UTC(this.config.startDate.getUTCFullYear(), this.config.startDate.getUTCMonth(), 1, 0, 0, 0, 0));
        var trailingBlanks = (rows * 7) - daysInMonth - offset;

        //Create calendar container
        var cal = document.createElement('div');
        cal.classList.add('bfcInner');
        cal.classList.add('clearfix');

        //Create header container
        var header = document.createElement('div');
        header.classList.add('bfcHeader');
        cal.appendChild(header);

        //Create previous year button container and button
        var prevYearDiv = document.createElement('div');
        prevYearDiv.classList.add('prevBtnContainer');
        header.appendChild(prevYearDiv);

        var btnPrevYear = document.createElement('button');
        btnPrevYear.type = 'button';
        btnPrevYear.classList.add('btnDateNav');
        btnPrevYear.classList.add('btnPrevYear');
        btnPrevYear.innerText = '<<';
        btnPrevYear.selector = this.elementSelector;
        btnPrevYear.onclick = function () { // Note this is a function
            BFCal.GetInstance(this.selector).doCommand('prevyear');
        };

        btnPrevYear.disabled = !prevYearButtonEnabled;
        prevYearDiv.appendChild(btnPrevYear);

        //Create previous month button container and button
        var prevMonthDiv = document.createElement('div');
        prevMonthDiv.classList.add('prevBtnContainer');
        header.appendChild(prevMonthDiv);

        var btnPrevMonth = document.createElement('button');
        btnPrevMonth.type = 'button';
        btnPrevMonth.classList.add('btnDateNav');
        btnPrevMonth.classList.add('btnPrevMonth');
        btnPrevMonth.innerText = '<';
        btnPrevMonth.selector = this.elementSelector;
        btnPrevMonth.onclick = function () { // Note this is a function
            BFCal.GetInstance(this.selector).doCommand('prevmonth');
        };

        btnPrevMonth.disabled = !prevMonthButtonEnabled;
        prevMonthDiv.appendChild(btnPrevMonth);


        //Create month description continer
        var monthDesc = document.createElement('div');
        monthDesc.classList.add('monthDesc');
        header.appendChild(monthDesc);

        var monthName = document.createElement('button');
        monthName.type = 'button';
        monthName.classList.add('monthName');
        monthName.innerText = BFCal.dateToStr(this.config.startDate, 'MMMM', false);
        monthName.selector = this.elementSelector;
        monthName.onclick = function () {
            BFCal.GetInstance(this.selector).doCommand('showmonthselector');
        };
        monthDesc.appendChild(monthName);

        var yearName = document.createElement('button');
        yearName.type = 'button';
        yearName.classList.add('yearName');
        yearName.innerText = BFCal.dateToStr(this.config.startDate, 'yyyy', false);
        yearName.selector = this.elementSelector;
        yearName.onclick = function () {
            BFCal.GetInstance(this.selector).doCommand('showyearselector');
        };
        monthDesc.appendChild(yearName);
       


        //Create next year button container and button
        var nextYearDiv = document.createElement('div');
        nextYearDiv.classList.add('nextBtnContainer');
        header.appendChild(nextYearDiv);
        
        var btnNextYear = document.createElement('button');
        btnNextYear.type = 'button';
        btnNextYear.classList.add('btnDateNav');
        btnNextYear.classList.add('btnNextYear');
        btnNextYear.innerText = '>>';
        btnNextYear.selector = this.elementSelector;
        btnNextYear.onclick = function () { // Note this is a function
            BFCal.GetInstance(this.selector).doCommand('nextyear');
        };

        btnNextYear.disabled = !nextYearButtonEnabled;
        nextYearDiv.appendChild(btnNextYear);



        //Create next month button container and button
        var nextMonthDiv = document.createElement('div');
        nextMonthDiv.classList.add('nextBtnContainer');
        header.appendChild(nextMonthDiv);

        var btnNextMonth = document.createElement('button');
        btnNextMonth.type = 'button';
        btnNextMonth.classList.add('btnDateNav');
        btnNextMonth.classList.add('btnNextMonth');
        btnNextMonth.innerText = '>';
        btnNextMonth.selector = this.elementSelector;
        btnNextMonth.onclick = function () { // Note this is a function
            BFCal.GetInstance(this.selector).doCommand('nextmonth');
        };
        btnNextMonth.disabled = !nextMonthButtonEnabled;
        nextMonthDiv.appendChild(btnNextMonth);



        //Create day of week header above date grid
        var daysHeader = document.createElement('div');
        daysHeader.classList.add('bfcDaysHeader');
        cal.appendChild(daysHeader);

        var i = 0;
        for (i = 0; i < 7; i++) {
            var dayHead = document.createElement('div');
            dayHead.classList.add('bfcItem');
            dayHead.classList.add('bfcDayHead');
            dayHead.innerText = bfclocale.dow_short[i];
            daysHeader.appendChild(dayHead);
        }

        ///////////////////////////////////////////////////////
        /////Create date grid
        ///////////////////////////////////////////////////////
        var daysGrid = document.createElement('div');
        daysGrid.classList.add('bfcDays');
        //Create leading day blanks
        for (i = 0; i < offset; i++) {
            blank = document.createElement('div');
            blank.classList.add('bfcBlank');
            blank.classList.add('bfcItem');
            daysGrid.appendChild(blank);
        }

        var nonSelectableDate = false;
        var today = new Date();
        today = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0));

        var isCustomDisabledMonth = false;
        if(this.config.customDaysDisabled)
        {
           if((this.config.startDate.getUTCMonth() == this.config.customDaysDisabled.month) &&
           (this.config.startDate.getUTCFullYear() == this.config.customDaysDisabled.year))
           {
                isCustomDisabledMonth = true;
           }
        }


        //Create days of the month
        for (i = 1; i <= daysInMonth; i++) {
            var day = document.createElement('div');
            day.classList.add('bfcDay');
            day.classList.add('bfcItem');
            day.innerText = i;

            if (i > 1)
                day.Date = BFCal.addDays(startOfMonth, i - 1);
            else
                day.Date = startOfMonth;

            nonSelectableDate = false;
            if (this.config.maxDate) {
                if (day.Date > this.config.maxDate) {
                    nonSelectableDate = true;
                }
            }
            if (this.config.minDate) {
                if (day.Date < this.config.minDate) {
                    nonSelectableDate = true;
                }
            }

            var dayOfWeek = day.Date.getUTCDay();
            if((nonSelectableDate==false)&&(this.config.weekendsEnabled==false))
            {
                if((this.config.weekendStart!=null) && (this.config.weekendEnd!=null))
                {
                    if((dayOfWeek == this.config.weekendStart)||(dayOfWeek == this.config.weekendEnd))
                    {
                        nonSelectableDate = true; 
                    }
                }
            }
          
            if((isCustomDisabledMonth)&&(nonSelectableDate==false))
            {
                if(this.config.customDaysDisabled.days.indexOf(day.Date.getUTCDate())>=0)
                {
                    nonSelectableDate = true; 
                }
            }

            day.selector = this.elementSelector;
            daysGrid.appendChild(day);

            if (day.Date.getTime() == today.getTime()) {
                day.classList.add('bfcToday');
            }

            if (nonSelectableDate == false) {
                if (this.config.selectedDate) {
                    if (day.Date.getTime() === this.config.selectedDate.getTime()) {
                        day.classList.add('bfcSelectedDay');
                    }
                }

                day.onclick = function () {

                    var inst = BFCal.GetInstance(this.selector);
                    inst.handleDateClick(this.Date);
                    if (inst) {
                        inst.config.selectedDate = this.Date;
                    }

                    var days = document.querySelectorAll(this.selector + " .bfcDay");
                    for (var n = 0; n < days.length; n++) {
                        days[n].classList.remove('bfcSelectedDay');
                    }
                    this.classList.add('bfcSelectedDay');
                    var selectionDisplay = document.querySelector(this.selector + " .bfcSelectedDisplay");
                    if (selectionDisplay) {
                        selectionDisplay.innerText = BFCal.dateToStr(this.Date, 'MMMM d yyyy');
                    }
                };
            }
            else {
                day.classList.add('bfcCannotSelect');
                if (this.config.selectedDate) {
                    if (day.Date.getTime() === this.config.selectedDate.getTime()) {
                        this.config.selectedDate = null;
                    }
                }
            }
        }

        //Create trailing blanks
        for (i = 0; i < trailingBlanks; i++) {
            blank = document.createElement('div');
            blank.classList.add('bfcBlank');
            blank.classList.add('bfcItem');
            daysGrid.appendChild(blank);
        }

        cal.appendChild(daysGrid);

        //create div that shows the selected date in friendly form
        var selectedDayDisplay = document.createElement('div');
        selectedDayDisplay.classList.add('bfcSelectedDisplay');
        selectedDayDisplay.innerText = '';
        if (this.config.selectedDate)
            selectedDayDisplay.innerText = BFCal.dateToStr(this.config.selectedDate, 'MMMM d yyyy');
        cal.appendChild(selectedDayDisplay);

        container.appendChild(cal);

        this.buildMonthSelector();
        this.buildYearSelector();

        this.handleOnAfterMonthYearChange(this.config.startDate);
    }

    buildMonthSelector() {
        "use strict";

        var mpo = document.createElement('div');
        mpo.classList.add('bfcMonthSelector');
        mpo.classList.add('clearfix');

        var table = document.createElement('table');
        table.classList.add('bfcMonthTable');

        var monthNum = 0;
        var row = 0;
        var col = 0;
        for (row = 0; row < 3; row++) {
            var r = document.createElement('tr');
            
            for (col = 0; col < 4; col++) {
                var c = document.createElement('td');
                c.innerText = bfclocale.months[monthNum];// 'M';
                c.selector = this.elementSelector;
                c.monthNum = monthNum;
                c.onclick = function () {
                    
                    var inst = BFCal.GetInstance(this.selector);
                    if (inst) {
                        inst.config.startDate.setUTCMonth(this.monthNum,1);
                        inst.buildCalendar();
                        inst.doCommand('hidemonthselector');
                    }
                };

                r.appendChild(c);
                monthNum++;
            }

            table.appendChild(r);
        }

        mpo.appendChild(table);
        var container = document.querySelector(this.elementSelector);
        container.appendChild(mpo);
    }

    buildYearSelector() {
        "use strict";

        var mpo = document.createElement('div');
        mpo.classList.add('bfcYearSelector');
        mpo.classList.add('clearfix');

        var inputHolder = document.createElement('div');
        inputHolder.classList.add('bfcYearEntry');
        mpo.appendChild(inputHolder);


        var tb = document.createElement('input');
        tb.classList.add('bfcYearNumber');
        tb.type = 'number';
        inputHolder.appendChild(tb);


        var buttonHolder = document.createElement('div');
        buttonHolder.classList.add('bfcYearButtonHolder');
        mpo.appendChild(buttonHolder);


        var btnOk = document.createElement('button');
        btnOk.type = 'button';
        btnOk.classList.add('btnOk');
        //btnOk.innerText = 'Ok';
        btnOk.innerHTML = bfclocale.strings.ok;
        btnOk.selector = this.elementSelector;
        btnOk.onclick = function () {
            var instance = BFCal.GetInstance(this.selector);

            var yearElem = document.querySelector(this.selector + ' .bfcYearNumber');
            var yearstrr = yearElem.value;//.trim();
            if((yearstrr==undefined)||(!yearstrr)){
                return;
            }
            var yearInt = 0;
            try
            {
                yearInt = parseInt(yearstrr) || -9999;
                if(yearInt==-9999){
                    return;
                }
            }
            catch (err)
            {
                instance.doCommand('showcalendar');
                return;
            }

            instance.doCommand('showcalendar');
            instance.config.startDate.setUTCFullYear(yearInt);
            instance.buildCalendar();
        };
        buttonHolder.appendChild(btnOk);

        var btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.classList.add('btnOk');
        btnCancel.innerHTML = bfclocale.strings.cancel;
        btnCancel.selector = this.elementSelector;
        btnCancel.onclick = function () {
            var instance = BFCal.GetInstance(this.selector);
            instance.doCommand('showcalendar');
        };
        buttonHolder.appendChild(btnCancel);

        var container = document.querySelector(this.elementSelector);
        container.appendChild(mpo);
    }

    doCommand(command, valParam) {
        "use strict";

        var tmp = null;
        var monthselector = null;
        var yearselector = null;
        var calendarpanel = null;
        var container = null;
        var cal = null;

        if (command === 'nextmonth') {
            this.clear();
            this.config.startDate = BFCal.addMonths(this.config.startDate, 1);
            tmp = this.config.startDate;
            this.buildCalendar();
            return tmp.getTime() == this.config.startDate.getTime();
        }
        else if (command === 'prevmonth') {
            this.clear();
            this.config.startDate = BFCal.addMonths(this.config.startDate, -1);
            tmp = this.config.startDate;
            this.buildCalendar();
            return tmp.getTime() == this.config.startDate.getTime();
        }
        else if (command === 'nextyear') {
            this.clear();
            this.config.startDate = BFCal.addMonths(this.config.startDate, 12);
            tmp = this.config.startDate;
            this.buildCalendar();
            return tmp.getTime() == this.config.startDate.getTime();
        }
        else if (command === 'prevyear') {
            this.clear();
            
            this.config.startDate = BFCal.addMonths(this.config.startDate, -12);
            tmp = this.config.startDate;
            this.buildCalendar();
            return tmp.getTime() == this.config.startDate.getTime();
        }
        else if (command === 'hidemonthselector') {
            monthselector = document.querySelector(this.elementSelector + ' .bfcMonthSelector');
            monthselector.style.display = 'none';

            return true;
        }
        else if (command === 'showmonthselector') {

            monthselector = document.querySelector(this.elementSelector + ' .bfcMonthSelector');
            monthselector.style.display = 'block';

            yearselector = document.querySelector(this.elementSelector + ' .bfcYearSelector');
            yearselector.style.display = 'none';

            calendarpanel = document.querySelector(this.elementSelector + ' .bfcInner');
            calendarpanel.style.display = 'none';

            return true;
        }
        else if (command === 'showyearselector') {

            var inst = BFCal.GetInstance(this.elementSelector);
            var yearElem = document.querySelector(this.elementSelector + ' .bfcYearNumber');
            yearElem.value = inst.config.startDate.getUTCFullYear();

            monthselector = document.querySelector(this.elementSelector + ' .bfcMonthSelector');
            monthselector.style.display = 'none';

            yearselector = document.querySelector(this.elementSelector + ' .bfcYearSelector');
            yearselector.style.display = 'block';

            calendarpanel = document.querySelector(this.elementSelector + ' .bfcInner');
            calendarpanel.style.display = 'none';

            yearElem.focus();
            yearElem.select();

            return true;
        }
        else if (command === 'showcalendar') {
            monthselector = document.querySelector(this.elementSelector + ' .bfcMonthSelector');
            monthselector.style.display = 'none';

            yearselector = document.querySelector(this.elementSelector + ' .bfcYearSelector');
            yearselector.style.display = 'none';

            calendarpanel = document.querySelector(this.elementSelector + ' .bfcInner');
            calendarpanel.style.display = 'block';

            return true;
        }
        else if (command === 'sayhello') {
            console.log('Hello!');
            return true;
        }
        else if (command === 'gototoday') {
            var today = new Date();
            today = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

            if(!this.dateIsSelectable(today)){
                return false;
            }

            this.clear();
            this.config.startDate = today;
            this.config.selectedDate = today;
            this.buildCalendar();
            return true;
        }
        else if (command === 'gotodate') {
           
            if(!this.dateIsSelectable(valParam)){
                return false;
            }

            this.clear();
            this.config.startDate = valParam;
            this.config.selectedDate = valParam;
            this.buildCalendar();
            return true;
        }
        else if (command === 'getUTCDatestring') {
            if (this.config.selectedDate)
                return BFCal.dateToStr(this.config.selectedDate, valParam);
            else
                return '';
        }
        else if (command === 'clearselection') {
            this.config.selectedDate = null;
            this.clear();
            this.buildCalendar();
            return true;
        }
        else if (command === 'clearDisabledDays') {
            this.config.customDaysDisabled = null;
            this.buildCalendar();
            return true;
        }
        else if (command === 'hide') {
            container = document.querySelector(this.elementSelector);
            cal = container.querySelector('.bfcInner');
            cal.style.display = 'none';
            return true;
        }
        else if (command === 'show') {
            container = document.querySelector(this.elementSelector);
            cal = container.querySelector('.bfcInner');
            cal.style.display = 'block';
            return true;
        }
        else if (command === 'destroy') {
            container = document.querySelector(this.elementSelector);
            container.BFCalInstance = null;
            console.log('destroyed!');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
        else if (command === "applyDisabledDays") {
            this.config.customDaysDisabled = valParam;
            this.buildCalendar();
            return true;
        }
        else if (command === "buildCalendar") {
            this.buildCalendar();
            return true;
        }
        else if (command === "disableCalendar") {
            
            this.doCommand('showCalendar');

            var dateNavs = document.querySelectorAll(this.elementSelector + ' button');
            dateNavs.forEach(element => {
                element.disabled='disabled';
            });

            var dateSelectors = document.querySelectorAll(this.elementSelector + ' .bfcDay');
            dateSelectors.forEach(element => {
               element.classList.add('bfcCannotSelect');
            });
            return true;
        }
        else if (command === "enableCalendar") {
            this.buildCalendar();
            return true;
        }
    }

    clear() {
        var container = document.querySelector(this.elementSelector);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    handleDateClick(date) {
        this.config.selectedDate = date;

        if (this.onSelectDay) {
            this.onSelectDay(date);
        } 
    }

    handleOnBeforeMonthYearChange(date) {
        if (this.onBeforeMonthYearChange) {
            this.onBeforeMonthYearChange(date);
        } 
    }

    handleOnAfterMonthYearChange(date) {
        if (this.onAfterMonthYearChange) {
            this.onAfterMonthYearChange(date);
        } 
    }

    dateIsSelectable(date){
        
        if(this.config.minDate){
            if(date.getTime() < this.config.minDate.getTime()){
                return false;
            }
        }
        if(this.config.maxDate){
            if(date.getTime() > this.config.maxDate.getTime()){
                return false;
            }
        }

        if(this.config.weekendsEnabled==false){
            var dayOfWeek = date.getUTCDay();
            if((dayOfWeek == this.config.weekendStart)||(dayOfWeek == this.config.weekendEnd)){
                return false;
            }
        }

        if(this.config.customDaysDisabled)
        {
            var year = date.getUTCFullYear();
            if(this.config.customDaysDisabled.year == year)
            {
                var month = date.getUTCMonth();
                if(this.config.customDaysDisabled.month == month)
                {
                    var dayofmonth = date.getUTCDate();
                    if(this.config.customDaysDisabled.days.indexOf(dayofmonth)>=0)
                    {
                        return false;
                    }
                    return true;
                }
            }
        }

        return true;
    }

    static GetInstance(elementSelector, config, onDaySelected, onBeforeMonthYearChange, onAfterMonthYearChange) {
        var elem = document.querySelector(elementSelector);
        if (!elem) {
            return false;
        }

        if ((elem.BFCalInstance!=null)&&(elem.BFCalInstance!=undefined)) {
            //If returning old instance, update config or event if passed
            if (config) {
                elem.BFCalInstance.loadConfig(config);
            }
            else {
                if (!elem.BFCalInstance.config)
                {
                    console.log('elem.BFCalInstance='+JSON.stringify(elem.BFCalInstance));
                    elem.BFCalInstance.loadDefaultConfig();
                }
            }
            //if (onDaySelected) {
                //elem.BFCalInstance = onDaySelected;
                //onDaySelected(elem.BFCalInstance.config.selectedDate);
            //}
            

            return elem.BFCalInstance;
        }
        else {
            return new BFCal(elementSelector, config, onDaySelected, onBeforeMonthYearChange, onAfterMonthYearChange);
        }
    }
  
    static getFirstDayOfMonth(date) {
        const d2 = new Date(date);
        d2.setUTCDate(1);
        return d2.getUTCDay();
    }

    static getUTCDaysInMonth(date) {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        return new Date(Date.UTC(year, month+1, 0)).getUTCDate();
    }

    static getCalendarRowCount(date) {
        const daysInMonth = BFCal.getUTCDaysInMonth(date);
        const firstday = BFCal.getFirstDayOfMonth(date);

        if ((daysInMonth == 28) && (firstday == 0)) {
            return 4;
        }
        else if ((daysInMonth == 31) && ((firstday == 5) || (firstday == 6))) {
            return 6;
        }
        else if ((daysInMonth == 30) && (firstday == 6)) {
            return 6;
        }
        else {
             return 5;
        }

    }

    static dateToStr(date, dateFmt, isutc) {
         var year = date.getUTCFullYear();
         var month = date.getUTCMonth(); //(from 0-11)
         var dayofmonth = date.getUTCDate();// (from 1-31)
         var day = date.getUTCDay(); //(from 0-6)
         var hr24 = date.getUTCHours(); //(from 0-23)
         var ms = date.getUTCMilliseconds(); //(from 0-999)
         var mins = date.getUTCMinutes(); //(from 0-59)
         var secs = date.getUTCSeconds(); //(from 0-59)
   
        var res = dateFmt || "yyyy-MM-dd";

        //backup
        res = res.replace("MMMM", "{£!}");
        res = res.replace("MMM", "{£$}");
        res = res.replace("dddd", "{&!}");
        res = res.replace("ddd", "{&$}");
        res = res.replace("tt", "{%!}");
        res = res.replace("t", "{%$}");

        //Time 
        res = res.replace("hh", BFCal.padInt((hr24 > 12) ? (hr24 - 12) : hr24, '0', 2));
        res = res.replace("h", (hr24 > 12) ? (hr24 - 12) : hr24);
        res = res.replace("HH", BFCal.padInt(hr24, '0', 2));
        res = res.replace("H", hr24);
        res = res.replace("mm", BFCal.padInt(mins, '0', 2));
        res = res.replace("m", mins);
        res = res.replace("ss", BFCal.padInt(secs, '0', 2));
        res = res.replace("s", secs);

        //Date
        res = res.replace("yyyy", year);
        res = res.replace("yy", BFCal.padInt(year % 100, '0', 2));
        res = res.replace("MM", BFCal.padInt(month + 1, '0', 2));
        res = res.replace("M", month + 1);
        res = res.replace("dd", BFCal.padInt(dayofmonth, '0', 2));
        res = res.replace("d", dayofmonth);

        //restore
        res = res.replace("{£!}", bfclocale.months[month]);
        res = res.replace("{£$}", bfclocale.months_short[month]);
        res = res.replace("{&!}", bfclocale.dow[day]);
        res = res.replace("{&$}", bfclocale.dow_short[day]);
        res = res.replace("{%!}", hr24 >= 12 ? "P.M." : "A.M.");
        res = res.replace("{%$}", hr24 >= 12 ? "P" : "A");
        
        return res;
    }

    static padInt(i, padchar, padwidth) {
        var s = i + '';
        var l = s.length;

        if (l >= padwidth) {
            return s;
        }
        else {
            var dif = padwidth - l;
            var res = '';
            for (var n = 0; n < dif; n++) {
                res += padchar;
            }
            res += s;
            return res;
        }
    }

    static addDays(date, days) {
        if (!date) date = new Date();
        if (!days) days = 1;

        var result = new Date(date);
        result.setUTCDate(date.getUTCDate() + days);
        return result;
    }

    static addMonths(date, months) {
        return new Date(new Date(date).setUTCMonth(date.getUTCMonth() + months));
    }

    static GetStartOfMonth(date) {
        var d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
        return d;
    }

    static GetLastDayOfMonth(date) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    }
}