const { AccountsApi } = require('../api')
const { ActivityLogLib } = require('../lib')

class Account {
    /**
     * @param {string} token
     * @param {string} id
     * @returns {Promise<void>}
     * @description Set account details.
     */
    static async setAccountDetails(token, id) {
        const account = await AccountsApi.getUserAccount(token, id)

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
     * @param {string} token
     * @param {string} id
     * @description Set submit account listener.
     */
    static setSubmitAccountListener(token, id) {
        document.getElementById('updateAccountForm').addEventListener('submit', async (event) => {
            event.preventDefault()

            const submitButton = document.getElementById('submitAccountButton')
            const name = document.getElementById('updateAccountName').value
            const currentBalance = document.getElementById('updateAccountCurrentBalance').value
            const type = document.getElementById('updateAccountType').value
            const avatarColor = document.getElementById('updateAccountAvatarColor').value

            await AccountsApi.updateUserAccount(token, id, { name, currentBalance, type, avatarColor })
            await Account.setAccountDetails(token, id)
            submitButton.blur()
        })
    }

    /**
     * @param {string} token
     * @param {string} id
     * @description Set delete account listener.
     */
    static setDeleteAccountListener(token, id) {
        document.getElementById('deleteAccountButton').addEventListener('click', async () => {
            await AccountsApi.deleteUserAccount(token, id)
            window.location.href = '/dashboard'
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init(accountId) {
        const token = localStorage.getItem('token')
        window.history.pushState({}, "", `/accounts/${accountId}`);

        await Account.setAccountDetails(token, accountId)
        Account.setSubmitAccountListener(token, accountId)
        Account.setDeleteAccountListener(token, accountId)

        ActivityLogLib.addActionToActivityLog(`Account ${accountId} details`)
        ActivityLogLib.setUserActivityLogDetails()
    }
}

module.exports = Account
