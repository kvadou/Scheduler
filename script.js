var scheduleArr = [];
var scheduleObj = {};
var dateArr = [];
var dateObj = {};
var storedSchedule;
var savedSchedule;
var date = moment().format('LL');
previous = 0;
next = 0;
day = 0;

$(document).ready(function() {
  init();

  function init() {
    storeTodaysDate();
    changeDay();
    updateTime();
    displaySchedule();
    scheduleFocus();
    saveEvent();
    clearSchedule();
  }

  function storeTodaysDate() {
    savedSchedule = JSON.parse(localStorage.getItem(date));

    if (savedSchedule === null) {
      console.log('creating');
      dateObj['date'] = date;
      dateArr.push(dateObj);
      localStorage.setItem(date, JSON.stringify(dateArr));
    }
  }

  function storeDifferentDate() {
    var existingStorage = JSON.parse(localStorage.getItem(date));

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

  function updateTime(differentDate) {
    if (differentDate !== date) {
      var currentDate = moment().format('dddd, MMMM Do');
      var currentYear = moment().format('YYYY');
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

      var dayOfYear = moment().dayOfYear();
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

  function dynamicTime() {
    var currentTime = moment().format('HH:mm:ss');
    $('#dynamic-time').text(currentTime);
    setInterval(dynamicTime, 1000);
  }

  function scheduleFocus() {
    var currentHourInt = parseInt(moment().format('HH'));

    var timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();

    if (day < 0) {
      $('.input-area').css('background-color', '#d3d3d3');
    } else if (day > 0) {
      $('.input-area').css('background-color', '#77dd77');
    } else {
      for (var i = 0; i < timeIDs.length; i++) {
        var timeIDsInt = parseInt(timeIDs[i]);
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
    // setInterval(scheduleFocus, 1000);
  }

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

  function displaySchedule() {
    savedSchedule = JSON.parse(localStorage.getItem(date));
    $('.input-area').val('');
    for (var i = 0; i < savedSchedule.length; i++) {
      var getKey = Object.keys(savedSchedule[i]);
      var getValue = Object.values(savedSchedule[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }

  function changeDay() {
    $('nav').on('click', function(e) {
      var dayButtonID = e.target.id;

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

  function changeActive(page) {
    var activeClass = $('#change-div>nav>ul>li.active');

    scheduleArr.length = 0;
    activeClass.removeClass('active');
    $('#' + page)
      .parent('li')
      .addClass('active');
  }

  function saveEvent() {
    $('.save-button').on('click', function() {
      var trId = $(this)
        .closest('tr')
        .attr('id');
      var textAreaVal = $(this)
        .closest('tr')
        .find('textarea')
        .val()
        .trim();

      storedSchedule = JSON.parse(localStorage.getItem(date));
      scheduleObj = {};

      scheduleObj[trId] = textAreaVal;
      scheduleArr.push(scheduleObj);
      localStorage.setItem(date, JSON.stringify(scheduleArr));

      for (var i = 0; i < storedSchedule.length; i++) {
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
