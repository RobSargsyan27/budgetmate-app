const { ActivityLogLib } = require('../lib')
const { BudgetsApi } = require('../api')

class Budgets {
    /**
     * @param {Element} budgetsContainer
     * @param {Object} budget
     * @param {Array<Object>} budgetsCurrentBalance
     * @returns {void}
     * @description Set budget.
     */
    static setBudget(budgetsContainer, budget, budgetsCurrentBalance) {
        const categoriesHTML = budget.recordCategories.map(category =>
            `<span class="text-xs alert-info border border-radius1 p-1 ml-1">${category.name}</span>`
        ).join('')

        const budgetCurrentBalance = budgetsCurrentBalance.find((item) => budget.id === item.id).currentBalance
        const currentProgress = budgetCurrentBalance > 0 ? budgetCurrentBalance * 100 / budget.amount : 0

        budgetsContainer.innerHTML += `
          <div class="col-xl-3 col-md-6 mb-4">
            <a class="text-decoration-none spa-nav" data-ref="budget" data-id="${budget.id}">
              <div class="card h-100 border-0 shadow-sm rounded-4">
                <div class="card-body d-flex flex-column justify-content-between p-4">
                  <div class="position-absolute" style="top: 1rem; right: 1rem;">
                    <i class="fas fa-coins fa-lg text-gray-400"></i>
                  </div>
                  <div>
                    <h6 class="text-uppercase fw-bold mb-1 text-primary">${budget.name}</h6>
                    <div class="h5 fw-bold text-dark mb-2">${budget.amount}</div>
                    <div class="d-flex flex-wrap gap-2 mt-2">${categoriesHTML}</div>
                  </div>
                  <div class="mt-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="fw-bold text-dark">${currentProgress.toFixed(2)}%</span>
                    </div>
                    <div class="progress progress-sm rounded-pill" style="height: 0.6rem;">
                      <div class="progress-bar bg-info rounded-pill" role="progressbar"
                           style="width: ${currentProgress.toFixed(2)}%" 
                           aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        `;
    }

    /**
     * @returns {Promise<void>}
     * @description Set budgets.
     */
    static async setBudgets() {
        const budgetsContainer = document.getElementById('budgetsContainer')
        const budgets = await BudgetsApi.getUserBudgets()
        const budgetsCurrentBalance = await BudgetsApi.getUserBudgetsCurrentBalance()

        budgetsContainer.innerHTML = ''
        budgets.length
            ? budgets.forEach((budget) => Budgets.setBudget(budgetsContainer, budget, budgetsCurrentBalance))
            : budgetsContainer.innerHTML = '<h4 class="text-center ml-3 mt-4">No budgets just yet!</h4>'
    }

    /**
     * @returns {void}
     * @description Set budget report listener.
     */
    static setBudgetReportListener() {
        document.getElementById('budgetReportButton').addEventListener('click', async () => {
            const blob = await BudgetsApi.getUserBudgetsReport()

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'budgets-report.json'
            link.click()
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init() {
        await Budgets.setBudgets()

        if(!Budgets.listenersBound){
            Budgets.setBudgetReportListener()
            Budgets.listenersBound = true
        }

        ActivityLogLib.addActionToActivityLog('Budgets')
        ActivityLogLib.setUserActivityLogDetails()
    }
}

Budgets.listenersBound = false

module.exports = Budgets
