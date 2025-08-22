class BudgetsApi {
    static BASE_URL = 'http://app.budgetmate.com/api/v3/budgets'

    /**
     * @param {string} token
     * @returns {Promise<Array<Object>>}
     * @description Get user budgets.
     */
    static async getUserBudgets(token) {
        const budgets = await fetch(BudgetsApi.BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return budgets.json()
    }

    /**
     * @param {string} token
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Add user budget.
     */
    static async addUserBudget(token, payload){
        const budgets = await fetch(BudgetsApi.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return budgets.json()
    }

    /**
     * @param {string} token
     * @returns {Promise<Array<Object>>}
     * @description Get user budgets current balance.
     */
    static async getUserBudgetsCurrentBalance(token){
        const budgetsCurrentBalance = await fetch(`${BudgetsApi.BASE_URL}/current-balance`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return budgetsCurrentBalance.json()
    }

    /**
     * @param {string} token
     * @returns {Promise<Blob>}
     * @description Get user budgets report.
     */
    static async getUserBudgetsReport(token) {
        const budgetsCurrentBalance = await fetch(`${BudgetsApi.BASE_URL}/report`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return budgetsCurrentBalance.blob()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<Object>}
     * @description Get user budget.
     */
    static async getUserBudget(token, id){
        const budget = await fetch(`${BudgetsApi.BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return budget.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @param {Object} payload
     * @returns {Promise<Object>}
     * @description Update user budget.
     */
    static async updateUserBudget(token, id, payload){
        const budget = await fetch(`${BudgetsApi.BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        return budget.json()
    }

    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<void>}
     * @description Delete user budget.
     */
    static async deleteUserBudget(token, id) {
        await fetch(`${BudgetsApi.BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
    }
}

module.exports = BudgetsApi