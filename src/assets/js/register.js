import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'jquery.easing/jquery.easing.min.js'
import 'chart.js/auto'
import 'joi-browser/dist/joi-browser'

import '../scss/custom.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

import * as bootstrap from 'bootstrap'

import { AuthApi } from './api'

/**
 * @param {Element} errorModalBody
 * @param {Modal} errorModal
 * @param {string} text
 * @description Show error.
 */
function showError(errorModalBody, errorModal, text) {
    errorModalBody.textContent = text
    errorModal.show()
}

/**
 * @returns {Object}
 * @description Get form fields.
 */
function getFormFields() {
    const firstname = document.getElementById('inputFirstName').value
    const lastname = document.getElementById('inputLastName').value
    const email = document.getElementById('inputEmail').value
    const password = document.getElementById('inputPassword').value
    const repeatPassword = document.getElementById('inputRepeatPassword').value
    const receiveNewsLetters = document.getElementById('inputNewsLetter').checked
    const termsCheckbox = document.getElementById('inputTermsConditions').checked

    return { firstname, lastname, email, password, receiveNewsLetters, repeatPassword, termsCheckbox }
}

/**
 * @param {Element} emailModal
 * @param {Element} errorModal
 * @param {Element} errorModalBody
 * @returns {Promise<void>}
 * @description Submit form.
 */
async function submitForm(emailModal, errorModal, errorModalBody) {
    try{
        const userForm = getFormFields()
        await AuthApi.registerUser(userForm)
        emailModal.show()
        setTimeout(() => window.location.href = '/login', 1000 * 10)
    }catch (error) {
        showError(errorModalBody, errorModal, error.message)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm')
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'))
    const errorModalBody = document.getElementById('errorModal-body')
    const emailModal = new bootstrap.Modal(document.getElementById('emailModal'))

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        const { password, repeatPassword, termsCheckbox } = getFormFields()
        if (password !== repeatPassword) {
            showError(errorModalBody, errorModal, 'Repeat password correctly!')
            return
        }
        if (!termsCheckbox) {
            showError(errorModalBody, errorModal, 'You must agree to the terms and conditions.')
            return
        }

        await submitForm(emailModal, errorModal, errorModalBody)
    })
})
