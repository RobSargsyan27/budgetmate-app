class RecordCategoriesApi {
    static BASE_URL = 'http://app.budgetmate.com/api/v1/record-categories'

    /**
     * @param {string} token
     * @returns {Promise<Array<Object>>}
     * @description Get record categories.
     */
    static async getRecordCategories(token){
        const recordCategories = await fetch(RecordCategoriesApi.BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return recordCategories.json()
    }
}

module.exports = RecordCategoriesApi