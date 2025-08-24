const $ = require('jquery')

const { ActivityLogLib, ValidationLib } = require('../lib')
const { UsersApi } = require('../api')

class Profile {
    /**
     * @param {Object} payload
     * @returns {boolean}
     * @description Validate user update form.
     */
    static validateUserUpdateForm(payload) {
        Object.keys(payload).forEach(field => !payload[field] && delete payload[field])

        const { error } = ValidationLib.getUpdateUserValidationSchema().validate(payload)

        const modalBody = document.getElementById('errorModalBody')
        modalBody.innerHTML = ''

        if (error) {
            error.details.forEach(detail => {
                const field = detail.path[0]
                const message = detail.message
                const alertDiv = document.createElement('div')
                alertDiv.classList.add('alert', 'alert-danger', 'mb-2')
                alertDiv.textContent = `${field}: ${message}`
                modalBody.appendChild(alertDiv)
            })

            $('#errorModal').modal('show')
            return false
        }

        return true
    }

    /**
     * @returns {Object}
     * @description Get form fields.
     */
    static getFormFields() {
        const profileFirstname = document.getElementById('updateFirstname')
        const profileLastname = document.getElementById('updateLastname')
        const profileCountry = document.getElementById('updateCountry')
        const profileCity = document.getElementById('updateCity')
        const profileAddress = document.getElementById('updateAddress')
        const profilePostalCode = document.getElementById('updatePostalCode')
        const profileAvatarColor = document.getElementById('updateAvatarColor')

        return {
            profileFirstname,
            profileLastname,
            profileCountry,
            profileCity,
            profileAddress,
            profilePostalCode,
            profileAvatarColor
        }
    }

    /**
     * @param {Object} payload
     * @description Set form details.
     */
    static setFormDetails(payload) {
        const { firstname, lastname, username, role, avatarColor, country, address, city, postalCode } = payload
        const {
            profileFirstname,
            profileLastname,
            profileCountry,
            profileCity,
            profileAddress,
            profilePostalCode,
            profileAvatarColor
        } = Profile.getFormFields()
        const profileUsername = document.getElementById('profileUsername')
        const profileRole = document.getElementById('profileRole')
        const profileAvatar = document.getElementById('profileAvatar')

        profileAvatar.textContent = `${firstname.substring(0, 1).toUpperCase()} ${
            lastname.substring(0, 1).toUpperCase()
        }`
        profileAvatar.style.backgroundColor = avatarColor || '#00008B'
        profileUsername.textContent = username
        profileRole.textContent = role

        profileFirstname.value = firstname
        profileLastname.value = lastname
        profileCountry.value = country
        profileAddress.value = address
        profileCity.value = city
        profilePostalCode.value = postalCode
        profileAvatarColor.value = avatarColor || '#00008B'
    }

    /**
     * @description Set update user listener.
     */
    static setUpdateUserListener() {
        document.getElementById('updateProfileForm').addEventListener('submit', async function(event) {
            event.preventDefault()
            const submitButton = document.getElementById('submitButton')

            const {
                profileFirstname,
                profileLastname,
                profileCountry,
                profileCity,
                profileAddress,
                profilePostalCode,
                profileAvatarColor
            } = Profile.getFormFields()
            const payload = {
                firstname: profileFirstname.value,
                lastname: profileLastname.value,
                country: profileCountry.value,
                address: profileAddress.value,
                city: profileCity.value,
                postalCode: profilePostalCode.value,
                avatarColor: profileAvatarColor.value
            }

            if (Profile.validateUserUpdateForm(payload)) {
                const result = await UsersApi.updateUser(payload)

                Profile.setFormDetails(result)
                submitButton.blur()

                document.getElementById('updateProfileForm').focus()
            }
        })
    }

    /**
     * @description Set delete user listener.
     */
    static setDeleteUserListener() {
        document.getElementById('deleteAccountButton').addEventListener('click', async () => {
            await UsersApi.deleteUser()
            window.location.href = '/login'
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init() {
        const user = await UsersApi.getUser()

        Profile.setFormDetails(user)

        if(!Profile.listenersBound){
            Profile.setUpdateUserListener()
            Profile.setDeleteUserListener()
            Profile.listenersBound = true
        }

        ActivityLogLib.addActionToActivityLog('Profile')
        ActivityLogLib.setUserActivityLogDetails()
    }
}

Profile.listenersBound = false

module.exports = Profile
