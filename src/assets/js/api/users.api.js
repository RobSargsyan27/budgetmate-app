const { CookieLib } = require('../lib')

class UsersApi {
    /**
     * @returns {Promise<Object>}
     * @description Get user.
     */
    static async getUser() {
        const user = await fetch(UsersApi.BASE_URL, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return user.json()
    }

    /**
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user.
     */
    static async updateUser( payload) {
        const user = await fetch(UsersApi.BASE_URL, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return user.json()
    }

    /**
     * @returns {Promise<void>}
     * @description Delete user.
     */
    static async deleteUser() {
        await fetch(UsersApi.BASE_URL, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })
    }

    static async getUserNotifications() {
        const notifications = await fetch(`${UsersApi.BASE_URL}/notifications`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return notifications.json()
    }
}

UsersApi.BASE_URL = 'http://app.budgetmate.com/api/v3/users'

module.exports = UsersApi
