document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // prevent actual form submission

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  // Simulate successful login
  alert(`Logged in as: ${email}`);
});
