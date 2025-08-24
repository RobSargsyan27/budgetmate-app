const { Chart } = require('chart.js')

const { AnalyticsApi } = require('../api')

class AnalyticsEarningsLineChart {
    static async renderLineChart(chart, startDate, endDate) {
        const { labels, data } = await AnalyticsApi.getUserRecordsOverviewLineChart(startDate, endDate, 'INCOME')
        const earningsChartContext = document.getElementById('earningsLineChart').getContext('2d')

        if (chart) {
            chart.data.labels = labels
            chart.data.datasets[0].data = data
            chart.update()
            return chart
        }

        return new Chart(earningsChartContext, {
            type: 'line',
            data: {
                labels,
                datasets: [ {
                    label: 'Earnings',
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
                    x: {
                        ticks: {
                            display: true
                        },
                        title: {
                            display: true
                        }
                    },
                    y: {
                        ticks: {
                            display: true
                        },
                        title: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        })
    }

    static async init() {
        let startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0, 0)
        let endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0)

        const earningsLineChart = await AnalyticsEarningsLineChart.renderLineChart(undefined, startDate, endDate)

        document.getElementById('previousMonthEarningLineChart').addEventListener('click', async () => {
            const earningsLineChartDate = document.getElementById('earningsLineChartDate')
            const dateOptions = { year: 'numeric', month: 'short' }

            startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1)
            endDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1)

            earningsLineChartDate.textContent = `${startDate.toLocaleString('en-US', dateOptions)} - ${
                endDate.toLocaleString('en-US', dateOptions)
            }`

            await AnalyticsEarningsLineChart.renderLineChart(earningsLineChart, startDate, endDate)
        })

        document.getElementById('nextMonthEarningLineChart').addEventListener('click', async () => {
            const earningsLineChartDate = document.getElementById('earningsLineChartDate')
            const dateOptions = { year: 'numeric', month: 'short' }

            startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1)
            endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1)

            earningsLineChartDate.textContent = `${startDate.toLocaleString('en-US', dateOptions)} - ${
                endDate.toLocaleString('en-US', dateOptions)
            }`

            await AnalyticsEarningsLineChart.renderLineChart(earningsLineChart, startDate, endDate)
        })
    }
}

module.exports = AnalyticsEarningsLineChart
