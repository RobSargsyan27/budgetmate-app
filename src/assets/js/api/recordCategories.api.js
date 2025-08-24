const { CookieLib } = require('../lib')

class RecordCategoriesApi {
    /**
     * @returns {Promise<Array<Object>>}
     * @description Get record categories.
     */
    static async getRecordCategories() {
        const recordCategories = await fetch(RecordCategoriesApi.BASE_URL, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return recordCategories.json()
    }
}

RecordCategoriesApi.BASE_URL = 'http://app.budgetmate.com/api/v1/record-categories'

module.exports = RecordCategoriesApi
