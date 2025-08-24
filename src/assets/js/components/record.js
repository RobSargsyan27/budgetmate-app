const { ActivityLogLib } = require('../lib')
const { RecordCategoriesApi, RecordsApi, AccountsApi } = require('../api')

class Record {
    /**
     * @param {string} id
     * @returns {Promise<void>}
     * @description Set record details.
     */
    static async setRecordDetails(id) {
        const record = await RecordsApi.getUserRecord(id)
        const recordCategories = await RecordCategoriesApi.getRecordCategories()

        const recordPaymentTime = new Date(record.paymentTime)
        const formattedPaymentTime = recordPaymentTime.toISOString().split('.')[0]
        const receivingAccount = record.receivingAccountId === null
            ? undefined
            : await AccountsApi.getUserAccount(record.receivingAccountId)
        const withdrawalAccount = record.withdrawalAccountId === null
            ? undefined
            : await AccountsApi.getUserAccount(record.withdrawalAccountId)

        const recordHeader = document.getElementById('recordHeader')
        const amount = document.getElementById('updateRecordAmount')
        const paymentTime = document.getElementById('updateRecordPaymentTime')
        const recordNote = document.getElementById('updateRecordNote')
        const accountField = document.getElementById('accountField')
        const accountField2 = document.getElementById('accountField-2')

        recordHeader.innerHTML =
            `<h3 class="mb-4 text-gray-800 alert-info border border-radius1 p-1 ml-1" id="recordType">${record.type}</h3>`
        if (record.type.toUpperCase() !== 'TRANSFER') {
            recordHeader.innerHTML += `<h3 class="mb-4 text-gray-800 alert-info border border-radius1 p-1 ml-1" 
                id="recordCategory">${record.category.name}
            </h3>`
        }

        amount.textContent = record.amount
        paymentTime.value = formattedPaymentTime
        recordNote.value = record.note

        if (receivingAccount && withdrawalAccount) {
            Record.renderRecordAccounts(accountField, receivingAccount, 'accountField-Input', 'Receiving Account')
            Record.renderRecordAccounts(accountField2, withdrawalAccount, 'accountField-2-Input', 'Withdrawal Account')
        } else if (receivingAccount === null && withdrawalAccount) {
            Record.renderRecordCategoriesDropdown(accountField, recordCategories, 'accountField-Input', record.category)
            Record.renderRecordAccounts(accountField2, withdrawalAccount, 'accountField-2-Input', 'Withdrawal Account')
        } else if (receivingAccount) {
            Record.renderRecordCategoriesDropdown(accountField, recordCategories, 'accountField-Input', record.category)
            Record.renderRecordAccounts(accountField2, receivingAccount, 'accountField-2-Input', 'Receiving Account')
        }

        Record.renderAccountCards([ receivingAccount, withdrawalAccount ])
    }

    /**
     * @param {string} id
     * @description Set submit record listener.
     */
    static setSubmitRecordListener(id) {
        document.getElementById('updateRecordForm').addEventListener('submit', async (event) => {
            event.preventDefault()

            const submitButton = document.getElementById('submitRecordButton')
            const recordPaymentTime = document.getElementById('updateRecordPaymentTime')
            const recordNote = document.getElementById('updateRecordNote')
            const recordCategory = document.getElementById('accountField-Input')

            const payload = {
                paymentTime: recordPaymentTime.value,
                note: recordNote.value
            }

            if (recordCategory.tagName === 'SELECT') {
                payload.category = recordCategory.value
            }

            await RecordsApi.updateUserRecord(id, payload)

            await Record.setRecordDetails(id)
            submitButton.blur()
        })
    }

    /**
     * @param {string} id
     * @description Set delete record listener.
     */
    static setDeleteRecordListener(id) {
        document.getElementById('deleteRecordButton').addEventListener('click', async () => {
            await RecordsApi.deleteUserRecord(id)

            window.location.href = '/records-history'
        })
    }

    /**
     * @param {Element} accountContainer
     * @param {Object} account
     * @param {string} id
     * @param {string} label
     * @description Render record account.
     */
    static renderRecordAccounts(accountContainer, account, id, label) {
        accountContainer.innerHTML =
            `<label for="${id}" class="d-flex flex-row align-items-start" id="accountField-label">${label}</label>
     <div id="${id}" class="form-control">${account.name}</div>`
    }

    /**
     * @param {Element} dropdownContainer
     * @param {Array<Object>} recordCategories
     * @param {string} id
     * @param {string} recordCategory
     * @description Render render categories dropdown.
     */
    static renderRecordCategoriesDropdown(dropdownContainer, recordCategories, id, recordCategory) {
        const categoriesHTML = recordCategories.map(category =>
            category.id === recordCategory.id
                ? `<option selected name="${category.name}" value="${category.name}" id="${category.id}">"${category.name}"</option>`
                : `<option name="${category.name}" value="${category.name}" id="${category.id}">"${category.name}"</option>`
        ).join('')

        dropdownContainer.innerHTML =
            `<label for="${id}" class="d-flex flex-row align-items-start" id="accountField-label">
           <i class="fas fa-asterisk fa-xs" style="color: #f22626; font-size: 6px;"></i>Record Categories
    </label>
    <select name="${id}" id="${id}" class="form-control">${categoriesHTML}</select>`
    }

    /**
     * @param {Array<Object>} accounts
     * @description Render account cards.
     */
    static renderAccountCards(accounts) {
        const budgetsAccountContainer = document.getElementById('budgetsAccountContainer')

        accounts.forEach((account) => {
            if (account) {
                const accountColor = account.avatarColor
                budgetsAccountContainer.innerHTML += `<div class="col-xl-3 col-md-6 mb-4">
          <div class="card h-100 py-2" style="border-left: 0.25rem solid ${accountColor}">
              <div class="card-body">
                  <a target="_blank" class="text-decoration-none spa-nav" data-ref="account" data-id="${account.id}">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                          <div class="text-lg font-weight-bold text-uppercase mb-1" style="color: ${accountColor}">${account.name}</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${account.currentBalance}</div>
                          <div class="h6 mb-0 font-weight-light text-gray-900">${account.currency}</div>
                      </div>
                      <div class="col-auto"><i class="fas fa-landmark fa-2x" style="color: ${accountColor}"></i></div>
                    </div>
                  </a>
              </div>
          </div>
      </div>`
            }
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init(recordId) {
        await Record.setRecordDetails(recordId)

        if(!Record.listenersBound){
            Record.setSubmitRecordListener( recordId)
            Record.setDeleteRecordListener( recordId)
            Record.listenersBound = true
        }

        ActivityLogLib.addActionToActivityLog(`Record ${recordId} details`)
        ActivityLogLib.setUserActivityLogDetails()
    }
}

Record.listenersBound = false

module.exports = Record
