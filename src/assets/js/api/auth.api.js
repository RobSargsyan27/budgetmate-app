class AuthApi {
    static BASE_URL = 'http://app.budgetmate.com/api/v2/auth'

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
     * @returns {Promise<Object>}
     * @description Login user.
     */
    static async loginUser(payload) {
        const token = await fetch(`${AuthApi.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        return token.json()
    }

    /**
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Validate user token.
     */
    static async validateUserToken(payload){
        const response = await fetch(`${AuthApi.BASE_URL}/validate-token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        return response.json()
    }
}

module.exports = AuthApi