class AccountRequestsApi {
    static BASE_URL = 'http://app.budgetmate.com/api/v1/account-requests'

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user account request.
     */
    static async addUserAccountRequest(token, payload){
        const accountAdditionRequest = await fetch(AccountRequestsApi.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return accountAdditionRequest.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user account request.
     */
    static async updateUserAccountRequest(token, id, payload){
        const accountAdditionRequest = await fetch(`${AccountRequestsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return accountAdditionRequest.json()
    }
}

module.exports = AccountRequestsApi