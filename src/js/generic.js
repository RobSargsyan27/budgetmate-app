function setUserActivityLogDetails() {
  const sessionActivityLog = sessionStorage.getItem('activityLog');

  if (sessionActivityLog) {
    const activityLog = JSON.parse(sessionActivityLog);
    const activityLogTable = document.getElementById('activityLogTable');

    activityLogTable.innerHTML = '';
    activityLog.forEach((log) => {
      activityLogTable.innerHTML +=
      `<tr>
        <td>${log.page}</td>
        <td>${log.date}</td>
      </tr>`;
    });
  }
}

function setUserLogOutListener() {
  const logOutButton = document.getElementById('logOutButton');

  logOutButton.addEventListener('click', function () {
    localStorage.removeItem('token');
    sessionStorage.removeItem('activityLog');
    window.location.href = '/login';
  });
}

async function validateToken(token) {
  try {
    const response = await fetch('/api/v1/auth/validate-token', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token})
    });

    if (response.ok) {
      const {isTokenValid} = await response.json();
      if (!isTokenValid) {
        window.location.href = '/login';
      }

    } else {
      window.location.href = '/login';
    }
  } catch (error) {
    window.location.href = '/login';
  }
}

async function getUserDetails(token) {
  const response = await fetch('/api/v1/user', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });

  return response.json();
}

async function getUserNotifications(token){
  const response = await fetch('/api/v1/user/notifications', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  });

  return response.json();
}


function submitNotificationAnswer(token, id, type){
  const isApproved = type === 'approved';

  return fetch(`http://app.budgetmate.com/api/v1/account/${id}/${isApproved}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
  });
}

function setNotificationButtons(token, buttons, type, topNavbarNotificationCount){
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      await submitNotificationAnswer(token, event.target.id, type);

      const link = document.getElementById(`${event.target.id}-link`);
      if (link) {
        link.remove();
      }

      if (parseInt(topNavbarNotificationCount.textContent) - 1 === 0) {
        topNavbarNotificationCount.style.display = 'none';
      } else {
        topNavbarNotificationCount.textContent = (parseInt(topNavbarNotificationCount.textContent) - 1).toString();
      }
    });
  });
}

async function setNotifications(token) {
  const topNavbarNotificationCount = document.getElementById('topNavbarNotificationCount');
  const dropdownMenu = document.getElementById('topNavbarNotifications');
  dropdownMenu.innerHTML = '<h6 class="dropdown-header">Notifications Center</h6>';
  const notifications = getUserNotifications(token);

  if (notifications.length) {
    topNavbarNotificationCount.textContent = notifications.length;

    notifications.forEach(notification => {
      dropdownMenu.innerHTML += `
        <a class="dropdown-item d-flex flex-column" href="#" id="${notification.id}-link">
          <div class="d-flex flex-row">
            <div class="icon-circle bg-primary mr-3">
                <i class="fas fa-info text-white"></i>
            </div>
            <div class="text-gray-500">
                "${notification.requestedUsername}" requested to add "${notification.accountName}" account.
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between mt-2">
            <div class="btn btn-sm btn-danger notification-reject-button" id="${notification.id}">Reject</div>
            <div class="btn btn-sm btn-primary notification-approve-button" id="${notification.id}">Accept</div>
          </div>
        </a>`;
    });
  }

  const rejectButtons = Array.from(document.getElementsByClassName('notification-reject-button'));
  setNotificationButtons(token, rejectButtons, 'rejected', topNavbarNotificationCount);
  const approvedButtons = Array.from(document.getElementsByClassName('notification-approve-button'));
  setNotificationButtons(token, approvedButtons, 'approved', topNavbarNotificationCount);
}

function setTopNavDetails(username, firstname, lastname, avatarColor) {
  const topNavUsername = document.getElementById('topNavUsername');
  const topNavAvatar = document.getElementById('topNavAvatar');

  topNavUsername.textContent = username;
  topNavAvatar.textContent = `${firstname.substring(0, 1).toUpperCase()} ${lastname.substring(0, 1).toUpperCase()}`;
  topNavAvatar.style.backgroundColor = avatarColor || '#00008B';

  setUserActivityLogDetails();
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
  const body = document.getElementById('page-top');

  if (!token) {
    window.location.href = '/login';
  }

  await validateToken(token);

  setUserLogOutListener();
  const user = await getUserDetails(token);
  await setNotifications(token);
  setTopNavDetails(user.username, user.firstname, user.lastname, user.avatarColor);

  body.style.display = 'block';
});
