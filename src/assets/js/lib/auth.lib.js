const {AuthApi} = require("../api");

class AuthLib {
    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Validate token.
     */
    static async validateToken(token) {
        try {
            const response = await AuthApi.validateUserToken({token})
            if (!response.ok || !response?.isTokenValid) {
                window.location.href = '/login';
            }
        } catch (error) {
            window.location.href = '/login';
        }
    }
}

module.exports = AuthLib