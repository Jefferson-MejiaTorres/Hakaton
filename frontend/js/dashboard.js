// ==========================================
// SIDI - Dashboard Module
// ==========================================

// Configuración de Supabase
const SUPABASE_URL = 'https://hfeixwjdgvmrackugnsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWl4d2pkZ3ZtcmFja3VnbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTY1NjksImV4cCI6MjA4MDE3MjU2OX0.JZrUe6qCyi3Wu6dUoT4ulVeOMnYyTyTyrEeqBExoA24';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let chartsInstances = {};

// ==========================================
// Proteger página (requiere login)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            window.location.href = 'index.html';
            return;
        }
        
        // Mostrar nombre de usuario
        const userName = document.getElementById('user-name');
        if (userName) {
            userName.textContent = session.user.email.split('@')[0];
        }
        
        // Cargar datos iniciales
        await loadDashboardData();
        
        // Setup navigation
        setupNavigation();
        
        // Setup logout
        setupLogout();
        
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        window.location.href = 'index.html';
    }
});

// ==========================================
// Cargar datos del dashboard
// ==========================================
async function loadDashboardData() {
    try {
        // Obtener estadísticas de Supabase
        // Por ahora usamos datos simulados
        const stats = {
            total: 247,
            alto: 23,
            medio: 78,
            bajo: 146
        };
        
        // Actualizar stats cards
        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-alto').textContent = stats.alto;
        document.getElementById('stat-medio').textContent = stats.medio;
        document.getElementById('stat-bajo').textContent = stats.bajo;
        
        // Cargar gráficas
        loadCharts(stats);
        
        // Cargar tabla recientes
        await loadRecentCases();
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// ==========================================
// Cargar gráficas
// ==========================================
function loadCharts(stats) {
    // Gráfica de Riesgo (Pie Chart)
    const ctxRiesgo = document.getElementById('chart-riesgo');
    if (ctxRiesgo) {
        if (chartsInstances.riesgo) chartsInstances.riesgo.destroy();
        
        chartsInstances.riesgo = new Chart(ctxRiesgo, {
            type: 'doughnut',
            data: {
                labels: ['Riesgo Alto', 'Riesgo Medio', 'Riesgo Bajo'],
                datasets: [{
                    data: [stats.alto, stats.medio, stats.bajo],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(234, 179, 8, 0.8)',
                        'rgba(34, 197, 94, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfica de Tendencia (Line Chart)
    const ctxTendencia = document.getElementById('chart-tendencia');
    if (ctxTendencia) {
        if (chartsInstances.tendencia) chartsInstances.tendencia.destroy();
        
        chartsInstances.tendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Riesgo Alto',
                        data: [12, 19, 15, 20, 18, 23],
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Riesgo Medio',
                        data: [45, 52, 60, 65, 72, 78],
                        borderColor: 'rgba(234, 179, 8, 1)',
                        backgroundColor: 'rgba(234, 179, 8, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Riesgo Bajo',
                        data: [88, 95, 110, 125, 138, 146],
                        borderColor: 'rgba(34, 197, 94, 1)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// ==========================================
// Cargar casos recientes
// ==========================================
async function loadRecentCases() {
    const tbody = document.getElementById('tabla-recientes');
    if (!tbody) return;
    
    try {
        // Por ahora datos simulados - conectar con Supabase después
        const casos = [
            { id: 1, fecha: '2025-12-05', edad: 24, peso: 10.5, riesgo: 'alto' },
            { id: 2, fecha: '2025-12-04', edad: 36, peso: 14.2, riesgo: 'medio' },
            { id: 3, fecha: '2025-12-04', edad: 18, peso: 11.8, riesgo: 'bajo' },
            { id: 4, fecha: '2025-12-03', edad: 48, peso: 16.5, riesgo: 'bajo' },
            { id: 5, fecha: '2025-12-03', edad: 12, peso: 8.2, riesgo: 'alto' }
        ];
        
        tbody.innerHTML = casos.map(caso => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-900">#${caso.id}</td>
                <td class="px-4 py-3 text-gray-600">${caso.fecha}</td>
                <td class="px-4 py-3 text-gray-600">${caso.edad} meses</td>
                <td class="px-4 py-3 text-gray-600">${caso.peso} kg</td>
                <td class="px-4 py-3">
                    ${getRiesgoBadge(caso.riesgo)}
                </td>
                <td class="px-4 py-3">
                    <button class="text-blue-600 hover:text-blue-800 font-semibold">
                        <i class="fas fa-eye mr-1"></i>Ver
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error al cargar casos:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error al cargar datos</td></tr>';
    }
}

// ==========================================
// Helper: Badge de riesgo
// ==========================================
function getRiesgoBadge(riesgo) {
    const badges = {
        'alto': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Alto</span>',
        'medio': '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Medio</span>',
        'bajo': '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Bajo</span>'
    };
    return badges[riesgo] || badges['medio'];
}

// ==========================================
// Setup Navigation
// ==========================================
function setupNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    const views = {
        '#dashboard': 'view-dashboard',
        '#pacientes': 'view-pacientes',
        '#predicciones': 'view-predicciones',
        '#registrar': 'view-registrar'
    };
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Si es link externo, permitir navegación normal
            if (!href.startsWith('#')) return;
            
            e.preventDefault();
            
            // Ocultar todas las vistas
            Object.values(views).forEach(viewId => {
                const view = document.getElementById(viewId);
                if (view) view.classList.add('hidden');
            });
            
            // Mostrar vista seleccionada
            const targetView = views[href];
            if (targetView) {
                const view = document.getElementById(targetView);
                if (view) view.classList.remove('hidden');
            }
            
            // Actualizar link activo
            links.forEach(l => {
                l.classList.remove('active', 'bg-blue-50', 'text-blue-600');
                l.classList.add('text-gray-700');
            });
            link.classList.add('active', 'bg-blue-50', 'text-blue-600');
            link.classList.remove('text-gray-700');
        });
    });
}

// ==========================================
// Setup Logout
// ==========================================
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await supabase.auth.signOut();
                localStorage.removeItem('userRole');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }
}

// ==========================================
// Form Paciente Handler
// ==========================================
const formPaciente = document.getElementById('form-paciente');
if (formPaciente) {
    formPaciente.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Aquí conectar con Supabase para guardar paciente
        alert('Funcionalidad de guardado en desarrollo. Conectar con Supabase.');
        
        // Simulación
        console.log('Guardando paciente...');
        
        // Reset form
        formPaciente.reset();
    });
}
