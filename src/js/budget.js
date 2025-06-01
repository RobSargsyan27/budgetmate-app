function addActionToActivityLog(budgetId){
  const sessionActivityLog = sessionStorage.getItem('activityLog');
  const activityLog = JSON.parse(sessionActivityLog) || [];

  const message = {page: `Budget ${budgetId} details`, date: new Date()};
  activityLog.push(message);
  sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
}

async function getRecordCategories(token) {
  const response = await fetch('/api/v1/record/record-categories', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function getUserBudget(token, id){
  const response = await fetch(`/api/v1/budget/${id}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

function updateUserBudget(token, id, payload){
  const { amount, name, recordCategories } = payload;

  return fetch(`http://app.budgetmate.com/api/v1/budget/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ amount, name, recordCategories })
  });
}

function deleteUserBudget(token, id) {
  return fetch(`/api/v1/budget/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });
}

async function setBudgetDetails(token, id){
  const budget = await getUserBudget(token, id);
  const recordCategories = await getRecordCategories(token);

  const budgetName = document.getElementById('budgetName');
  const budgetSelectedRecordCategories = document.getElementById('budgetSelectedRecordCategories');
  const updateBudgetName = document.getElementById('updateBudgetName');
  const updateBudgetAmount = document.getElementById('updateBudgetAmount');

  budgetName.textContent = budget.name;
  updateBudgetName.value = budget.name;
  updateBudgetAmount.value = budget.amount;
  renderRecordCategories(recordCategories, budget.recordCategories);

  budgetSelectedRecordCategories.innerHTML = budget.recordCategories.map(category =>
    `<span class="text-lg alert-info border border-radius1 p-1 ml-1">${category.name}</span>`
  ).join('');
}

function setSubmitBudgetListener(token, id){
  document.getElementById('updateBudgetForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('submitBudgetButton');
    const name = document.getElementById('updateBudgetName').value;
    const amount = document.getElementById('updateBudgetAmount').value;
    const recordCategories = Array
      .from(document.querySelectorAll('#updateBudgetRecordCategoriesDropdown .form-check-input:checked'))
      .map(input => input.value);

    await updateUserBudget(token, id, { name, amount, recordCategories });
    await setBudgetDetails(token, id);
    submitButton.blur();
  });
}

function setDeleteBudgetListener(token, id){
  document.getElementById('deleteBudgetButton').addEventListener('click', async () => {
    await deleteUserBudget(token, id);

    window.location.href = '/budgets';
  });
}

function renderRecordCategories(recordCategories, selectedRecordCategories){
  const updateBudgetRecordCategoriesDropdown = document.getElementById('updateBudgetRecordCategoriesDropdown');

  updateBudgetRecordCategoriesDropdown.innerHTML = '';
  recordCategories.forEach((recordCategory) => {
    const input = selectedRecordCategories.find((category) => category.id === recordCategory.id)
      ? `<input checked type="checkbox" class="form-check-input" name="${recordCategory.name}" value="${recordCategory.name}"/>`
      : `<input type="checkbox" class="form-check-input" name="${recordCategory.name}" value="${recordCategory.name}"/>`;

    updateBudgetRecordCategoriesDropdown.innerHTML +=
            `<div class="form-check">
                ${input}
                <label class="mr-2">${recordCategory.name}</label>
            </div>`;
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
  const budgetId = window.location.pathname.split('/').pop();

  await setBudgetDetails(token, budgetId);
  setSubmitBudgetListener(token, budgetId);
  setDeleteBudgetListener(token, budgetId);

  addActionToActivityLog(budgetId);
  setUserActivityLogDetails();
});
