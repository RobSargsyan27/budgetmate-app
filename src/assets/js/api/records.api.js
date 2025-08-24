const { CookieLib } = require('../lib')

class RecordsApi {
    /**
     * @param {Object} payload
     * @returns {Promise<Array<Object>>}
     * @description Search user records.
     */
    static async searchUserRecords( payload) {
        const records = await fetch(`${RecordsApi.BASE_URL}/search`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return records.json()
    }

    /**
     * @param {Object} payload
     * @returns {Promise<number>}
     * @description Count user records.
     */
    static async countUserRecords( payload) {
        const response = await fetch(`${RecordsApi.BASE_URL}/count`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        const text = await response.text()
        return Number.parseInt(text, 10)
    }

    /**
     * @param {Object} payload
     * @returns {Promise<Blob>}
     * @description Get user records report.
     */
    static async getUserRecordsReport( payload) {
        const records = await fetch(`${RecordsApi.BASE_URL}/report`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return records.blob()
    }

    /**
     * @returns {Promise<Array<Object>>}
     * @description Get user records.
     */
    static async getUserRecords() {
        const records = await fetch(RecordsApi.BASE_URL, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return records.json()
    }

    /**
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user record.
     */
    static async addUserRecord( payload) {
        const record = await fetch(RecordsApi.BASE_URL, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return record.json()
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     * @description Get user record.
     */
    static async getUserRecord( id) {
        const record = await fetch(`${RecordsApi.BASE_URL}/${id}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return record.json()
    }

    /**
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user record.
     */
    static async updateUserRecord( id, payload) {
        const record = await fetch(`${RecordsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return record.json()
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     * @description Delete user record.
     */
    static async deleteUserRecord( id) {
        await fetch(`${RecordsApi.BASE_URL}/${id}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })
    }
}

RecordsApi.BASE_URL = 'http://app.budgetmate.com/api/v3/records'

module.exports = RecordsApi
