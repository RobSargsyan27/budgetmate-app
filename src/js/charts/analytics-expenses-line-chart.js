async function getUserMonthlyExpensesLineChart(token, startDate, endDate){
    const response = await fetch(
        `api/v1/analytics/overview-line/${startDate.toISOString()}/${endDate.toISOString()}/expense`,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        })

    return response.json()
}

async function renderExpenseLineChart(chart, token, startDate, endDate){
    const {labels, data} = await getUserMonthlyExpensesLineChart(token, startDate, endDate)
    const expensesChartContext = document.getElementById("expensesLineChart").getContext("2d")

    if(chart){
        chart.data.labels = labels
        chart.data.datasets[0].data = data;
        chart.update();
        return chart
    }

    return new Chart(expensesChartContext, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Expenses',
                data,
                borderColor: "#567cb3",
                backgroundColor: 'transparent',
                fill: true,
                tension: 0.4
            }]
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
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem("token")
    let startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1,0,0,0,0);
    let endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0,0,0,0);

    const expensesLineChart = await renderExpenseLineChart(undefined, token, startDate, endDate)

    document.getElementById("previousMonthExpenseLineChart").addEventListener('click', async () => {
        const expensesLineChartDate = document.getElementById("expensesLineChartDate")
        const dateOptions = { year: 'numeric', month: 'short' }

        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1);

        expensesLineChartDate.textContent =
            `${startDate.toLocaleString('en-US', dateOptions)} - ${endDate.toLocaleString('en-US', dateOptions)}`

        await renderExpenseLineChart(expensesLineChart, token, startDate, endDate)
    })

    document.getElementById("nextMonthExpenseLineChart").addEventListener('click', async () => {
        const expensesLineChartDate = document.getElementById("expensesLineChartDate")
        const dateOptions = { year: 'numeric', month: 'short' }

        startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1);

        expensesLineChartDate.textContent =
            `${startDate.toLocaleString('en-US', dateOptions)} - ${endDate.toLocaleString('en-US', dateOptions)}`

        await renderExpenseLineChart(expensesLineChart, token, startDate, endDate)
    })
})