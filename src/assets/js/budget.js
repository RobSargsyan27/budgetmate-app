const { ActivityLogLib } = require('./lib')
const { BudgetsApi, RecordCategoriesApi } = require('./api')
const Generic = require('./generic')

/**
 * @param {string} token
 * @param {string} id
 * @returns {Promise<void>}
 * @description Set budget details.
 */
async function setBudgetDetails(token, id){
  const budget = await BudgetsApi.getUserBudget(token, id)
  const recordCategories = await RecordCategoriesApi.getRecordCategories(token)

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

/**
 * @param {string} token
 * @param {string} id
 * @returns {void}
 * @description Set submit budget listener.
 */
function setSubmitBudgetListener(token, id){
  document.getElementById('updateBudgetForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('submitBudgetButton');
    const name = document.getElementById('updateBudgetName').value;
    const amount = document.getElementById('updateBudgetAmount').value;
    const recordCategories = Array
      .from(document.querySelectorAll('#updateBudgetRecordCategoriesDropdown .form-check-input:checked'))
      .map(input => input.value);

    await BudgetsApi.updateUserBudget(token, id, { name, amount, recordCategories });
    await setBudgetDetails(token, id);
    submitButton.blur();
  });
}

/**
 * @param {string} token
 * @param {string} id
 * @returns {void}
 * @description Set delete budget listener.
 */
function setDeleteBudgetListener(token, id){
  document.getElementById('deleteBudgetButton').addEventListener('click', async () => {
    await BudgetsApi.deleteUserBudget(token, id);

    window.location.href = '/budgets';
  });
}

/**
 * @param {Array<Object>} recordCategories
 * @param {Array<Object>} selectedRecordCategories
 * @description Render record categories.
 */
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
  await Generic.init()
  const token = localStorage.getItem('token');
  const budgetId = window.location.pathname.split('/').pop();

  await setBudgetDetails(token, budgetId);
  setSubmitBudgetListener(token, budgetId);
  setDeleteBudgetListener(token, budgetId);

  ActivityLogLib.addActionToActivityLog(`Budget ${budgetId} details`);
  ActivityLogLib.setUserActivityLogDetails();
});
