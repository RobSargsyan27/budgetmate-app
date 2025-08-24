const Chart = require('chart.js/auto')
const { AnalyticsApi } = require('../api')

class DashboardLineChart {
    static async renderMonthlyExpensesLineChart() {
        const monthlyExpensesLineChart = document.getElementById('monthlyExpensesLineChart').getContext('2d')
        const { labels, data } = await AnalyticsApi.getUserDashboardExpensesLineChart()

        new Chart(monthlyExpensesLineChart, {
            type: 'line',
            data: {
                labels,
                datasets: [ {
                    label: 'Expenses',
                    data,
                    borderColor: '#567cb3',
                    backgroundColor: 'transparent',
                    fill: true,
                    tension: 0.4
                } ]
            },
            options: {
                responsive: true,
                scales: {
                    x: { ticks: { display: true }, title: { display: true } },
                    y: { ticks: { display: true }, title: { display: true } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        })
    }

    static async init() {
        await DashboardLineChart.renderMonthlyExpensesLineChart()
    }
}

module.exports = DashboardLineChart
