class LoginManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupAnimations();
  }

  bindEvents() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    passwordToggle?.addEventListener('click', () => {
      this.togglePassword(passwordInput, passwordToggle);
    });

    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', (e) => this.handleLogin(e));

    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', e => this.handleInputFocus(e));
      input.addEventListener('blur', e => this.handleInputBlur(e));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.handleLogin(e);
      }
    });
  }

  togglePassword(input, toggle) {
    const icon = toggle.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
    this.addRippleEffect(toggle);
  }

  async handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const submitBtn = document.querySelector('.login-btn');

    if (!this.validateUsername(username)) {
      this.showToast('Username must be 1–12 letters or numbers only', 'error');
      return;
    }
    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }

    this.setLoading(submitBtn, true);

    try {
      await this.simulateLogin(username, password, remember);
      this.showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        // window.location.href = '/dashboard'; // Uncomment for real redirect
      }, 1500);
    } catch (err) {
      this.showToast(err.message, 'error');
    } finally {
      this.setLoading(submitBtn, false);
    }
  }

  async simulateLogin(username, password, remember) {
    await new Promise(r => setTimeout(r, 2000));
    if (username === 'exampleuser' && password === 'password') {
      if (remember) localStorage.setItem('rememberUser', 'true');
      return { success: true, token: 'fake-jwt-token' };
    }
    throw new Error('Invalid username or password');
  }

  validateUsername(username) {
    const re = /^[a-zA-Z0-9]{1,12}$/;
    return re.test(username);
  }

  handleInputFocus(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper?.classList.add('focused');
    e.target.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
  }

  handleInputBlur(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper?.classList.remove('focused');
    e.target.style.boxShadow = '';
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
  }

  addRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      pointer-events: none;
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: 50%;
      top: 50%;
      width: 20px;
      height: 20px;
      margin-left: -10px;
      margin-top: -10px;
    `;
    element.style.position = 'relative';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  setupAnimations() {
    const formElements = document.querySelectorAll('.form-group, .form-options, .login-btn');
    formElements.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.1}s`;
      el.classList.add('fade-in-up');
    });

    if (window.innerWidth > 768) {
      document.addEventListener('mousemove', e => {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        shapes.forEach((shape, i) => {
          const speed = (i + 1) * 0.5;
          const xOffset = (x - 0.5) * speed * 20;
          const yOffset = (y -
