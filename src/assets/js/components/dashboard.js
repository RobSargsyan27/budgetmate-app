const { ActivityLogLib } = require('../lib')
const { BudgetsApi, RecordsApi, AccountsApi, AccountRequestsApi, AnalyticsApi, RecordCategoriesApi } = require('../api')
const { DashboardLineChart, DashboardPieChart } = require('../charts')

class Dashboard {
    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Set record categories.
     */
    static async setRecordCategories(token) {
        const incomeRecordCategoryDropdown = document.getElementById('incomeRecordCategoryDropdown')
        const expenseRecordCategoryDropdown = document.getElementById('expenseRecordCategoryDropdown')
        const budgetRecordCategoriesDropdown = document.getElementById('budgetRecordCategoriesDropdown')

        const recordCategories = await RecordCategoriesApi.getRecordCategories(token)

        recordCategories.forEach((recordCategories) => {
            incomeRecordCategoryDropdown.innerHTML += `<option 
                name="${recordCategories.name}" 
                value="${recordCategories.name}" 
                id="${recordCategories.id}">"${recordCategories.name}"
            </option>`

            expenseRecordCategoryDropdown.innerHTML += `<option 
                name="${recordCategories.name}" 
                value="${recordCategories.name}" 
                id="${recordCategories.id}">"${recordCategories.name}"
            </option>`

            budgetRecordCategoriesDropdown.innerHTML += `<div class="form-check">
                    <input  type="checkbox" 
                            class="form-check-input" 
                            name="${recordCategories.name}" 
                            value="${recordCategories.name}"/>
                    <label class="mr-2">${recordCategories.name}</label>
            </div>`
        })
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Set user accounts.
     */
    static async setUserAccounts(token) {
        const incomeReceivingAccountDropdown = document.getElementById('incomeReceivingAccountDropdown')
        const expenseWithdrawalAccountDropdown = document.getElementById('expenseWithdrawalAccountDropdown')
        const transferReceivingAccountDropdown = document.getElementById('transferReceivingAccountDropdown')
        const transferWithdrawalAccountDropdown = document.getElementById('transferWithdrawalAccountDropdown')

        const accounts = await AccountsApi.getUserAccounts(token)

        accounts.forEach((account) => {
            incomeReceivingAccountDropdown.innerHTML +=
                `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`

            expenseWithdrawalAccountDropdown.innerHTML +=
                `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`

            transferReceivingAccountDropdown.innerHTML +=
                `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`

            transferWithdrawalAccountDropdown.innerHTML +=
                `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`
        })
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Set dashboard user accounts.
     */
    static async setDashboardUserAccounts(token) {
        const dashboardAccounts = document.getElementById('dashboardAccounts')

        const accounts = await AccountsApi.getUserAccounts(token)

        dashboardAccounts.innerHTML = ''
        accounts.forEach((account) => {
            const accountColor = account.avatarColor

            dashboardAccounts.innerHTML += `
    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card h-100 py-2" style="border-left: 0.25rem solid ${accountColor}">
            <div class="card-body">
                <a class="text-decoration-none" href="/account/${account.id}">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-lg font-weight-bold text-uppercase mb-1" style="color: ${accountColor}">${account.name}</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">${account.currentBalance}</div>
                      <div class="h6 mb-0 font-weight-light text-gray-900">${account.currency}</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-landmark fa-2x" style="color: ${accountColor}"></i>
                    </div>
                  </div>
                </a>
            </div>
        </div>
    </div>`
        })
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Set dashboard user analytics.
     */
    static async setDashboardUserAnalytics(token) {
        const monthlyEarningsStat = document.getElementById('monthlyEarningsStat')
        const annualEarningsStat = document.getElementById('annualEarningsStat')
        const monthlyExpensesStat = document.getElementById('monthlyExpensesStat')
        const cashFlowStat = document.getElementById('cashFlowStat')

        const { monthlyEarnings, monthlyExpenses, annualEarnings } = await AnalyticsApi.getUserDashboardAnalytics(token)

        monthlyEarningsStat.textContent = monthlyEarnings
        monthlyExpensesStat.textContent = monthlyExpenses
        annualEarningsStat.textContent = annualEarnings

        const cashFlowIncome = monthlyEarnings * 100 / (monthlyEarnings + monthlyExpenses)

        cashFlowStat.innerHTML = `<div class="row no-gutters align-items-center">
        <div class="col">
            <div class="progress-oppose progress-lg">
                <div class="progress-bar bg-success" role="progressbar" 
                     style="width: ${cashFlowIncome.toFixed(2)}%" aria-valuemin="0" 
                     aria-valuemax="100"></div>
            </div>
        </div>
    </div>`
    }

    /**
     * @param {string} token
     * @returns void
     * @description Submit record listener.
     */
    static submitRecordListener(token) {
        document.getElementById('addRecordButton').addEventListener('click', async () => {
            const activeTab = document.querySelector('#recordTabs .nav-link.active').textContent

            switch (activeTab) {
                case 'Expense':
                    await Dashboard.submitExpenseRecord(token)
                    break
                case 'Income':
                    await Dashboard.submitIncomeRecord(token)
                    break
                case 'Transfer':
                    await Dashboard.submitTransferRecord(token)
                    break
            }

            await Promise.all([ Dashboard.setDashboardUserAccounts(token), Dashboard.setDashboardUserAnalytics(token) ])
            document.getElementById('closeRecordModalButton').click()
        })
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Submit expense record.
     */
    static async submitExpenseRecord(token) {
        const amountInput = document.getElementById('expenseAmount')
        const paymentTimeInput = document.getElementById('expensePaymentTime')
        const categoryDropdown = document.getElementById('expenseRecordCategoryDropdown')
        const withdrawalAccountDropdown = document.getElementById('expenseWithdrawalAccountDropdown')
        const noteInput = document.getElementById('expenseNote')

        const amount = amountInput.value
        const paymentTime = paymentTimeInput.value
        const category = categoryDropdown.value
        const withdrawalAccountId = withdrawalAccountDropdown.value
        const note = noteInput.value
        const type = 'EXPENSE'

        await RecordsApi.addUserRecord(token, { amount, paymentTime, category, withdrawalAccountId, note, type })

        amountInput.value = ''
        paymentTimeInput.value = ''
        categoryDropdown.selectedIndex = 0
        withdrawalAccountDropdown.selectedIndex = 0
        noteInput.value = ''
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Submit income record.
     */
    static async submitIncomeRecord(token) {
        const amountInput = document.getElementById('incomeAmount')
        const paymentTimeInput = document.getElementById('incomePaymentTime')
        const categoryDropdown = document.getElementById('incomeRecordCategoryDropdown')
        const receivingAccountDropdown = document.getElementById('incomeReceivingAccountDropdown')
        const noteInput = document.getElementById('incomeNote')

        const amount = amountInput.value
        const paymentTime = paymentTimeInput.value
        const category = categoryDropdown.value
        const receivingAccountId = receivingAccountDropdown.value
        const note = noteInput.value
        const type = 'INCOME'

        await RecordsApi.addUserRecord(token, { amount, paymentTime, category, receivingAccountId, note, type })

        amountInput.value = ''
        paymentTimeInput.value = ''
        categoryDropdown.selectedIndex = 0
        receivingAccountDropdown.selectedIndex = 0
        noteInput.value = ''
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Submit transfer record.
     */
    static async submitTransferRecord(token) {
        const amountInput = document.getElementById('transferAmount')
        const paymentTimeInput = document.getElementById('transferPaymentTime')
        const receivingAccountDropdown = document.getElementById('transferReceivingAccountDropdown')
        const withdrawalAccountDropdown = document.getElementById('transferWithdrawalAccountDropdown')
        const noteInput = document.getElementById('transferNote')

        const amount = amountInput.value
        const paymentTime = paymentTimeInput.value
        const receivingAccountId = receivingAccountDropdown.value
        const withdrawalAccountId = withdrawalAccountDropdown.value
        const note = noteInput.value
        const type = 'TRANSFER'

        await RecordsApi.addUserRecord(
            token,
            { amount, paymentTime, withdrawalAccountId, receivingAccountId, note, type }
        )

        amountInput.value = ''
        paymentTimeInput.value = ''
        receivingAccountDropdown.selectedIndex = 0
        withdrawalAccountDropdown.selectedIndex = 0
        noteInput.value = ''
    }

    /**
     * @param {string} token
     * @description Submit budget listener.
     */
    static submitBudgetListener(token) {
        document.getElementById('addBudgetButton').addEventListener('click', async function() {
            const nameInput = document.getElementById('budgetName')
            const amountInput = document.getElementById('budgetAmount')
            const budgetCategoriesCheckboxes = document.querySelectorAll(
                '#budgetRecordCategoriesDropdown .form-check-input'
            )

            const name = nameInput.value
            const amount = amountInput.value
            const budgetCategories = Array
                .from(document.querySelectorAll('#budgetRecordCategoriesDropdown .form-check-input:checked'))
                .map(input => input.value)

            await BudgetsApi.addUserBudget(token, { amount, name, budgetCategories })

            nameInput.value = ''
            amountInput.value = ''
            budgetCategoriesCheckboxes.forEach(checkbox => checkbox.checked = false)
            document.getElementById('closeBudgetModalButton').click()
        })
    }

    /**
     * @param {string} token
     * @description Submit account listener.
     */
    static submitAccountListener(token) {
        document.getElementById('addAccountButton').addEventListener('click', async () => {
            const activeTab = document.querySelector('#accountTabs .nav-link.active').textContent

            activeTab === 'New Account'
                ? await Dashboard.submitNewAccount(token)
                : await Dashboard.submitExistingAccountRequest(token)

            await Promise.all([ Dashboard.setDashboardUserAccounts(token), Dashboard.setDashboardUserAnalytics(token) ])
            document.getElementById('closeAccountModalButton').click()
        })
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Submit new account.
     */
    static async submitNewAccount(token) {
        const name = document.getElementById('accountName')
        const currency = document.getElementById('accountCurrency')
        const currentBalance = document.getElementById('accountCurrentBalance')
        const type = document.getElementById('accountType')
        const avatarColor = document.getElementById('accountAvatarColor')

        const payload = {
            name: name.value,
            currency: currency.value,
            currentBalance: currentBalance.value,
            type: type.value,
            avatarColor: avatarColor.value
        }
        await AccountsApi.addUserAccount(token, payload)

        name.value = ''
        currency.selectedIndex = 0
        currentBalance.value = 0
        type.selectedIndex = 0
        avatarColor.value = '#000053'
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     * @description Submit existing account request.
     */
    static async submitExistingAccountRequest(token) {
        const accountName = document.getElementById('existingAccountName')
        const ownerUsername = document.getElementById('existingAccountOwnerUsername')

        const payload = { accountName: accountName.value, ownerUsername: ownerUsername.value }
        await AccountRequestsApi.addUserAccountRequest(token, payload)

        accountName.value = ''
        ownerUsername.value = ''
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init() {
        const token = localStorage.getItem('token')

        await Promise.all([
            DashboardPieChart.init(),
            DashboardLineChart.init(),
            Dashboard.setDashboardUserAccounts(token),
            Dashboard.setRecordCategories(token),
            Dashboard.setRecordCategories(token),
            Dashboard.setUserAccounts(token),
            Dashboard.setDashboardUserAnalytics(token)
        ])

        Dashboard.submitRecordListener(token)
        Dashboard.submitBudgetListener(token)
        Dashboard.submitAccountListener(token)

        ActivityLogLib.addActionToActivityLog('Dashboard')
        ActivityLogLib.setUserActivityLogDetails()
    }
}

module.exports = Dashboard
