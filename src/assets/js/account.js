const { AccountsApi } = require('./api')
const { ActivityLogLib } = require('./lib')
const Generic = require('./generic')

/**
 * @param {string} token
 * @param {string} id
 * @returns {Promise<void>}
 * @description Set account details.
 */
async function setAccountDetails(token, id) {
  const account = await AccountsApi.getUserAccount(token, id)

  const accountCard = document.getElementById('accountCard');
  const accountName = document.getElementById('accountName');
  const updateAccountName = document.getElementById('updateAccountName');
  const updateAccountCurrentBalance = document.getElementById('updateAccountCurrentBalance');
  const updateAccountCurrency = document.getElementById('updateAccountCurrency');
  const updateAccountType = document.getElementById('updateAccountType');
  const updateAccountAvatarColor = document.getElementById('updateAccountAvatarColor');

  accountCard.style.borderBottom = `0.25rem solid ${account.avatarColor}`;
  accountName.textContent = account.name;
  updateAccountName.value = account.name;
  updateAccountCurrentBalance.value = account.currentBalance;
  updateAccountCurrency.textContent = account.currency;
  updateAccountType.value = account.type;
  updateAccountAvatarColor.value = account.avatarColor;
}

/**
 * @param {string} token
 * @param {string} id
 * @description Set submit account listener.
 */
function setSubmitAccountListener(token, id) {
  document.getElementById('updateAccountForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('submitAccountButton');
    const name = document.getElementById('updateAccountName').value;
    const currentBalance = document.getElementById('updateAccountCurrentBalance').value;
    const type = document.getElementById('updateAccountType').value;
    const avatarColor = document.getElementById('updateAccountAvatarColor').value;

    await AccountsApi.updateUserAccount(token, id, { name, currentBalance, type, avatarColor })
    await setAccountDetails(token, id)
    submitButton.blur();
  });
}

/**
 * @param {string} token
 * @param {string} id
 * @description Set delete account listener.
 */
function setDeleteAccountListener(token, id) {
  document.getElementById('deleteAccountButton').addEventListener('click', async () => {
    await AccountsApi.deleteUserAccount(token, id);
    window.location.href = '/dashboard';
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  await Generic.init()
  const token = localStorage.getItem('token')
  const accountId = window.location.pathname.split('/').pop()

  await setAccountDetails(token, accountId)
  setSubmitAccountListener(token, accountId)
  setDeleteAccountListener(token, accountId)

  ActivityLogLib.addActionToActivityLog(`Account ${accountId} details`)
  ActivityLogLib.setUserActivityLogDetails()
});
