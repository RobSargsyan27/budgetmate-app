document.addEventListener('DOMContentLoaded', async function () {
    const monthlyExpensesLineChart = document.getElementById('monthlyExpensesLineChart').getContext('2d');
    const token = localStorage.getItem('token')

    const response = await fetch('api/v1/analytics/dashboard/expenses-line-chart', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    })

    const {labels, data} = await response.json()

    new Chart(monthlyExpensesLineChart, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Expenses',
                data,
                borderColor: "#567cb3",
                backgroundColor: "transparent",
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
});
