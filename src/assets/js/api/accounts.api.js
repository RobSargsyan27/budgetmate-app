const { CookieLib } = require('../lib')

class AccountsApi {
    /**
     * @returns {Promise<Array<Object>>}
     * @description Get user accounts.
     */
    static async getUserAccounts() {
        const accounts = await fetch(AccountsApi.BASE_URL, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return accounts.json()
    }

    /**
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user account.
     */
    static async addUserAccount( payload) {
        const account = await fetch(AccountsApi.BASE_URL, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return account.json()
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     * @description Get user account.
     */
    static async getUserAccount( id) {
        const account = await fetch(`${AccountsApi.BASE_URL}/${id}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return account.json()
    }

    /**
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user account.
     */
    static async updateUserAccount( id, payload) {
        const account = await fetch(`${AccountsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return account.json()
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     * @description Delete user account.
     */
    static async deleteUserAccount( id) {
        await fetch(`${AccountsApi.BASE_URL}/${id}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })
    }
}

AccountsApi.BASE_URL = 'http://app.budgetmate.com/api/v3/accounts'

module.exports = AccountsApi
