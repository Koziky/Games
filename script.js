class KozikyAuth {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('passwordToggle')?.addEventListener('click', () => {
      this.togglePassword('password', 'passwordToggle');
    });
    document.getElementById('newPasswordToggle')?.addEventListener('click', () => {
      this.togglePassword('newPassword', 'newPasswordToggle');
    });

    document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignup(e));
  }

  togglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    const icon = toggle.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
    this.addRippleEffect(toggle);
  }

  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;
    const submitBtn = document.querySelector('#loginForm .login-btn');

    if (!/^[a-zA-Z0-9]{1,12}$/.test(username)) {
      this.showToast('Username must be 1–12 letters or numbers only', 'error');
      return;
    }
    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }

    this.setLoading(submitBtn, true);

    try {
      await new Promise(r => setTimeout(r, 2000));
      if (username === 'exampleuser' && password === 'password') {
        if (remember) localStorage.setItem('rememberUser', 'true');
        this.showToast('Login successful! Redirecting...', 'success');
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    } finally {
      this.setLoading(submitBtn, false);
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.querySelector('#signupForm .login-btn');

    if (!/^[a-zA-Z0-9]{1,12}$/.test(username)) {
      this.showToast('Username must be 1–12 letters or numbers only', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showToast('Invalid email format', 'error');
      return;
    }
    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    this.setLoading(submitBtn, true);

    setTimeout(() => {
      this.showToast('Signup successful! Redirecting...', 'success');
      this.setLoading(submitBtn, false);
    }, 2000);
  }

  setLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
 
