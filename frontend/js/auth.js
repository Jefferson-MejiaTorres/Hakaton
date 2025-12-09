// ==========================================
// SIDI - Auth Module (Autenticación)
// ==========================================

// Configuración de Supabase
const SUPABASE_URL = 'https://hfeixwjdgvmrackugnsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWl4d2pkZ3ZtcmFja3VnbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTY1NjksImV4cCI6MjA4MDE3MjU2OX0.JZrUe6qCyi3Wu6dUoT4ulVeOMnYyTyTyrEeqBExoA24';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// Obtener rol desde URL
// ==========================================
function getRoleFromURL() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    
    const roleNames = {
        'medico': 'Personal Médico',
        'investigador': 'Investigación',
        'institucion': 'Institución Educativa'
    };
    
    return {
        code: role,
        name: roleNames[role] || 'Usuario'
    };
}

// ==========================================
// Mostrar rol en la UI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const roleInfo = getRoleFromURL();
    const roleDisplay = document.getElementById('role-display');
    
    if (roleDisplay && roleInfo.code) {
        roleDisplay.textContent = `Ingresando como: ${roleInfo.name}`;
    }
    
    // Actualizar link de registro con rol
    const registerLink = document.getElementById('register-link');
    if (registerLink && roleInfo.code) {
        registerLink.href = `register.html?role=${roleInfo.code}`;
    }
});

// ==========================================
// Toggle Password Visibility
// ==========================================
const togglePassword = document.getElementById('toggle-password');
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    });
}

// ==========================================
// Login Form Handler
// ==========================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');
        const errorAlert = document.getElementById('error-alert');
        const errorMessage = document.getElementById('error-message');
        const roleInfo = getRoleFromURL();
        
        // Deshabilitar botón
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Ingresando...';
        errorAlert.classList.add('hidden');
        
        try {
            // Login con Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Guardar rol en localStorage
            if (roleInfo.code) {
                localStorage.setItem('userRole', roleInfo.code);
            }
            
            // Redireccionar al dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Error de login:', error);
            errorMessage.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            errorAlert.classList.remove('hidden');
            
            // Rehabilitar botón
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Ingresar';
        }
    });
}

// ==========================================
// Check Auth Status
// ==========================================
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// ==========================================
// Protect Dashboard Pages
// ==========================================
async function protectPage() {
    const session = await checkAuth();
    
    if (!session) {
        window.location.href = 'index.html';
    }
    
    return session;
}

// ==========================================
// Logout Function
// ==========================================
async function logout() {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// ==========================================
// Export Functions
// ==========================================
window.sidiAuth = {
    checkAuth,
    protectPage,
    logout,
    supabase
};
