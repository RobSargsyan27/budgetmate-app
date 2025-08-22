class UsersApi {
    /**
     * @param {string} token
     * @returns {Promise<Object>}
     * @description Get user.
     */
    static async getUser(token) {
        const user = await fetch(UsersApi.BASE_URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return user.json()
    }

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user.
     */
    static async updateUser(token, payload) {
        const user = await fetch(UsersApi.BASE_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return user.json()
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Delete user.
     */
    static async deleteUser(token) {
        await fetch(UsersApi.BASE_URL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async getUserNotifications(token) {
        const notifications = await fetch(`${UsersApi.BASE_URL}/notifications`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return notifications.json()
    }
}

UsersApi.BASE_URL = 'http://app.budgetmate.com/api/v3/users'

module.exports = UsersApi
