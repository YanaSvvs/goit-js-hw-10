
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const delayInput = this.elements.delay;
    const stateInput = this.querySelector('input[name="state"]:checked'); 

    if (!delayInput.value || !stateInput) {
        iziToast.warning({
            title: 'Увага',
            message: 'Будь ласка, заповніть всі поля!',
            position: 'topRight',
        });
        return;
    }

    const delay = Number(delayInput.value);
    const state = stateInput.value;

    createPromise(delay, state)
        .then(delayValue => {
            iziToast.success({
                title: '✅ Fulfilled',
                message: `Fulfilled promise in ${delayValue}ms`,
                position: 'topRight',
                backgroundColor: '#59A10D', 
                titleColor: '#fff',
                messageColor: '#fff',
            });
        })
        .catch(delayValue => {
       
            iziToast.error({
                title: '❌ Rejected',
                message: `Rejected promise in ${delayValue}ms`,
                position: 'topRight',
                backgroundColor: '#EF4040', 
                titleColor: '#fff',
                messageColor: '#fff',
            });
        });

    this.reset();
});

/**
 * Створює проміс, який виконується або відхиляється через задану затримку.
 * @param {number} delay - Затримка в мілісекундах.
 * @param {string} state - Стан ('fulfilled' або 'rejected').
 * @returns {Promise<number>} - Проміс, що повертає значення затримки.
 */
function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay); 
            } else {
                reject(delay);  
            }
        }, delay);
    });
}