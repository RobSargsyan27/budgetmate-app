function addActionToActivityLog(){
  const sessionActivityLog = sessionStorage.getItem('activityLog');
  const activityLog = JSON.parse(sessionActivityLog) || [];

  const message = {page: 'Budgets', date: new Date()};
  activityLog.push(message);
  sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
}

async function getUserBudgetsReport(token) {
  const response = await fetch('api/v1/budget/report', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.blob();
}


async function getUserBudgets(token){
  const response = await fetch('api/v1/budget', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function getUsersBudgetsCurrentBalance(token) {
  const response = await fetch('api/v1/budget/current-balance', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

function setBudget(budgetsContainer, budget, budgetsCurrentBalance){
  const categoriesHTML = budget.recordCategories.map(category =>
      `<span class="text-xs alert-info border border-radius1 p-1 ml-1">${category.name}</span>`
  ).join('');

  const budgetCurrentBalance = budgetsCurrentBalance.find((item) => budget.id === item.id).currentBalance;

  const currentProgress = budgetCurrentBalance > 0
      ? budgetCurrentBalance * 100 / budget.amount
      : 0;

  budgetsContainer.innerHTML  +=
      `<div class="col-xl-3 col-md-6 mb-4">
          <a class="text-decoration-none" href="/budget/${budget.id}">
            <div class="card h-100 py-2 position-relative">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div class="position-absolute mt-3 me-3" style="top: 1rem; right: 1rem">
                        <i class="fas fa-coins fa-2x text-gray-400"></i>
                    </div>
                    <div class="d-flex flex-row">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-lg font-weight-bold text-uppercase mb-1">${budget.name}</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">${budget.amount}</div>
                                <div class="mt-2 d-flex flex-wrap fl-gap-1">${categoriesHTML}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5">
                        <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                                <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${currentProgress.toFixed(2)}%</div>
                            </div>
                            <div class="col">
                                <div class="progress progress-sm">
                                    <div class="progress-bar bg-info" role="progressbar" 
                                         style="width: ${currentProgress.toFixed(2)}%" aria-valuemin="0" 
                                         aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </a>
      </div>`;
}

async function setBudgets(token) {
  const budgetsContainer = document.getElementById('budgetsContainer');
  const budgets = await getUserBudgets(token);
  const budgetsCurrentBalance = await getUsersBudgetsCurrentBalance(token);

  budgetsContainer.innerHTML = '';

  budgets.length
      ? budgets.forEach((budget) => setBudget(budgetsContainer, budget, budgetsCurrentBalance))
      : budgetsContainer.innerHTML = '<h4 class="text-center ml-3 mt-4">No budgets just yet!</h4>'

}

function setBudgetReportListener(token) {
  document.getElementById('budgetReportButton').addEventListener('click', async () => {
    const blob =  await getUserBudgetsReport(token);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'budgets-report.json';
    link.click();
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');

  await setBudgets(token);

  addActionToActivityLog();
  setUserActivityLogDetails();

  setBudgetReportListener(token);
});
