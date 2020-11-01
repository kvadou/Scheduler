/* referenced https://github.com/twopcz/Work-Day-Planner to get ideas on how to complete this project */

/* defining variables with open brackets to pass through values*/
let scheduleArr = [];
let scheduleObj = {};
let dateArr = [];
let dateObj = {};
let storedSchedule;
let savedSchedule;
let date = moment().format('LL');
previous = 0;
next = 0;
day = 0;

/* using jQuery to make sure the page is ready to execute JavaScript code */
$(document).ready(function() {
  init();
/* setting up functions with open brackets to pass through the values */
  function init() {
    storeTodaysDate();
    changeDay();
    updateTime();
    displaySchedule();
    scheduleFocus();
    saveEvent();
    clearSchedule();
  }
/* function to determine the current date and store it in local storage */
  function storeTodaysDate() {
    savedSchedule = JSON.parse(localStorage.getItem(date));

    if (savedSchedule === null) {
      console.log('creating');
      dateObj['date'] = date;
      dateArr.push(dateObj);
      localStorage.setItem(date, JSON.stringify(dateArr));
    }
  }
/* function to determine any other date and store it to local storage */
  function storeDifferentDate() {
    let existingStorage = JSON.parse(localStorage.getItem(date));

    if (existingStorage !== null) {
      scheduleArr = existingStorage;
    } else {
      currentDateObj = {};
      currentDateArr = [];
      currentDateObj['date'] = date;
      currentDateArr.push(currentDateObj);
      localStorage.setItem(date, JSON.stringify(currentDateArr));
    }
  }
/* function to determine current local time, day & years and dynamically update the HTML */
  function updateTime(differentDate) {
    if (differentDate !== date) {
      let currentDate = moment().format('dddd, MMMM Do');
      let currentYear = moment().format('YYYY');
      $('#currentDay').html(currentDate);
      $('#title-year').html(currentYear);
      dynamicTime();
    }

    if (day < 0) {
      $('#currentDay').html(differentDate);
      $('#title-time').html(
        'Here is what your schedule looked like for this day.'
      );
      $('#dynamic-time').hide();

      let dayOfYear = moment().dayOfYear();
      if (dayOfYear + day === 0) {
        currentYear = previousDate.format('YYYY');
        $('#title-year').html(currentYear);
      }
    } else if (day > 0) {
      currentYear = nextDate.format('YYYY');
      $('#currentDay').html(differentDate);
      $('#title-time').html(
        'Here is what your schedule looks like for this day so far.'
      );
      $('#title-year').html(currentYear);
      $('#dynamic-time').hide();
    } else {
      currentYear = moment().format('YYYY');
      $('#title-time').html(
        'Here is your schedule for today. The current time is: '
      );
      $('#title-year').html(currentYear);
      $('#dynamic-time').show();
      dynamicTime();
    }
  }
/* function to dynamically update the current time into hours, minutes & seconds, set interval to 1000 milliseconds or 1 second */
  function dynamicTime() {
    let currentTime = moment().format('HH:mm:ss');
    $('#dynamic-time').text(currentTime);
    setInterval(dynamicTime, 1000);
  }
/* function to highlight the current block of time in the calendar so user knows what time it is */
  function scheduleFocus() {
    let currentHourInt = parseInt(moment().format('HH'));

    let timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();

    if (day < 0) {
      $('.input-area').css('background-color', '#d3d3d3');
    } else if (day > 0) {
      $('.input-area').css('background-color', '#77dd77');
    } else {
      for (let i = 0; i < timeIDs.length; i++) {
        let timeIDsInt = parseInt(timeIDs[i]);
        if (timeIDsInt < currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#d3d3d3');
        } else if (timeIDsInt === currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#ff6961');
        } else {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#77dd77');
        }
      }
    }
  }
/* function will allow the user to clear the schedule and wipe out any saved events */
  function clearSchedule() {
    $('#clear-button').on('click', function() {
      scheduleObj = {};
      scheduleArr.length = 0;
      scheduleObj['date'] = date;
      scheduleArr.push(scheduleObj);

      localStorage.removeItem(date);
      $('.input-area').val('');

      localStorage.setItem(date, JSON.stringify(scheduleArr));
    });
  }
/* function will display the current days schedule on the page for user to view */
  function displaySchedule() {
    savedSchedule = JSON.parse(localStorage.getItem(date));
    $('.input-area').val('');
    for (let i = 0; i < savedSchedule.length; i++) {
      let getKey = Object.keys(savedSchedule[i]);
      let getValue = Object.values(savedSchedule[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }
/* this function will allow the user to toggle to the previous, current or next day and dynamically update the page to reflect the correct day */
  function changeDay() {
    $('nav').on('click', function(e) {
      let dayButtonID = e.target.id;

      if (dayButtonID === 'previous-day') {
        day--;
        changeActive(dayButtonID);

        previousDate = moment().add(day, 'days');
        date = previousDate.format('LL');
        storeDifferentDate();
        updateTime(previousDate.format('dddd, MMMM Do'));
        displaySchedule();
        scheduleFocus();
        return date;
      } else if (dayButtonID === 'next-day') {
        day++;
        changeActive(dayButtonID);

        nextDate = moment().add(day, 'days');
        date = nextDate.format('LL');
        storeDifferentDate();
        updateTime(nextDate.format('dddd, MMMM Do'));
        displaySchedule();
        scheduleFocus();
        return date;
      } else {
        day = 0;
        dayButtonID = 'current-day';
        changeActive(dayButtonID);

        date = moment().format('LL');
        $('.input-area').val('');
        updateTime();
        displaySchedule();
        scheduleFocus();
        return date;
      }
    });
  }
/* this function will allow the user to toggle to the active page or Today, so they know what is currently on their schedule for today. */
  function changeActive(page) {
    let activeClass = $('#change-div>nav>ul>li.active');

    scheduleArr.length = 0;
    activeClass.removeClass('active');
    $('#' + page)
      .parent('li')
      .addClass('active');
  }

  /* this function will allow the user to save the new calendar event they input in the text box, this data will persist after a browser refresh, saved in local storage */
  function saveEvent() {
    $('.save-button').on('click', function() {
      let trId = $(this)
        .closest('tr')
        .attr('id');
      let textAreaVal = $(this)
        .closest('tr')
        .find('textarea')
        .val()
        .trim();

      storedSchedule = JSON.parse(localStorage.getItem(date));
      scheduleObj = {};

      scheduleObj[trId] = textAreaVal;
      scheduleArr.push(scheduleObj);
      localStorage.setItem(date, JSON.stringify(scheduleArr));

      for (let i = 0; i < storedSchedule.length; i++) {
        if (storedSchedule[i].hasOwnProperty(trId)) {
          storedSchedule[i][trId] = textAreaVal;
          scheduleArr = storedSchedule;
          localStorage.setItem(date, JSON.stringify(scheduleArr));
          return;
        }
      }
    });
  }
});
