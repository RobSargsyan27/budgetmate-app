class RecordsApi {
    static BASE_URL = 'http://app.budgetmate.com/api/v3/records'

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Array<Object>>}
     * @description Search user records.
     */
    static async searchUserRecords(token, payload){
        const records = await fetch(`${RecordsApi.BASE_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return records.json()
    }

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Response>}
     * @description Count user records.
     */
    static countUserRecords(token, payload){
        return fetch(`${RecordsApi.BASE_URL}/count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
    }

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Blob>}
     * @description Get user records report.
     */
    static async getUserRecordsReport(token, payload){
        const records = await fetch(`${RecordsApi.BASE_URL}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return records.blob()
    }

    /**
     * @param {string} token
     * @returns {Promise<Array<Object>>}
     * @description Get user records.
     */
    static async getUserRecords(token){
        const records = await fetch(RecordsApi.BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return records.json()
    }

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user record.
     */
    static async addUserRecord(token, payload){
        const record = await fetch(RecordsApi.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return record.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<Object>}
     * @description Get user record.
     */
    static async getUserRecord(token, id){
        const record = await fetch(`${RecordsApi.BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return record.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user record.
     */
    static async updateUserRecord(token, id, payload){
        const record = await fetch(`${RecordsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return record.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<void>}
     * @description Delete user record.
     */
    static async deleteUserRecord(token, id){
        await fetch(`${RecordsApi.BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

module.exports = RecordsApi