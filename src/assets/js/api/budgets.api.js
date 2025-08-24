const { CookieLib } = require('../lib')

class BudgetsApi {
    /**
     * @returns {Promise<Array<Object>>}
     * @description Get user budgets.
     */
    static async getUserBudgets() {
        const budgets = await fetch(BudgetsApi.BASE_URL, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return budgets.json()
    }

    /**
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user budget.
     */
    static async addUserBudget( payload) {
        const budgets = await fetch(BudgetsApi.BASE_URL, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return budgets.json()
    }

    /**
     * @returns {Promise<Array<Object>>}
     * @description Get user budgets current balance.
     */
    static async getUserBudgetsCurrentBalance() {
        const budgetsCurrentBalance = await fetch(`${BudgetsApi.BASE_URL}/current-balance`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return budgetsCurrentBalance.json()
    }

    /**
     * @returns {Promise<Blob>}
     * @description Get user budgets report.
     */
    static async getUserBudgetsReport() {
        const budgetsCurrentBalance = await fetch(`${BudgetsApi.BASE_URL}/report`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return budgetsCurrentBalance.blob()
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     * @description Get user budget.
     */
    static async getUserBudget( id) {
        const budget = await fetch(`${BudgetsApi.BASE_URL}/${id}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return budget.json()
    }

    /**
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user budget.
     */
    static async updateUserBudget (id, payload) {
        const budget = await fetch(`${BudgetsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            },
            body: JSON.stringify(payload)
        })

        return budget.json()
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     * @description Delete user budget.
     */
    static async deleteUserBudget( id) {
        await fetch(`${BudgetsApi.BASE_URL}/${id}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })
    }
}

BudgetsApi.BASE_URL = 'http://app.budgetmate.com/api/v3/budgets'

module.exports = BudgetsApi
