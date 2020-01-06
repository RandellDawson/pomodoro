const getMinsAndSecs  = time => {
    const minutes = parseInt(time % 3600 / 60);
    const seconds = time % 60;
    return [minutes, seconds];
}

const leadingZero = n => n < 10 ? ('0' + n) : n;

const updateTimerLabel = () => {
    const [minutes, seconds] = getMinsAndSecs(timeLeft);
    const timeStr = leadingZero(minutes) + ':' + leadingZero(seconds);
    timeLeftElem.innerText = timeStr;
}

const setTimerLength = ({target}) => {
    const type = target.classList.contains('session-btn') ? 'Session' : 'Break';
    const whichTimer = type === 'Session' ? sessionLength : breakLength;
    const amount = Number(target.value);
    const minutes = Number(whichTimer.innerText) + amount;
    if (minutes > 0 && minutes <= 60) {
        whichTimer.innerText = minutes;
        if (type === 'Session') {
            sessionTime = minutes;
            timeLeft = sessionTime * 60;
            updateTimerLabel();
        }
        else {
            breakTime = minutes;
        }
    }
}

const updateTime = () => {
    updateTimerLabel();
    let [minutes, seconds] = getMinsAndSecs(timeLeft);
    if (minutes === 0 && seconds === 0) { // current timer ends / new timer starts
        timeLeft =  60 * (currentTimer === 'Session' ? breakTime  : sessionTime);
        /* Since the previous timer has finished, do the following:
          1) stop/clear the current timer
          2) change the timer-label element text to the new timer type
          3) play the beep sound
         */
        clearTimeout(setTimeoutId);
        currentTimer = currentTimer === 'Session' ? 'Break' : 'Session';
        timerLabel.innerText = currentTimer;
        beep.play();
    }
    timeLeft--;
    setTimeoutId = setTimeout(updateTime, 1000);
}

const changeTimerStatus = ( ) => {
  startStopBtn.innerText = timerOn ? 'Pause' : 'Start' ;
  if (timerOn) {
    updateTime();
  }
  else {
    clearTimeout(setTimeoutId);
    timeLeft++; // because timeLeft was already decremented
  }
}

const hideMiddle = hide => {
    if(!hide){
      middle.style.height = (middleHeight -10) + 'px';
      middle.style.paddingTop = '5px';
      middle.style.paddingBottom = '5px';
    }
    else{
      middle.style.height = '0';
      middle.style.paddingTop = '0px';
      middle.style.paddingBottom = '0px';
    }
}

const initialize = () => {
    setTimeoutId = null;
    timerOn = false;
    sessionTime = 25;  // default Session time
    breakTime = 5;  // default Break time
    timeLeft = sessionTime * 60;
    sessionLength.innerText = sessionTime;
    breakLength.innerText = breakTime;
    currentTimer = 'Session';
    startStopBtn.innerText = 'Start';
    timerLabel.innerText = currentTimer;
    updateTimerLabel();
};

const timeLeftElem = document.getElementById('time-left');
const startStopBtn = document.getElementById('start_stop');
const resetBtn = document.getElementById('reset');
const timerLabel = document.getElementById('timer-label');
const sessionLength = document.getElementById('session-length');
const breakLength = document.getElementById('break-length');
const sessionIncBtn = document.getElementById('session-increment');
const sessionDecBtn = document.getElementById('session-decrement');
const breakIncBtn = document.getElementById('break-increment');
const breakDecBtn = document.getElementById('break-decrement');
const middle = document.querySelector('.timer-lengths-controls');
const beep = document.getElementById('beep');
const middleHeight = +middle.clientHeight; // for use later to hide/show this div
middle.style.height = (middleHeight -10) +  'px'; // allows for 5px of top/bottom padding

let setTimeoutId, timerOn, currentTimer;
let sessionTime, breakTime, timeLeft;
initialize();

startStopBtn.addEventListener('click', () => {
    hideMiddle(true);
    timerOn = !timerOn;
    changeTimerStatus();
});

resetBtn.addEventListener('click', () => {
    beep.pause();
    beep.currentTime = 0;
    clearTimeout(setTimeoutId);
    initialize();
    hideMiddle(false);
});

sessionIncBtn.addEventListener('click', setTimerLength)
sessionDecBtn.addEventListener('click', setTimerLength)
breakIncBtn.addEventListener('click', setTimerLength)
breakDecBtn.addEventListener('click', setTimerLength)
