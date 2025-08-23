import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'jquery.easing/jquery.easing.min.js'
import 'chart.js/auto'
import 'joi-browser/dist/joi-browser'

import '../scss/custom.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

import {AuthApi} from './api'

function showMessage(message, text, type, color) {
    message.style.display = 'block'
    message.textContent = text
    message.classList.add(type)
    message.style.color = color
}

/**
 * @param {Element} loginForm
 * @param {Element} message
 * @returns void
 * @description Set login form listener.
 */
function setLoginFormListener(loginForm, message) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const email = document.getElementById('inputEmail').value
        const password = document.getElementById('inputPassword').value

        try {
            const response = await AuthApi.loginUser({email, password})
            const { token } = response

            if (token) {
                const activity = {page: 'User logged in.', date: new Date()}
                localStorage.setItem('token', token)
                sessionStorage.setItem('activityLog', JSON.stringify([activity]))
                window.location.href = '/dashboard'
            }
        } catch (error) {
            showMessage(message, 'An error occurred. Please try again later.', 'alert-danger', 'red')
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    const message = document.getElementById('message')

    setLoginFormListener(loginForm, message)
})
