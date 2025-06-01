function addActionToActivityLog(){
  const sessionActivityLog = sessionStorage.getItem('activityLog');
  const activityLog = JSON.parse(sessionActivityLog) || [];

  const message = { page: 'Records History', date: new Date() };
  activityLog.push(message);
  sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
}

async function getRecordReportUrl(token){
  const payload = getRecordFilters();

  const response = await fetch('api/v1/record/report', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify(payload)
  });

  return response.blob();
}

function getRecordFilters() {
  const recordTypeSelect = document.getElementById('recordTypeSelect').value;
  const timestampStartFilter = document.getElementById('timestampStartFilter').value;
  const timestampEndFilter = document.getElementById('timestampEndFilter').value;
  const amountStartFilter = document.getElementById('amountStartFilter').value;
  const amountEndFilter = document.getElementById('amountEndFilter').value;

  return {
    recordType: recordTypeSelect === 'all' ? null : recordTypeSelect,
    amountGreaterThan: amountStartFilter || null,
    amountLessThan: amountEndFilter || null,
    paymentTimeGreaterThan: timestampStartFilter === null ? null : new Date(timestampStartFilter),
    paymentTimeLessThan: timestampEndFilter === null ? null : new Date(timestampEndFilter)
  };
}

async function getUserRecordsCount(token) {
  const payload = getRecordFilters();

  const response = await fetch('api/v1/record/count', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify(payload)
  });

  return response.json();
}

async function getUserRecords(token, limit, offset) {
  const payload = getRecordFilters();

  const result = await fetch(`api/v1/record/${limit}/${offset}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify(payload)
  });

  return result.json();
}

function setRowLinkListeners(){
  document.querySelectorAll('.clickable-row').forEach(row => {
    row.addEventListener('click', function () {
      window.location.href = this.dataset.href;
    });
  });
}

async function renderRecordTable(token, currentPage) {
  const limit = document.getElementById('recordsPerPageSelect').value;
  const offset = (currentPage - 1) * parseInt(limit);
  const recordsTableBody = document.getElementById('recordsHistoryTableBody');
  const records = await getUserRecords(token, limit, offset);

  recordsTableBody.innerHTML = '';
  records.forEach((record) => {
    const paymentTime = new Date(record.paymentTime);
    recordsTableBody.innerHTML +=
      `<tr class="clickable-row" data-href="/record/${record.id}">
          <td>${record.amount}</td>
          <td>${record.type}</td>
          <td>${record.category?.name || ''}</td>
          <td>${record.currency}</td>
          <td>${paymentTime.getMonth() + 1}/${paymentTime.getDate()}/${paymentTime.getFullYear()}</td>
          <td>${record.receivingAccountName || ''}</td>
          <td>${record.withdrawalAccountName || ''}</td>
       </tr>`;
  });
}

function renderPagination(recordsCount, recordsPerPage, currentPage, token) {
  const paginationControls = document.getElementById('paginationControls');
  const totalPages = Math.ceil(recordsCount / recordsPerPage);
  paginationControls.innerHTML = '';

  function createPageItem(page, label = null, isActive = false, isDisabled = false) {
    const li = document.createElement('li');
    li.className = `page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${label || page}</a>`;
    if (!isDisabled && !isActive) {
      li.addEventListener('click', async function (e) {
        e.preventDefault();
        currentPage = page;
        await renderRecordTable(token, currentPage);
        renderPagination(recordsCount, recordsPerPage, currentPage, token);
        setRowLinkListeners();
      });
    }
    paginationControls.appendChild(li);
  }

  createPageItem(currentPage - 1, '&laquo;', false, currentPage === 1);

  currentPage > 3 && createPageItem(1);

  if (currentPage > 4) {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = `<span class="page-link">...</span>`;
    paginationControls.appendChild(li);
  }

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    createPageItem(i, null, i === currentPage);
  }

  if (currentPage < totalPages - 3) {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = `<span class="page-link">...</span>`;
    paginationControls.appendChild(li);
  }

  currentPage < totalPages - 2 && createPageItem(totalPages);
  createPageItem(currentPage + 1, '&raquo;', false, currentPage === totalPages);
}

function setGenerateReportListener(token){
  document.getElementById('recordReportButton').addEventListener('click', async () => {
    const blob = await getRecordReportUrl(token);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'records-report.json';
    link.click();
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');

  let currentPage = 1;
  const recordsCount = await getUserRecordsCount(token);
  const recordsPerPage = document.getElementById('recordsPerPageSelect').value;
  await renderPagination(recordsCount, recordsPerPage, currentPage, token);
  await renderRecordTable(token, currentPage);

  const recordsPerPageSelect = document.getElementById('recordsPerPageSelect');
  recordsPerPageSelect.addEventListener('change', async function () {
    const recordsPerPage = parseInt(this.value);
    currentPage = 1;
    const recordsCount = await getUserRecordsCount(token);
    renderPagination(recordsCount, recordsPerPage, currentPage, token);
    await renderRecordTable(token, currentPage);
    setRowLinkListeners();
  });

  document.getElementById('recordsApplyFilters').addEventListener('click', async (event) => {
    const recordsPerPage = parseInt(document.getElementById('recordsPerPageSelect').value);
    currentPage = 1;
    const recordsCount = await getUserRecordsCount(token);
    renderPagination(recordsCount, recordsPerPage, currentPage, token);
    await renderRecordTable(token, currentPage);
    setRowLinkListeners();

    event.target.blur();
  });

  setRowLinkListeners();
  setGenerateReportListener(token);

  addActionToActivityLog();
  setUserActivityLogDetails();
});
