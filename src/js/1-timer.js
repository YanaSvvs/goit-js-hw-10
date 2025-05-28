
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; 
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css"; 

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null; 
let countdownInterval = null; 

startButton.disabled = true;

const options = {
    enableTime: true,    
    time_24hr: true,     
    defaultDate: new Date(), 
    minuteIncrement: 1,  
    onClose(selectedDates) { 
        const selectedDate = selectedDates[0];
        const now = new Date();

        if (selectedDate <= now) {
            iziToast.error({
                title: 'Помилка',
                message: 'Будь ласка, виберіть дату в майбутньому!',
                position: 'topRight',
                timeout: 3000, 
            });
            startButton.disabled = true; 
            userSelectedDate = null;     
        } else {
            userSelectedDate = selectedDate; 
            startButton.disabled = false;    
           
        }
    },
};


flatpickr(datetimePicker, options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

function startTimer() {
    if (!userSelectedDate) return; 

    startButton.disabled = true;    
    datetimePicker.disabled = true;

    countdownInterval = setInterval(() => {
        const now = new Date();
        const timeDifference = userSelectedDate - now; 

        if (timeDifference <= 0) {
            clearInterval(countdownInterval); 
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
            datetimePicker.disabled = false; 
           
            iziToast.info({
                title: 'Завершено',
                message: 'Відлік часу закінчився!',
                position: 'topRight',
            });
            return;
        }

        const time = convertMs(timeDifference);
        updateTimerDisplay(time);
    }, 1000);
}

startButton.addEventListener('click', startTimer);
