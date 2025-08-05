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
      this.show
