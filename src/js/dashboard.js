function addActionToActivityLog() {
  const sessionActivityLog = sessionStorage.getItem('activityLog');
  const activityLog = JSON.parse(sessionActivityLog) || [];

  const message = {page: 'Dashboard', date: new Date()};
  activityLog.push(message);
  sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function addUserRecord(token, type, payload){
  return fetch(`api/v2/record/${type}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify(payload)
  });
}

function addUserBudget(token, payload){
  const { amount, name, budgetCategories } = payload;

  return fetch('api/v2/budget', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({ amount, name, budgetCategories})
  });
}

function addUserNewAccount(token, payload){
  const { name, currency, currentBalance, type, avatarColor } = payload;

  return fetch('api/v2/account', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({ name, currency, currentBalance, type, avatarColor })
  });
}

function addUserExistingAccount(token, payload){
  const { accountName, ownerUsername } = payload;

  return fetch('api/v2/account/existing', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({ accountName, ownerUsername })
  });
}

async function getUserDetails(token) {
  const response = await fetch('/api/v2/user', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function getUserDashboardAnalytics(token) {
  const response = await fetch('api/v2/analytics/dashboard', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function getUserRecordCategories(token) {
  const response = await fetch('api/v2/record/record-categories', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function getUserAccounts(token) {
  const response = await fetch('api/v2/account', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function setRecordCategories(token) {
  const incomeRecordCategoryDropdown = document.getElementById('incomeRecordCategoryDropdown');
  const expenseRecordCategoryDropdown = document.getElementById('expenseRecordCategoryDropdown');
  const budgetRecordCategoriesDropdown = document.getElementById('budgetRecordCategoriesDropdown');
  const recordCategories = await getUserRecordCategories(token);

  recordCategories.forEach((recordCategories) => {
    incomeRecordCategoryDropdown.innerHTML +=
            `<option 
                name="${recordCategories.name}" 
                value="${recordCategories.name}" 
                id="${recordCategories.id}">"${recordCategories.name}"
            </option>`;

    expenseRecordCategoryDropdown.innerHTML +=
            `<option 
                name="${recordCategories.name}" 
                value="${recordCategories.name}" 
                id="${recordCategories.id}">"${recordCategories.name}"
            </option>`;

    budgetRecordCategoriesDropdown.innerHTML +=
            `<div class="form-check">
                    <input  type="checkbox" 
                            class="form-check-input" 
                            name="${recordCategories.name}" 
                            value="${recordCategories.name}"/>
                    <label class="mr-2">${recordCategories.name}</label>
            </div>`;
  });
}

async function setUserAccounts(token) {
  const incomeReceivingAccountDropdown = document.getElementById('incomeReceivingAccountDropdown');
  const expenseWithdrawalAccountDropdown = document.getElementById('expenseWithdrawalAccountDropdown');
  const transferReceivingAccountDropdown = document.getElementById('transferReceivingAccountDropdown');
  const transferWithdrawalAccountDropdown = document.getElementById('transferWithdrawalAccountDropdown');
  const accounts = await getUserAccounts(token);

  accounts.forEach((account) => {
    incomeReceivingAccountDropdown.innerHTML +=
            `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`;

    expenseWithdrawalAccountDropdown.innerHTML +=
            `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`;

    transferReceivingAccountDropdown.innerHTML +=
            `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`;

    transferWithdrawalAccountDropdown.innerHTML +=
            `<option name="${account.name}" value="${account.id}" id="${account.id}">"${account.name}"</option>`;
  });
}

async function setDashboardUserAccounts(token) {
  const dashboardAccounts = document.getElementById('dashboardAccounts');
  const accounts = await getUserAccounts(token);

  dashboardAccounts.innerHTML = '';
  accounts.forEach((account) => {
    const accountColor = account.avatarColor;

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
    </div>`;
  });
}

async function setDashboardUserAnalytics(token) {
  const {monthlyEarnings, monthlyExpenses, annualEarnings} = await getUserDashboardAnalytics(token);

  const monthlyEarningsStat = document.getElementById('monthlyEarningsStat');
  const annualEarningsStat = document.getElementById('annualEarningsStat');
  const monthlyExpensesStat = document.getElementById('monthlyExpensesStat');
  const cashFlowStat = document.getElementById('cashFlowStat');

  monthlyEarningsStat.textContent = monthlyEarnings;
  monthlyExpensesStat.textContent = monthlyExpenses;
  annualEarningsStat.textContent = annualEarnings;

  const cashFlowIncome = monthlyEarnings * 100 / (monthlyEarnings + monthlyExpenses);

  cashFlowStat.innerHTML =
    `<div class="row no-gutters align-items-center">
        <div class="col">
            <div class="progress-oppose progress-lg">
                <div class="progress-bar bg-success" role="progressbar" 
                     style="width: ${cashFlowIncome.toFixed(2)}%" aria-valuemin="0" 
                     aria-valuemax="100"></div>
            </div>
        </div>
    </div>`;
}

function submitRecord(token) {
  document.getElementById('addRecordButton').addEventListener('click', async function () {
    const activeTab = document.querySelector('#recordTabs .nav-link.active').textContent;

    switch (activeTab) {
    case 'Expense':
      await submitExpenseRecord(token);
      break;
    case 'Income':
      await submitIncomeRecord(token);
      break;
    case 'Transfer':
      await submitTransferRecord(token);
      break;
    }

    await setDashboardUserAccounts(token);
    await setDashboardUserAnalytics(token);
    document.getElementById('closeRecordModalButton').click();
  });
}

async function submitExpenseRecord(token) {
  const amountInput = document.getElementById('expenseAmount');
  const paymentTimeInput = document.getElementById('expensePaymentTime');
  const categoryDropdown = document.getElementById('expenseRecordCategoryDropdown');
  const withdrawalAccountDropdown = document.getElementById('expenseWithdrawalAccountDropdown');
  const noteInput = document.getElementById('expenseNote');

  const amount = amountInput.value;
  const paymentTime = paymentTimeInput.value;
  const category = categoryDropdown.value;
  const withdrawalAccountId = withdrawalAccountDropdown.value;
  const note = noteInput.value;

  await addUserRecord(token, 'expense', { amount, paymentTime, category, withdrawalAccountId, note});

  amountInput.value = '';
  paymentTimeInput.value = '';
  categoryDropdown.selectedIndex = 0;
  withdrawalAccountDropdown.selectedIndex = 0;
  noteInput.value = '';
}

async function submitIncomeRecord(token) {
  const amountInput = document.getElementById('incomeAmount');
  const paymentTimeInput = document.getElementById('incomePaymentTime');
  const categoryDropdown = document.getElementById('incomeRecordCategoryDropdown');
  const receivingAccountDropdown = document.getElementById('incomeReceivingAccountDropdown');
  const noteInput = document.getElementById('incomeNote');

  const amount = amountInput.value;
  const paymentTime = paymentTimeInput.value;
  const category = categoryDropdown.value;
  const receivingAccountId = receivingAccountDropdown.value;
  const note = noteInput.value;

  await addUserRecord(token, 'income', {amount, paymentTime, category, receivingAccountId, note});

  amountInput.value = '';
  paymentTimeInput.value = '';
  categoryDropdown.selectedIndex = 0;
  receivingAccountDropdown.selectedIndex = 0;
  noteInput.value = '';
}


async function submitTransferRecord(token) {
  const amountInput = document.getElementById('transferAmount');
  const paymentTimeInput = document.getElementById('transferPaymentTime');
  const receivingAccountDropdown = document.getElementById('transferReceivingAccountDropdown');
  const withdrawalAccountDropdown = document.getElementById('transferWithdrawalAccountDropdown');
  const noteInput = document.getElementById('transferNote');

  const amount = amountInput.value;
  const paymentTime = paymentTimeInput.value;
  const receivingAccountId = receivingAccountDropdown.value;
  const withdrawalAccountId = withdrawalAccountDropdown.value;
  const note = noteInput.value;

  await addUserRecord(token, 'transfer', {amount, paymentTime, withdrawalAccountId, receivingAccountId, note});

  amountInput.value = '';
  paymentTimeInput.value = '';
  receivingAccountDropdown.selectedIndex = 0;
  withdrawalAccountDropdown.selectedIndex = 0;
  noteInput.value = '';
}


function submitBudget(token) {
  document.getElementById('addBudgetButton').addEventListener('click', async function () {
    const nameInput = document.getElementById('budgetName');
    const amountInput = document.getElementById('budgetAmount');
    const budgetCategoriesCheckboxes = document.querySelectorAll('#budgetRecordCategoriesDropdown .form-check-input');

    const name = nameInput.value;
    const amount = amountInput.value;
    const budgetCategories = Array
      .from(document.querySelectorAll('#budgetRecordCategoriesDropdown .form-check-input:checked'))
      .map(input => input.value);

    await addUserBudget(token, { amount, name, budgetCategories});

    nameInput.value = '';
    amountInput.value = '';
    budgetCategoriesCheckboxes.forEach(checkbox => checkbox.checked = false );
    document.getElementById('closeBudgetModalButton').click();
  });
}

function submitAccount(token) {
  document.getElementById('addAccountButton').addEventListener('click', async function () {
    const activeTab = document.querySelector('#accountTabs .nav-link.active').textContent;

    activeTab === 'New Account'
      ? await submitNewAccount(token)
      : await submitExistingAccountRequest(token);

    await setDashboardUserAccounts(token);
    await setDashboardUserAnalytics(token);
    document.getElementById('closeAccountModalButton').click();
  });
}

async function submitNewAccount(token) {
  const name = document.getElementById('accountName');
  const currency = document.getElementById('accountCurrency');
  const currentBalance = document.getElementById('accountCurrentBalance');
  const type = document.getElementById('accountType');
  const avatarColor = document.getElementById('accountAvatarColor');

  const payload= {
    name: name.value,
    currency: currency.value,
    currentBalance: currentBalance.value,
    type: type.value,
    avatarColor: avatarColor.value
  };
  await addUserNewAccount(token, payload);

  name.value = '';
  currency.selectedIndex = 0;
  currentBalance.value = 0;
  type.selectedIndex = 0;
  avatarColor.value = '#000053';
}

async function submitExistingAccountRequest(token) {
  const accountName = document.getElementById('existingAccountName');
  const ownerUsername = document.getElementById('existingAccountOwnerUsername');

  const payload = {accountName: accountName.value, ownerUsername: ownerUsername.value};
  await addUserExistingAccount(token, payload);

  accountName.value = '';
  ownerUsername.value = '';
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');

  await setDashboardUserAccounts(token);
  await setRecordCategories(token);
  await setUserAccounts(token);
  await setDashboardUserAnalytics(token);

  submitRecord(token);
  submitBudget(token);
  submitAccount(token);

  addActionToActivityLog();
  setUserActivityLogDetails();
});
