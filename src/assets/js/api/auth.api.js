const {CookieLib} = require("../lib");

class AuthApi {
    /**
     * @param {Object} payload
     * @returns {Promise<void>}
     * @description Register user.
     */
    static async registerUser(payload) {
        await fetch(`${AuthApi.BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    }

    /**
     * @param {Object} payload
     * @returns {Promise<void>}
     * @description Login user.
     */
    static async loginUser(payload) {
        const response = await fetch(`${AuthApi.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const xsrfToken = response.headers.get('X-CSRF-TOKEN');
        console.log(response.headers)
        if (xsrfToken) {
            document.cookie = `X-XSRF-TOKEN=${xsrfToken}; path=/`;
        }
    }

    /**
     * @returns {Promise<void>}
     * @description Logout user.
     */
    static async logoutUser(){
        await fetch('${AuthApi.BASE_URL}/logout', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })
    }
}

AuthApi.BASE_URL = 'http://app.budgetmate.com/api/v2/auth'

module.exports = AuthApi
