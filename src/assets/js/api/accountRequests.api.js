const { CookieLib } = require('../lib')

class AccountRequestsApi {
    /**
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user account request.
     */
    static async addUserAccountRequest(payload) {
        const accountAdditionRequest = await fetch(AccountRequestsApi.BASE_URL, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return accountAdditionRequest.json()
    }

    /**
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user account request.
     */
    static async updateUserAccountRequest(id, payload) {
        const accountAdditionRequest = await fetch(`${AccountRequestsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return accountAdditionRequest.json()
    }
}

AccountRequestsApi.BASE_URL = 'http://app.budgetmate.com/api/v1/account-requests'

module.exports = AccountRequestsApi
