const { ActivityLogLib } = require('../lib')
const { AnalyticsApi } = require('../api')
const { AnalyticsEarningsLineChart, AnalyticsExpensesLineChart } = require('../charts')

class Analytics {
    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Object} dateOptions
     * @returns {Promise<void>}
     * @description Set user overview details.
     */
    static async setUserOverviewDetails(startDate, endDate, dateOptions) {
        const { monthlyExpenses, monthlyEarnings } = await AnalyticsApi.getUserRecordsOverview(startDate, endDate)

        const expenseOverview = document.getElementById('expenseOverview')
        const earningsOverview = document.getElementById('earningsOverview')
        const cashFlow = document.getElementById('cashFlow')
        const outlookProgressBar = document.getElementById('outlookProgressBar')
        const expensesLineChartDate = document.getElementById('expensesLineChartDate')
        const earningsLineChartDate = document.getElementById('earningsLineChartDate')
        const overviewDates = document.getElementById('overviewDates')

        const dateFields = [ expensesLineChartDate, earningsLineChartDate, overviewDates ]
        dateFields.forEach((item) => {
            item.textContent = `${startDate.toLocaleString('en-US', dateOptions)} - ${
                endDate.toLocaleString('en-US', dateOptions)
            }`
        })

        expenseOverview.textContent = monthlyExpenses
        earningsOverview.textContent = monthlyEarnings
        outlookProgressBar.style.width = `${Math.ceil(monthlyEarnings * 100 / (monthlyEarnings + monthlyExpenses))}%`
        cashFlow.textContent = (monthlyEarnings - monthlyExpenses).toString()
        cashFlow.style.color = monthlyEarnings - monthlyExpenses > 0 ? '#008000' : '#c80000'
    }

    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Object} dateOptions
     * @returns {Promise<void>}
     * @description Set user monthly overview listener.
     */
    static async setUserMonthOverviewListener(startDate, endDate, dateOptions) {
        const { monthlyExpenses, monthlyEarnings } = await AnalyticsApi.getUserRecordsOverview(startDate, endDate)

        const expenseOverview = document.getElementById('expenseOverview')
        const earningsOverview = document.getElementById('earningsOverview')
        const cashFlow = document.getElementById('cashFlow')
        const outlookProgressBar = document.getElementById('outlookProgressBar')
        const overviewDates = document.getElementById('overviewDates')

        overviewDates.textContent = `${startDate.toLocaleString('en-US', dateOptions)} - ${
            endDate.toLocaleString('en-US', dateOptions)
        }`

        expenseOverview.textContent = monthlyExpenses
        earningsOverview.textContent = monthlyEarnings
        cashFlow.textContent = (monthlyEarnings - monthlyExpenses).toString()
        cashFlow.style.color = monthlyEarnings - monthlyExpenses > 0 ? '#008000' : '#c80000'

        outlookProgressBar.style.width = monthlyEarnings && monthlyExpenses
            ? `${Math.ceil(monthlyEarnings * 100 / (monthlyEarnings + monthlyExpenses))}%`
            : '0'
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init() {
        await AnalyticsEarningsLineChart.init()
        await AnalyticsExpensesLineChart.init()

        const options = { year: 'numeric', month: 'short' }
        let startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0, 0)
        let endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0)

        await Analytics.setUserOverviewDetails(startDate, endDate, options)

        if(!Analytics.listenersBound){
            document.getElementById('previousMonthOverview').addEventListener('click', async () => {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1)
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1)

                await Analytics.setUserMonthOverviewListener(startDate, endDate, options)
            })

            document.getElementById('nextMonthOverview').addEventListener('click', async () => {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1)
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1)

                await Analytics.setUserMonthOverviewListener(startDate, endDate, options)
            })

            Analytics.listenersBound = true
        }

        ActivityLogLib.addActionToActivityLog('Analytics')
        ActivityLogLib.setUserActivityLogDetails()
    }
}

Analytics.listenersBound = false

module.exports = Analytics
