const { AccountsApi } = require('../api')
const { ActivityLogLib } = require('../lib')

class Account {
    /**
     * @param {string} id
     * @returns {Promise<void>}
     * @description Set account details.
     */
    static async setAccountDetails(id) {
        const account = await AccountsApi.getUserAccount(id)

        const accountCard = document.getElementById('accountCard')
        const accountName = document.getElementById('accountName')
        const updateAccountName = document.getElementById('updateAccountName')
        const updateAccountCurrentBalance = document.getElementById('updateAccountCurrentBalance')
        const updateAccountCurrency = document.getElementById('updateAccountCurrency')
        const updateAccountType = document.getElementById('updateAccountType')
        const updateAccountAvatarColor = document.getElementById('updateAccountAvatarColor')

        accountCard.style.borderBottom = `0.25rem solid ${account.avatarColor}`
        accountName.textContent = account.name
        updateAccountName.value = account.name
        updateAccountCurrentBalance.value = account.currentBalance
        updateAccountCurrency.textContent = account.currency
        updateAccountType.value = account.type
        updateAccountAvatarColor.value = account.avatarColor
    }

    /**
     * @param {string} id
     * @description Set submit account listener.
     */
    static setSubmitAccountListener(id) {
        document.getElementById('updateAccountForm').addEventListener('submit', async (event) => {
            event.preventDefault()

            const submitButton = document.getElementById('submitAccountButton')
            const name = document.getElementById('updateAccountName').value
            const currentBalance = document.getElementById('updateAccountCurrentBalance').value
            const type = document.getElementById('updateAccountType').value
            const avatarColor = document.getElementById('updateAccountAvatarColor').value

            await AccountsApi.updateUserAccount( id, { name, currentBalance, type, avatarColor })
            await Account.setAccountDetails(id)
            submitButton.blur()
        })
    }

    /**
     * @param {string} id
     * @description Set delete account listener.
     */
    static setDeleteAccountListener(id) {
        document.getElementById('deleteAccountButton').addEventListener('click', async () => {
            await AccountsApi.deleteUserAccount( id)
            window.location.href = '/dashboard'
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init(accountId) {

        await Account.setAccountDetails(accountId)

        if(!Account.listenersBound) {
            Account.setSubmitAccountListener(accountId)
            Account.setDeleteAccountListener(accountId)
            Account.listenersBound = true
        }

        ActivityLogLib.addActionToActivityLog(`Account ${accountId} details`)
        ActivityLogLib.setUserActivityLogDetails()
    }
}

Account.listenersBound = false

module.exports = Account
