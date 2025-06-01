function showMessage(message, text, type, color){
  message.style.display ='block';
  message.textContent = text;
  message.classList.add(type);
  message.style.color = color;
}

function setLoginFormListener(loginForm, message){
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;

    try{
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });
      const responseBody = await response.json();

      if(response.ok){
        const { token } = responseBody;

        if (token) {
          const activity = { page: 'User logged in.', date: new Date() };
          localStorage.setItem('token', token);
          sessionStorage.setItem('activityLog', JSON.stringify([activity]));
          sessionStorage.setItem('lang', 'en');
          window.location.href = '/dashboard';
        }
      }else {
        const { message: text } = responseBody;
        showMessage(message, text, 'alert-danger', 'red');
      }

    }catch (error){
      showMessage(message, 'An error occurred. Please try again later.', 'alert-danger', 'red');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const message = document.getElementById('message');

  setLoginFormListener(loginForm, message);
});
