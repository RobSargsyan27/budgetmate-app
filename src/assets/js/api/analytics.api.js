class AnalyticsApi {
    /**
     * @param {string} token
     * @returns {Promise<Object>}
     * @description Get user dashboard analytics.
     */
    static async getUserDashboardAnalytics(token) {
        const analytics = await fetch(`${AnalyticsApi.BASE_URL}/dashboard`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return analytics.json()
    }

    /**
     * @param {string} token
     * @returns {Promise<Object>}
     * @description Get user dashboard category pie chart.
     */
    static async getUserDashboardCategoryPieChart(token) {
        const analytics = await fetch(`${AnalyticsApi.BASE_URL}/dashboard/categories-pie`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return analytics.json()
    }

    /**
     * @param {string} token
     * @returns {Promise<Object>}
     * @description Get user dashboard expenses line chart.
     */
    static async getUserDashboardExpensesLineChart(token) {
        const analytics = await fetch(`${AnalyticsApi.BASE_URL}/dashboard/expenses-line-chart`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return analytics.json()
    }

    /**
     * @param {string} token
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Promise<Object>}
     * @description Get user records overview.
     */
    static async getUserRecordsOverview(token, startDate, endDate) {
        const _startDate = startDate.toISOString()
        const _endDate = endDate.toISOString()

        const overview = await fetch(
            `${AnalyticsApi.BASE_URL}/overview?startDate=${_startDate}&endDate=${_endDate}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return overview.json()
    }

    /**
     * @param {string} token
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {string} recordType
     * @returns {Promise<Object>}
     * @description Get user records overview line chart.
     */
    static async getUserRecordsOverviewLineChart(token, startDate, endDate, recordType) {
        const _startDate = startDate.toISOString()
        const _endDate = endDate.toISOString()

        const overview = await fetch(
            `${AnalyticsApi.BASE_URL}/overview-line?startDate=${_startDate}&endDate=${_endDate}&recordType=${recordType}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return overview.json()
    }
}

AnalyticsApi.BASE_URL = 'http://app.budgetmate.com/api/v3/analytics'

module.exports = AnalyticsApi
