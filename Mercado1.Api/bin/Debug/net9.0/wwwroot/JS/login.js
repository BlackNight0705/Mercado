const API_BASE = "http://localhost:5080/api/auth";

// Cambiar entre tabs
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const buttons = document.querySelectorAll('.tab-button');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    successMsg.textContent = message;
    successMsg.classList.add('show');
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

// Mostrar error en campo
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    input.classList.add('error');
    error.textContent = message;
    error.classList.add('show');
}

// Limpiar errores
function clearErrors(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('.form-input');
    const errors = form.querySelectorAll('.error-message');

    inputs.forEach(input => input.classList.remove('error'));
    errors.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    clearErrors('loginForm');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    const button = document.getElementById('loginButton');

    button.disabled = true;
    button.textContent = 'Iniciando sesión...';

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, remember })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('¡Inicio de sesión exitoso!');
            localStorage.setItem('authToken', data.token);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('loginEmail', data.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('loginEmail', 'Error de conexión. Intenta de nuevo.');
    } finally {
        button.disabled = false;
        button.textContent = 'Iniciar Sesión';
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    clearErrors('registerForm');

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const button = document.getElementById('registerButton');

    if (password !== confirmPassword) {
        showError('registerConfirmPassword', 'Las contraseñas no coinciden');
        return;
    }

    button.disabled = true;
    button.textContent = 'Creando cuenta...';

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('¡Cuenta creada exitosamente!');
            setTimeout(() => {
                switchTab('login');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else {
            showError('registerEmail', data.message || 'Error al crear cuenta');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('registerEmail', 'Error de conexión. Intenta de nuevo.');
    } finally {
        button.disabled = false;
        button.textContent = 'Crear Cuenta';
    }
}