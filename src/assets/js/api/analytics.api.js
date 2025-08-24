const { CookieLib } = require('../lib')

class AnalyticsApi {
    /**
     * @returns {Promise<Object>}
     * @description Get user dashboard analytics.
     */
    static async getUserDashboardAnalytics() {
        const analytics = await fetch(`${AnalyticsApi.BASE_URL}/dashboard`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return analytics.json()
    }

    /**
     * @returns {Promise<Object>}
     * @description Get user dashboard category pie chart.
     */
    static async getUserDashboardCategoryPieChart() {
        const analytics = await fetch(`${AnalyticsApi.BASE_URL}/dashboard/categories-pie`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return analytics.json()
    }

    /**
     * @returns {Promise<Object>}
     * @description Get user dashboard expenses line chart.
     */
    static async getUserDashboardExpensesLineChart() {
        const analytics = await fetch(`${AnalyticsApi.BASE_URL}/dashboard/expenses-line-chart`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
            }
        })

        return analytics.json()
    }

    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Promise<Object>}
     * @description Get user records overview.
     */
    static async getUserRecordsOverview(startDate, endDate) {
        const _startDate = startDate.toISOString()
        const _endDate = endDate.toISOString()

        const overview = await fetch(
            `${AnalyticsApi.BASE_URL}/overview?startDate=${_startDate}&endDate=${_endDate}`,
            {
                method: 'GET',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
                }
            }
        )

        return overview.json()
    }

    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {string} recordType
     * @returns {Promise<Object>}
     * @description Get user records overview line chart.
     */
    static async getUserRecordsOverviewLineChart( startDate, endDate, recordType) {
        const _startDate = startDate.toISOString()
        const _endDate = endDate.toISOString()

        const overview = await fetch(
            `${AnalyticsApi.BASE_URL}/overview-line?startDate=${_startDate}&endDate=${_endDate}&recordType=${recordType}`,
            {
                method: 'GET',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
                }
            }
        )

        return overview.json()
    }

    /**
     * @returns {Promise<Number>}
     * @description Get users count.
     */
    static async getUserCount() {
        const response = await fetch(`${AnalyticsApi.BASE_URL}/overview/users`,
            {
                method: 'GET',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "X-XSRF-TOKEN": CookieLib.getCookie('X-XSRF-TOKEN')
                }
            }
        )
        const text = await response.text();
        return Number.parseInt(text, 10)
    }
}

AnalyticsApi.BASE_URL = 'http://app.budgetmate.com/api/v3/analytics'

module.exports = AnalyticsApi
