class AccountsApi {
    /**
     * @param {string} token
     * @returns {Promise<Array<Object>>}
     * @description Get user accounts.
     */
    static async getUserAccounts(token) {
        const accounts = await fetch(AccountsApi.BASE_URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return accounts.json()
    }

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user account.
     */
    static async addUserAccount(token, payload) {
        const account = await fetch(AccountsApi.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return account.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<Object>}
     * @description Get user account.
     */
    static async getUserAccount(token, id) {
        const account = await fetch(`${AccountsApi.BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return account.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user account.
     */
    static async updateUserAccount(token, id, payload) {
        const account = await fetch(`${AccountsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return account.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<void>}
     * @description Delete user account.
     */
    static async deleteUserAccount(token, id) {
        await fetch(`${AccountsApi.BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
    }
}

AccountsApi.BASE_URL = 'http://app.budgetmate.com/api/v3/accounts'

module.exports = AccountsApi
