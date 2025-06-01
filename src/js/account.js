function addActionToActivityLog(accountId) {
  const sessionActivityLog = sessionStorage.getItem('activityLog');
  const activityLog = JSON.parse(sessionActivityLog) || [];

  const message = {page: `Account ${accountId} details`, date: new Date()};
  activityLog.push(message);
  sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
}

async function getUserAccount(token, id) {
  const response = await fetch(`/api/v1/account/${id}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

function updateUserAccount(token, id, payload){
  const { name, currentBalance, type, avatarColor } = payload;

  return fetch(`api/v1/account/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({name, currentBalance, type, avatarColor})
  });
}

function deleteUserAccount(token, id) {
  return fetch(`/api/v1/account/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });
}

async function setAccountDetails(token, id) {
  const account = await getUserAccount(token, id);

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

function setSubmitAccountListener(token, id) {
  document.getElementById('updateAccountForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('submitAccountButton');
    const name = document.getElementById('updateAccountName').value;
    const currentBalance = document.getElementById('updateAccountCurrentBalance').value;
    const type = document.getElementById('updateAccountType').value;
    const avatarColor = document.getElementById('updateAccountAvatarColor').value;

    await updateUserAccount(token, id, { name, currentBalance, type, avatarColor });
    await setAccountDetails(token, id);
    submitButton.blur();
  });
}

function setDeleteAccountListener(token, id) {
  document.getElementById('deleteAccountButton').addEventListener('click', async () => {
    await deleteUserAccount(token, id);
    window.location.href = '/dashboard';
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
  const accountId = window.location.pathname.split('/').pop();

  await setAccountDetails(token, accountId);
  setSubmitAccountListener(token, accountId);
  setDeleteAccountListener(token, accountId);

  addActionToActivityLog(accountId);
  setUserActivityLogDetails();
});
