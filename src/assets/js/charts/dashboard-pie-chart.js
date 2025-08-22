const { Chart } = require('chart.js')

const { AnalyticsApi } = require('../api')

class DashboardPieChart {
    static async renderCategoryPieChart(token) {
        const expensesTopCategoriesPieChart = document.getElementById('expensesTopCategoriesPieChart')
        const expensesTopCategoriesPieChartContext = expensesTopCategoriesPieChart.getContext('2d')
        const { labels, data } = await AnalyticsApi.getUserDashboardCategoryPieChart(token)

        new Chart(expensesTopCategoriesPieChartContext, {
            type: 'pie',
            data: {
                labels,
                datasets: [ {
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                } ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                const value = tooltipItem.raw
                                return `${tooltipItem.label}: $${value}`
                            }
                        }
                    }
                }
            }
        })
    }

    static async init() {
        const token = localStorage.getItem('token')

        await DashboardPieChart.renderCategoryPieChart(token)
    }
}

module.exports = DashboardPieChart
