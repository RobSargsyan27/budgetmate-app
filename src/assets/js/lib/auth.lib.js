const { AuthApi } = require('../api')

class AuthLib {
    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Validate token.
     */
    static async validateToken(token) {
        try {
            const response = await AuthApi.validateUserToken({ token })
            console.log(response)
            if (!response.ok || !response?.isTokenValid) {
                console.log('not valid')
                window.location.href = '/login'
            }
        } catch (error) {
            console.log('not valid error')
            window.location.href = '/login'
        }
    }
}

module.exports = AuthLib
