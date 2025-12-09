// @ts-nocheck
// ==========================================
// SIDI - Dashboard Module
// ==========================================

// Configuración de Supabase
const SUPABASE_URL = 'https://hfeixwjdgvmrackugnsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWl4d2pkZ3ZtcmFja3VnbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTY1NjksImV4cCI6MjA4MDE3MjU2OX0.JZrUe6qCyi3Wu6dUoT4ulVeOMnYyTyTyrEeqBExoA24';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let chartsInstances = {};

// ==========================================
// Funciones Auxiliares
// ==========================================
function getRiesgoBadge(riesgo) {
    const badges = {
        'alto': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><i class="fas fa-exclamation-circle mr-1"></i>Alto</span>',
        'medio': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i class="fas fa-exclamation-triangle mr-1"></i>Medio</span>',
        'bajo': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Bajo</span>',
        'sin evaluar': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><i class="fas fa-question-circle mr-1"></i>Sin evaluar</span>'
    };
    return badges[riesgo] || badges['sin evaluar'];
}

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
        
        // Obtener rol del usuario
        const userRole = localStorage.getItem('userRole') || session.user.user_metadata?.rol || 'medico';
        console.log('Rol del usuario:', userRole);
        
        // Filtrar menú según rol
        filterMenuByRole(userRole);
        
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
// Filtrar menú según rol
// ==========================================
function filterMenuByRole(role) {
    // Ocultar todos los items con data-role
    document.querySelectorAll('[data-role]').forEach(item => {
        item.style.display = 'none';
    });
    
    // Mostrar solo los del rol actual
    document.querySelectorAll(`[data-role="${role}"]`).forEach(item => {
        item.style.display = '';
    });
}

// ==========================================
// Cargar datos del dashboard
// ==========================================
async function loadDashboardData() {
    try {
        // Obtener TODOS los niños
        const { data: ninos, error: errorNinos } = await supabase
            .from('ninos')
            .select('id, nombre, apellido, fecha_nacimiento');
        
        if (errorNinos) throw errorNinos;
        
        // Obtener predicciones para calcular riesgos
        const { data: predicciones, error: errorPredicciones } = await supabase
            .from('predicciones')
            .select('nino_id, nivel_riesgo')
            .order('fecha_prediccion', { ascending: false });
        
        if (errorPredicciones) throw errorPredicciones;
        
        // Crear un mapa de riesgos (último riesgo por niño)
        const riesgosPorNino = {};
        predicciones?.forEach(pred => {
            if (!riesgosPorNino[pred.nino_id]) {
                riesgosPorNino[pred.nino_id] = pred.nivel_riesgo;
            }
        });
        
        // Calcular estadísticas
        const total = ninos?.length || 0;
        let alto = 0, medio = 0, bajo = 0, sinEvaluar = 0;
        
        ninos?.forEach(nino => {
            const riesgo = riesgosPorNino[nino.id];
            if (!riesgo) {
                sinEvaluar++;
            } else if (riesgo === 'alto') {
                alto++;
            } else if (riesgo === 'medio') {
                medio++;
            } else if (riesgo === 'bajo') {
                bajo++;
            }
        });
        
        const stats = { total, alto, medio, bajo, sinEvaluar };
        
        // Actualizar stats cards con animación
        animateCounter('stat-total', stats.total);
        animateCounter('stat-alto', stats.alto);
        animateCounter('stat-medio', stats.medio);
        animateCounter('stat-bajo', stats.bajo);
        
        // Cargar gráficas
        loadCharts(stats);
        
        // Cargar tabla recientes
        await loadRecentCases();
        
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        // Mostrar datos en 0 si hay error
        document.getElementById('stat-total').textContent = '0';
        document.getElementById('stat-alto').textContent = '0';
        document.getElementById('stat-medio').textContent = '0';
        document.getElementById('stat-bajo').textContent = '0';
    }
}

// ==========================================
// Animar contadores
// ==========================================
function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000; // 1 segundo
    const start = 0;
    const increment = finalValue / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
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
                labels: ['🔴 Alto Riesgo', '🟠 Medio Riesgo', '🟢 Bajo Riesgo'],
                datasets: [{
                    data: [stats.alto, stats.medio, stats.bajo],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.9)',   // Rojo más intenso
                        'rgba(249, 115, 22, 0.9)',  // Naranja vibrante
                        'rgba(34, 197, 94, 0.9)'    // Verde brillante
                    ],
                    borderColor: [
                        'rgba(220, 38, 38, 1)',     // Borde rojo oscuro
                        'rgba(234, 88, 12, 1)',     // Borde naranja oscuro
                        'rgba(22, 163, 74, 1)'      // Borde verde oscuro
                    ],
                    borderWidth: 3,
                    hoverOffset: 15,
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13,
                                weight: '600'
                            },
                            usePointStyle: false,
                            boxWidth: 15,
                            boxHeight: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} pacientes (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%',
                animation: {
                    animateScale: true,
                    animateRotate: true
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
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [
                    {
                        label: '🔴 Riesgo Alto',
                        data: [12, 19, 15, 20, 18, 23],
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(239, 68, 68, 1)',
                        pointHoverBorderWidth: 3
                    },
                    {
                        label: '🟠 Riesgo Medio',
                        data: [45, 52, 60, 65, 72, 78],
                        borderColor: 'rgba(249, 115, 22, 1)',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: 'rgba(249, 115, 22, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(249, 115, 22, 1)',
                        pointHoverBorderWidth: 3
                    },
                    {
                        label: '🟢 Riesgo Bajo',
                        data: [88, 95, 110, 125, 138, 146],
                        borderColor: 'rgba(34, 197, 94, 1)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
                        pointHoverBorderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13,
                                weight: '600'
                            },
                            usePointStyle: false,
                            boxWidth: 15,
                            boxHeight: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} pacientes`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            padding: 10
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            padding: 10
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
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
    
    tbody.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Cargando casos recientes...</td></tr>';
    
    try {
        // Obtener últimos 10 niños con sus mediciones y predicciones
        const { data: ninos, error: errorNinos } = await supabase
            .from('ninos')
            .select(`
                id,
                nombre,
                apellido,
                fecha_nacimiento,
                fecha_registro
            `)
            .order('fecha_registro', { ascending: false })
            .limit(10);
        
        if (errorNinos) throw errorNinos;
        
        if (!ninos || ninos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">No hay pacientes registrados aún</td></tr>';
            return;
        }
        
        // Obtener mediciones para cada niño
        const { data: mediciones, error: errorMed } = await supabase
            .from('mediciones_antropometricas')
            .select('nino_id, peso, talla, fecha_medicion')
            .in('nino_id', ninos.map(n => n.id))
            .order('fecha_medicion', { ascending: false });
        
        // Obtener predicciones para cada niño
        const { data: predicciones, error: errorPred } = await supabase
            .from('predicciones')
            .select('nino_id, nivel_riesgo, fecha_prediccion')
            .in('nino_id', ninos.map(n => n.id))
            .order('fecha_prediccion', { ascending: false });
        
        // Crear mapas de datos
        const medicionesPorNino = {};
        mediciones?.forEach(med => {
            if (!medicionesPorNino[med.nino_id]) {
                medicionesPorNino[med.nino_id] = med;
            }
        });
        
        const prediccionesPorNino = {};
        predicciones?.forEach(pred => {
            if (!prediccionesPorNino[pred.nino_id]) {
                prediccionesPorNino[pred.nino_id] = pred.nivel_riesgo;
            }
        });
        
        // Generar filas de la tabla
        tbody.innerHTML = ninos.map(nino => {
            const medicion = medicionesPorNino[nino.id];
            const riesgo = prediccionesPorNino[nino.id] || 'sin_evaluar';
            
            // Calcular edad en meses
            const fechaNac = new Date(nino.fecha_nacimiento);
            const hoy = new Date();
            const meses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
            
            // Formatear fecha de registro
            const fechaReg = new Date(nino.fecha_registro);
            const fechaFormateada = fechaReg.toLocaleDateString('es-CO', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Obtener inicial para avatar
            const inicial = nino.nombre.charAt(0).toUpperCase();
            
            return `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                                ${inicial}
                            </div>
                            <div>
                                <p class="text-gray-900 font-semibold">${nino.nombre} ${nino.apellido}</p>
                                <p class="text-xs text-gray-500">ID: ${nino.id}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-gray-600">${fechaFormateada}</td>
                    <td class="px-4 py-3 text-gray-600">${meses} meses</td>
                    <td class="px-4 py-3 text-gray-600">${medicion?.peso ? medicion.peso + ' kg' : '-'}</td>
                    <td class="px-4 py-3 text-gray-600">${medicion?.talla ? medicion.talla + ' cm' : '-'}</td>
                    <td class="px-4 py-3">
                        ${getRiesgoBadge(riesgo)}
                    </td>
                    <td class="px-4 py-3">
                        <button 
                            onclick="verDetallePaciente(${nino.id})"
                            class="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                            title="Ver detalles del paciente"
                        >
                            <i class="fas fa-eye mr-1"></i>Ver
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error al cargar casos recientes:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-red-500"><i class="fas fa-exclamation-triangle mr-2"></i>Error al cargar datos</td></tr>';
    }
}

// ==========================================
// Ver detalle desde dashboard
// ==========================================
function verDetallePaciente(ninoId) {
    // Cambiar a vista de pacientes
    document.querySelectorAll('main > section').forEach(section => section.classList.add('hidden'));
    document.getElementById('view-pacientes').classList.remove('hidden');
    
    // Actualizar navegación activa
    document.querySelectorAll('aside nav a').forEach(link => link.classList.remove('bg-blue-100', 'text-blue-700'));
    const linkPacientes = document.querySelector('aside nav a[onclick*="showView(\'pacientes\')"]');
    if (linkPacientes) {
        linkPacientes.classList.add('bg-blue-100', 'text-blue-700');
    }
    
    // Cargar pacientes y mostrar el detalle
    cargarPacientes().then(() => {
        // Buscar y abrir el modal del paciente
        const btnVer = document.querySelector(`button[onclick="verDetallesPaciente(${ninoId})"]`);
        if (btnVer) {
            btnVer.click();
        }
    });
}

// ==========================================
// Helper: Badge de riesgo
// ==========================================
function getRiesgoBadge(riesgo) {
    const badges = {
        'alto': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold inline-flex items-center"><i class="fas fa-exclamation-triangle mr-1"></i>Alto</span>',
        'medio': '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold inline-flex items-center"><i class="fas fa-exclamation-circle mr-1"></i>Medio</span>',
        'bajo': '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold inline-flex items-center"><i class="fas fa-check-circle mr-1"></i>Bajo</span>',
        'sin_evaluar': '<span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold inline-flex items-center"><i class="fas fa-question-circle mr-1"></i>Sin evaluar</span>'
    };
    return badges[riesgo] || badges['sin_evaluar'];
}

// ==========================================
// Mostrar vista específica (FUNCIÓN GLOBAL)
// ==========================================
window.showView = function(viewName) {
    // Ocultar todas las vistas
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la vista seleccionada
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        
        // Ejecutar funciones específicas según la vista
        if (viewName === 'pacientes') {
            cargarPacientes();
        } else if (viewName === 'agregar-medicion') {
            setupBuscadorPacientes();
        }
        
        // Mapa de colores por vista
        const colorMap = {
            'dashboard': { bg: 'bg-blue-100', text: 'text-blue-700', hover: 'hover:bg-blue-50' },
            'pacientes': { bg: 'bg-purple-100', text: 'text-purple-700', hover: 'hover:bg-purple-50' },
            'registrar': { bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-50' },
            'agregar-medicion': { bg: 'bg-emerald-100', text: 'text-emerald-700', hover: 'hover:bg-emerald-50' },
            'analytics': { bg: 'bg-indigo-100', text: 'text-indigo-700', hover: 'hover:bg-indigo-50' },
            'exportar': { bg: 'bg-teal-100', text: 'text-teal-700', hover: 'hover:bg-teal-50' },
            'reportes': { bg: 'bg-orange-100', text: 'text-orange-700', hover: 'hover:bg-orange-50' },
            'alertas': { bg: 'bg-red-100', text: 'text-red-700', hover: 'hover:bg-red-50' }
        };
        
        // Actualizar menú activo con colores personalizados
        document.querySelectorAll('aside nav a').forEach(link => {
            // Remover todas las clases de color posibles
            link.classList.remove(
                'bg-blue-100', 'text-blue-700', 'font-semibold',
                'bg-purple-100', 'text-purple-700',
                'bg-green-100', 'text-green-700',
                'bg-emerald-100', 'text-emerald-700',
                'bg-indigo-100', 'text-indigo-700',
                'bg-teal-100', 'text-teal-700',
                'bg-orange-100', 'text-orange-700',
                'bg-red-100', 'text-red-700'
            );
            
            // Restaurar estilo por defecto
            if (!link.classList.contains('text-gray-700')) {
                link.classList.add('text-gray-700');
            }
            
            // Verificar el onclick para encontrar el link correcto
            const onclick = link.getAttribute('onclick');
            if (onclick) {
                const match = onclick.match(/showView\(['"](.+?)['"]\)/);
                if (match && match[1] === viewName) {
                    // Remover gris y agregar color específico
                    link.classList.remove('text-gray-700');
                    const colors = colorMap[viewName];
                    if (colors) {
                        link.classList.add(colors.bg, colors.text, 'font-semibold');
                    }
                }
            }
        });
        
        // Cargar datos según la vista
        if (viewName === 'dashboard') {
            loadDashboardData();
        } else if (viewName === 'pacientes') {
            cargarPacientes();
        } else if (viewName === 'registrar') {
            // Limpiar formulario al entrar
            const form = document.getElementById('form-registrar-paciente');
            if (form) form.reset();
        } else if (viewName === 'analytics') {
            loadAnalytics();
        } else if (viewName === 'exportar') {
            // Vista de exportar no requiere carga inicial
        } else if (viewName === 'reportes') {
            loadReportesData();
        } else if (viewName === 'alertas') {
            loadAlertasData();
        }
    }
}

// ==========================================
// Setup Navigation
// ==========================================
function setupNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    const views = {
        '#dashboard': 'view-dashboard',
        '#pacientes': 'view-pacientes',
        '#registrar': 'view-registrar',
        '#agregar-medicion': 'view-agregar-medicion',
        '#analytics': 'view-analytics',
        '#exportar': 'view-exportar',
        '#reportes': 'view-reportes',
        '#alertas': 'view-alertas'
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
                
                // Cargar datos específicos de la vista
                if (href === '#pacientes') {
                    cargarPacientes();
                } else if (href === '#agregar-medicion') {
                    setupBuscadorPacientes();
                }
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
// REGISTRAR PACIENTE - Funcionalidad Completa
// ==========================================
const formRegistrarPaciente = document.getElementById('form-registrar-paciente');
if (formRegistrarPaciente) {
    formRegistrarPaciente.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Mostrar loading
        const loadingModal = mostrarModalLoading('Registrando paciente...');
        
        try {
            // 1. Recopilar datos del formulario
            const formData = new FormData(formRegistrarPaciente);
            
            const datosNino = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                fecha_nacimiento: formData.get('fecha_nacimiento'),
                sexo: formData.get('sexo'),
                documento_identidad: formData.get('documento_identidad')
            };
            
            // 2. Insertar niño en la tabla 'ninos'
            const { data: ninoCreado, error: errorNino } = await supabase
                .from('ninos')
                .insert([datosNino])
                .select()
                .single();
            
            if (errorNino) throw errorNino;
            
            const ninoId = ninoCreado.id;
            
            // 3. Calcular IMC
            const peso = parseFloat(formData.get('peso'));
            const talla = parseFloat(formData.get('talla'));
            const imc = (peso / Math.pow(talla / 100, 2)).toFixed(2);
            
            // 4. Insertar medición antropométrica
            const datosMedicion = {
                nino_id: ninoId,
                fecha_medicion: new Date().toISOString().split('T')[0],
                peso: peso,
                talla: talla,
                perimetro_braquial: formData.get('perimetro_braquial') ? parseFloat(formData.get('perimetro_braquial')) : null,
                peso_al_nacer: formData.get('peso_al_nacer') ? parseInt(formData.get('peso_al_nacer')) : null,
                imc: parseFloat(imc)
            };
            
            const { error: errorMedicion } = await supabase
                .from('mediciones_antropometricas')
                .insert([datosMedicion]);
            
            if (errorMedicion) throw errorMedicion;
            
            // 5. Insertar datos sociodemográficos (si hay)
            const zona = formData.get('zona_residencia');
            const nivelEducativo = formData.get('nivel_educativo_madre');
            const ingreso = formData.get('ingreso_familiar_mensual');
            
            if (zona || nivelEducativo || ingreso) {
                const datosSociodem = {
                    nino_id: ninoId,
                    zona_residencia: zona || null,
                    nivel_educativo_madre: nivelEducativo || null,
                    ingreso_familiar_mensual: ingreso ? parseFloat(ingreso) : null
                };
                
                const { error: errorSociodem } = await supabase
                    .from('datos_sociodemograficos')
                    .insert([datosSociodem]);
                
                if (errorSociodem) throw errorSociodem;
            }
            
            // 6. REALIZAR PREDICCIÓN AUTOMÁTICA
            loadingModal.querySelector('span').textContent = 'Realizando diagnóstico...';
            
            // Calcular edad en meses
            const fechaNac = new Date(datosNino.fecha_nacimiento);
            const hoy = new Date();
            const edadMeses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
            
            // Llamar a la función SQL de predicción
            const { data: prediccionData, error: errorPrediccion } = await supabase
                .rpc('predecir_simple', {
                    edad_meses: edadMeses,
                    peso: peso,
                    talla: talla,
                    zona: zona || 'urbana',
                    educacion_madre: nivelEducativo || 'secundaria'
                });
            
            let nivelRiesgo = 'sin evaluar';
            let probabilidad = 0;
            
            if (!errorPrediccion && prediccionData) {
                nivelRiesgo = prediccionData.nivel_riesgo;
                probabilidad = prediccionData.probabilidad;
                
                // Guardar predicción en la tabla
                const { error: errorInsertPred } = await supabase
                    .from('predicciones')
                    .insert([{
                        nino_id: ninoId,
                        nivel_riesgo: nivelRiesgo,
                        probabilidad: probabilidad,
                        modelo_usado: 'SQL_Prediccion_v1',
                        features_json: {
                            edad_meses: edadMeses,
                            peso: peso,
                            talla: talla,
                            imc: parseFloat(imc),
                            zona: zona || 'urbana',
                            educacion_madre: nivelEducativo || 'secundaria',
                            factores_riesgo: prediccionData.factores_riesgo || [],
                            recomendaciones: prediccionData.recomendaciones || []
                        }
                    }]);
                
                if (errorInsertPred) {
                    console.error('Error al guardar predicción:', errorInsertPred);
                }
            } else {
                console.error('Error en predicción:', errorPrediccion);
            }
            
            // Cerrar loading
            loadingModal.remove();
            
            // Mostrar modal de éxito con predicción
            mostrarModalExitoConPrediccion(ninoCreado, imc, nivelRiesgo, probabilidad, prediccionData);
            
            // Limpiar formulario
            formRegistrarPaciente.reset();
            
        } catch (error) {
            console.error('Error al registrar paciente:', error);
            loadingModal.remove();
            
            // Mostrar modal de error
            mostrarModalError(error.message || 'Error desconocido al registrar el paciente');
        }
    });
}

// Modal de loading
function mostrarModalLoading(mensaje) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-8 shadow-2xl">
            <div class="flex items-center space-x-4">
                <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                <span class="text-xl font-semibold text-gray-700">${mensaje}</span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// Modal de éxito CON PREDICCIÓN
function mostrarModalExitoConPrediccion(paciente, imc, nivelRiesgo, probabilidad, prediccionCompleta) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    
    // Determinar color según riesgo
    const coloresRiesgo = {
        'alto': { bg: 'from-red-500 to-red-600', text: 'text-red-700', badge: 'bg-red-100 text-red-800', icon: 'fa-exclamation-triangle' },
        'medio': { bg: 'from-orange-500 to-orange-600', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800', icon: 'fa-exclamation-circle' },
        'bajo': { bg: 'from-green-500 to-green-600', text: 'text-green-700', badge: 'bg-green-100 text-green-800', icon: 'fa-check-circle' },
        'sin evaluar': { bg: 'from-gray-500 to-gray-600', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800', icon: 'fa-question-circle' }
    };
    
    const color = coloresRiesgo[nivelRiesgo] || coloresRiesgo['sin evaluar'];
    const probabilidadPorcentaje = (probabilidad * 100).toFixed(1);
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style="animation: scaleIn 0.3s ease-out">
            <!-- Header -->
            <div class="bg-gradient-to-r ${color.bg} text-white p-6 rounded-t-2xl">
                <div class="flex items-center justify-center mb-3">
                    <div class="bg-white/20 rounded-full p-4 mr-3">
                        <i class="fas fa-check-circle text-4xl"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold">¡Paciente Registrado!</h3>
                        <p class="text-white/90">Registro y diagnóstico completados</p>
                    </div>
                </div>
            </div>
            
            <!-- Body -->
            <div class="p-6 space-y-4">
                <!-- Datos del Paciente -->
                <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <h4 class="font-bold text-gray-900 mb-2 flex items-center">
                        <i class="fas fa-user mr-2 text-blue-600"></i>
                        Datos del Paciente
                    </h4>
                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <div><strong>Nombre:</strong> ${paciente.nombre} ${paciente.apellido}</div>
                        <div><strong>Documento:</strong> ${paciente.documento_identidad}</div>
                        <div><strong>Fecha Nac.:</strong> ${new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES')}</div>
                        <div><strong>Sexo:</strong> ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</div>
                        <div><strong>IMC:</strong> ${imc}</div>
                    </div>
                </div>
                
                <!-- DIAGNÓSTICO DE RIESGO -->
                <div class="bg-gradient-to-r ${color.bg} p-6 rounded-xl text-white">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-bold flex items-center">
                            <i class="fas ${color.icon} mr-2"></i>
                            Diagnóstico Automático
                        </h4>
                        <span class="px-4 py-2 bg-white/20 rounded-full text-lg font-bold">
                            ${probabilidadPorcentaje}%
                        </span>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-white/80 mb-2">Nivel de Riesgo Detectado:</p>
                        <p class="text-3xl font-bold uppercase">${nivelRiesgo}</p>
                    </div>
                </div>
                
                ${prediccionCompleta && prediccionCompleta.factores_riesgo && prediccionCompleta.factores_riesgo.length > 0 ? `
                    <!-- Factores de Riesgo -->
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <h4 class="font-bold text-gray-900 mb-2 flex items-center">
                            <i class="fas fa-list-ul mr-2 text-yellow-600"></i>
                            Factores Identificados
                        </h4>
                        <ul class="space-y-1 text-sm text-gray-700">
                            ${prediccionCompleta.factores_riesgo.map(factor => `
                                <li class="flex items-start">
                                    <i class="fas fa-circle text-yellow-500 text-xs mt-1 mr-2"></i>
                                    <span>${factor}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${prediccionCompleta && prediccionCompleta.recomendaciones && prediccionCompleta.recomendaciones.length > 0 ? `
                    <!-- Recomendaciones -->
                    <div class="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                        <h4 class="font-bold text-gray-900 mb-2 flex items-center">
                            <i class="fas fa-clipboard-check mr-2 text-green-600"></i>
                            Recomendaciones
                        </h4>
                        <ul class="space-y-1 text-sm text-gray-700">
                            ${prediccionCompleta.recomendaciones.slice(0, 4).map(rec => `
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 text-xs mt-1 mr-2"></i>
                                    <span>${rec}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p class="text-sm ${color.text}">
                        <i class="fas fa-info-circle mr-2"></i>
                        <strong>Nota:</strong> El diagnóstico se realizó automáticamente usando el modelo de predicción SQL. 
                        El paciente está disponible en "Gestionar Pacientes".
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="flex space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                <button 
                    onclick="this.closest('.fixed').remove()" 
                    class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                    <i class="fas fa-plus mr-2"></i>Registrar Otro
                </button>
                <button 
                    onclick="this.closest('.fixed').remove(); showView('pacientes');" 
                    class="flex-1 px-6 py-3 bg-gradient-to-r ${color.bg} text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                    <i class="fas fa-users mr-2"></i>Ver Pacientes
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Modal de éxito (versión original sin predicción - mantener por compatibilidad)
function mostrarModalExito(paciente, imc) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full" style="animation: scaleIn 0.3s ease-out">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-t-2xl">
                <div class="flex items-center justify-center">
                    <div class="bg-white/20 rounded-full p-4 mr-3">
                        <i class="fas fa-check-circle text-4xl"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold">¡Paciente Registrado!</h3>
                        <p class="text-green-100">El registro se completó exitosamente</p>
                    </div>
                </div>
            </div>
            
            <!-- Body -->
            <div class="p-6">
                <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-4">
                    <h4 class="font-bold text-gray-900 mb-2">Datos del Paciente:</h4>
                    <ul class="space-y-1 text-gray-700">
                        <li><strong>Nombre:</strong> ${paciente.nombre} ${paciente.apellido}</li>
                        <li><strong>Documento:</strong> ${paciente.documento_identidad}</li>
                        <li><strong>Fecha Nacimiento:</strong> ${new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES')}</li>
                        <li><strong>Sexo:</strong> ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</li>
                        <li><strong>IMC Calculado:</strong> ${imc}</li>
                    </ul>
                </div>
                
                <div class="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                    <p class="text-sm text-green-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        El paciente ha sido registrado y está disponible en el sistema.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="flex space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                <button 
                    onclick="this.closest('.fixed').remove()" 
                    class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                    <i class="fas fa-plus mr-2"></i>Registrar Otro
                </button>
                <button 
                    onclick="this.closest('.fixed').remove(); document.querySelector('[href=\\\'#pacientes\\\']').click();" 
                    class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                    <i class="fas fa-users mr-2"></i>Ver Pacientes
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Modal de error
function mostrarModalError(mensaje) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full" style="animation: scaleIn 0.3s ease-out">
            <!-- Header -->
            <div class="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                <div class="flex items-center justify-center">
                    <div class="bg-white/20 rounded-full p-4 mr-3">
                        <i class="fas fa-times-circle text-4xl"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold">Error al Registrar</h3>
                        <p class="text-red-100">No se pudo completar el registro</p>
                    </div>
                </div>
            </div>
            
            <!-- Body -->
            <div class="p-6">
                <div class="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-4">
                    <h4 class="font-bold text-gray-900 mb-2">Detalles del Error:</h4>
                    <p class="text-gray-700">${mensaje}</p>
                </div>
                
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-lightbulb mr-2"></i>
                        <strong>Sugerencias:</strong><br>
                        • Verifica que todos los campos requeridos estén completos<br>
                        • El documento de identidad debe ser único<br>
                        • Verifica los permisos de Supabase
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="p-6 bg-gray-50 rounded-b-2xl">
                <button 
                    onclick="this.closest('.fixed').remove()" 
                    class="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                    <i class="fas fa-redo mr-2"></i>Reintentar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ==========================================
// GESTIONAR PACIENTES - Funcionalidades
// ==========================================

// Variables globales
let pacientesData = [];
let filtrosActivos = {};

// Cargar pacientes desde Supabase
async function cargarPacientes(filtros = {}) {
    const tbody = document.getElementById('tabla-pacientes');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Cargando pacientes...</td></tr>';
    
    try {
        // Construir query con filtros
        let query = supabase
            .from('ninos')
            .select(`
                id,
                nombre,
                apellido,
                fecha_nacimiento,
                sexo,
                mediciones_antropometricas(
                    peso,
                    talla,
                    imc,
                    fecha_medicion
                ),
                datos_sociodemograficos(
                    zona_residencia
                ),
                predicciones(
                    nivel_riesgo,
                    fecha_prediccion
                )
            `)
            .order('fecha_registro', { ascending: false });
        
        // Aplicar filtro de nombre
        if (filtros.nombre) {
            query = query.or(`nombre.ilike.%${filtros.nombre}%,apellido.ilike.%${filtros.nombre}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">No se encontraron pacientes</td></tr>';
            return;
        }
        
        // Procesar datos
        pacientesData = data.map(paciente => {
            // Obtener la medición más reciente (ordenar por fecha)
            let ultimaMedicion = {};
            if (Array.isArray(paciente.mediciones_antropometricas) && paciente.mediciones_antropometricas.length > 0) {
                const medicionesOrdenadas = paciente.mediciones_antropometricas.sort((a, b) => {
                    return new Date(b.fecha_medicion) - new Date(a.fecha_medicion);
                });
                ultimaMedicion = medicionesOrdenadas[0];
            }
            
            const datosSocio = Array.isArray(paciente.datos_sociodemograficos) && paciente.datos_sociodemograficos.length > 0 
                ? paciente.datos_sociodemograficos[0] 
                : {};
            
            // Obtener la predicción más reciente (ordenar por fecha)
            let ultimaPrediccion = {};
            if (Array.isArray(paciente.predicciones) && paciente.predicciones.length > 0) {
                const prediccionesOrdenadas = paciente.predicciones.sort((a, b) => {
                    return new Date(b.fecha_prediccion) - new Date(a.fecha_prediccion);
                });
                ultimaPrediccion = prediccionesOrdenadas[0];
            }
            
            // Calcular edad en meses
            const fechaNac = new Date(paciente.fecha_nacimiento);
            const hoy = new Date();
            const edadMeses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
            
            return {
                id: paciente.id,
                nombre: `${paciente.nombre} ${paciente.apellido}`,
                edadMeses: edadMeses,
                peso: ultimaMedicion.peso || 'N/A',
                talla: ultimaMedicion.talla || 'N/A',
                zona: datosSocio.zona_residencia || 'N/A',
                riesgo: ultimaPrediccion.nivel_riesgo || 'sin evaluar',
                sexo: paciente.sexo
            };
        });
        
        // Aplicar filtros adicionales
        let pacientesFiltrados = [...pacientesData];
        
        if (filtros.zona && filtros.zona !== '') {
            pacientesFiltrados = pacientesFiltrados.filter(p => 
                p.zona.toLowerCase() === filtros.zona.toLowerCase()
            );
        }
        
        if (filtros.riesgo && filtros.riesgo !== '') {
            pacientesFiltrados = pacientesFiltrados.filter(p => 
                p.riesgo.toLowerCase() === filtros.riesgo.toLowerCase()
            );
        }
        
        // Renderizar tabla
        if (pacientesFiltrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">No hay pacientes que coincidan con los filtros</td></tr>';
            return;
        }
        
        tbody.innerHTML = pacientesFiltrados.map(p => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                            ${p.nombre.charAt(0)}
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${p.nombre}</div>
                            <div class="text-sm text-gray-500">${p.sexo === 'M' ? 'Masculino' : 'Femenino'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.edadMeses} meses</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.peso} kg</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.talla} cm</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.zona.toLowerCase() === 'urbana' ? 'bg-blue-100 text-blue-800' : 
                        p.zona.toLowerCase() === 'rural' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                    }">
                        ${p.zona}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${getRiesgoBadge(p.riesgo.toLowerCase())}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="verDetallePaciente(${p.id})" class="text-blue-600 hover:text-blue-900 mr-3" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editarPaciente(${p.id})" class="text-green-600 hover:text-green-900 mr-3" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmarEliminar(${p.id}, '${p.nombre}')" class="text-red-600 hover:text-red-900" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-8 text-center text-red-500"><i class="fas fa-exclamation-triangle mr-2"></i>Error: ${error.message}</td></tr>`;
    }
}

// Setup de filtros
function setupFiltros() {
    const btnFiltrar = document.getElementById('btn-filtrar');
    const filtroNombre = document.getElementById('filtro-nombre');
    const filtroZona = document.getElementById('filtro-zona');
    const filtroRiesgo = document.getElementById('filtro-riesgo');
    
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            filtrosActivos = {
                nombre: filtroNombre?.value || '',
                zona: filtroZona?.value || '',
                riesgo: filtroRiesgo?.value || ''
            };
            cargarPacientes(filtrosActivos);
        });
    }
    
    // Filtrar al presionar Enter
    if (filtroNombre) {
        filtroNombre.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btnFiltrar?.click();
            }
        });
    }
}

// Ver detalle de paciente (Modal)
async function verDetallePaciente(id) {
    try {
        const { data, error } = await supabase
            .from('ninos')
            .select(`
                *,
                mediciones_antropometricas(*),
                historia_clinica(*),
                datos_sociodemograficos(*),
                predicciones(*)
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        mostrarModalDetalle(data);
        
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        alert('Error al cargar los detalles del paciente');
    }
}

// Editar paciente
async function editarPaciente(id) {
    try {
        const { data, error} = await supabase
            .from('ninos')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        mostrarModalEdicion(data);
        
    } catch (error) {
        console.error('Error al cargar paciente:', error);
        alert('Error al cargar los datos del paciente');
    }
}

// Confirmar eliminación con modal bonito
function confirmarEliminar(id, nombre) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.animation = 'fadeIn 0.2s ease-out';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full" style="animation: scaleIn 0.3s ease-out">
            <!-- Header -->
            <div class="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                <div class="flex items-center justify-center">
                    <div class="bg-white/20 rounded-full p-3 mr-3">
                        <i class="fas fa-exclamation-triangle text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold">Confirmar Eliminación</h3>
                </div>
            </div>
            
            <!-- Body -->
            <div class="p-6">
                <p class="text-gray-700 text-lg mb-2">
                    ¿Estás seguro de que deseas eliminar al paciente:
                </p>
                <p class="text-xl font-bold text-gray-900 mb-4">
                    ${nombre}
                </p>
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-circle text-yellow-600 mt-1 mr-3"></i>
                        <p class="text-sm text-yellow-800">
                            <strong>Advertencia:</strong> Esta acción eliminará permanentemente todos los datos asociados (mediciones, historia clínica, predicciones). No se puede deshacer.
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="flex space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                <button 
                    onclick="this.closest('.fixed').remove()" 
                    class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                    <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button 
                    id="btn-confirmar-eliminar" 
                    class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <i class="fas fa-trash-alt mr-2"></i>Eliminar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Evento para confirmar eliminación
    document.getElementById('btn-confirmar-eliminar').addEventListener('click', () => {
        modal.remove();
        eliminarPaciente(id, nombre);
    });
    
    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Eliminar paciente
async function eliminarPaciente(id, nombre) {
    // Mostrar loading
    const loadingModal = document.createElement('div');
    loadingModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingModal.innerHTML = `
        <div class="bg-white rounded-xl p-6 shadow-2xl">
            <div class="flex items-center space-x-3">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span class="text-lg font-semibold text-gray-700">Eliminando paciente...</span>
            </div>
        </div>
    `;
    document.body.appendChild(loadingModal);
    
    try {
        const { error } = await supabase
            .from('ninos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        // Remover loading
        loadingModal.remove();
        
        // Mostrar éxito
        mostrarNotificacion('success', `Paciente "${nombre}" eliminado exitosamente`, 3000);
        
        // Recargar tabla
        cargarPacientes(filtrosActivos);
        
    } catch (error) {
        console.error('Error al eliminar:', error);
        loadingModal.remove();
        
        // Mostrar error
        mostrarNotificacion('error', 'Error al eliminar el paciente: ' + (error.message || 'Error desconocido'), 5000);
    }
}

// Función auxiliar para mostrar notificaciones
function mostrarNotificacion(tipo, mensaje, duracion = 3000) {
    const notif = document.createElement('div');
    notif.className = 'fixed top-4 right-4 z-50 max-w-md';
    notif.style.animation = 'slideInRight 0.3s ease-out';
    
    const colores = {
        success: 'from-green-500 to-green-600',
        error: 'from-red-500 to-red-600',
        info: 'from-blue-500 to-blue-600'
    };
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    
    notif.innerHTML = `
        <div class="bg-gradient-to-r ${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-2xl">
            <div class="flex items-center">
                <i class="fas ${iconos[tipo]} text-2xl mr-3"></i>
                <span class="font-semibold">${mensaje}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notif);
    
    // Auto-remover
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, duracion);
}

// Mostrar modal de detalle
function mostrarModalDetalle(paciente) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in';
    
    // Ordenar mediciones y predicciones por fecha (más reciente primero)
    const mediciones = Array.isArray(paciente.mediciones_antropometricas) 
        ? paciente.mediciones_antropometricas.sort((a, b) => new Date(b.fecha_medicion) - new Date(a.fecha_medicion))
        : [];
    const ultimaMedicion = mediciones.length > 0 ? mediciones[0] : null;
    
    const predicciones = Array.isArray(paciente.predicciones)
        ? paciente.predicciones.sort((a, b) => new Date(b.fecha_prediccion) - new Date(a.fecha_prediccion))
        : [];
    const ultimaPrediccion = predicciones.length > 0 ? predicciones[0] : null;
    
    // Calcular edad en meses
    const fechaNac = new Date(paciente.fecha_nacimiento);
    const hoy = new Date();
    const edadMeses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
    
    // Función auxiliar para badge de riesgo
    const getRiesgoBadgeHTML = (nivel) => {
        const colores = {
            'alto': 'bg-red-100 text-red-800 border-red-300',
            'medio': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'bajo': 'bg-green-100 text-green-800 border-green-300'
        };
        const iconos = {
            'alto': 'fa-exclamation-triangle',
            'medio': 'fa-exclamation-circle',
            'bajo': 'fa-check-circle'
        };
        return `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${colores[nivel] || 'bg-gray-100 text-gray-800 border-gray-300'}">
            <i class="fas ${iconos[nivel] || 'fa-question'} mr-2"></i>${nivel ? nivel.toUpperCase() : 'SIN EVALUAR'}
        </span>`;
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold">${paciente.nombre} ${paciente.apellido}</h3>
                        <p class="text-blue-100 mt-1">${edadMeses} meses • ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- Información Básica -->
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold text-gray-500 mb-1">Fecha de Nacimiento</h4>
                        <p class="text-lg text-gray-900">${new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold text-gray-500 mb-1">Documento</h4>
                        <p class="text-lg text-gray-900">${paciente.documento_identidad || 'No registrado'}</p>
                    </div>
                </div>
                
                <!-- Estado Nutricional Actual -->
                <div class="border-t pt-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-lg font-bold text-gray-900">Estado Nutricional Actual</h4>
                        ${ultimaPrediccion ? getRiesgoBadgeHTML(ultimaPrediccion.nivel_riesgo) : '<span class="text-gray-500 italic">Sin evaluación</span>'}
                    </div>
                    
                    ${ultimaMedicion ? `
                        <div class="grid md:grid-cols-4 gap-4 mb-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Peso</p>
                                <p class="text-2xl font-bold text-blue-600">${ultimaMedicion.peso} kg</p>
                                <p class="text-xs text-gray-500 mt-1">${new Date(ultimaMedicion.fecha_medicion).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Talla</p>
                                <p class="text-2xl font-bold text-green-600">${ultimaMedicion.talla} cm</p>
                                <p class="text-xs text-gray-500 mt-1">${new Date(ultimaMedicion.fecha_medicion).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">IMC</p>
                                <p class="text-2xl font-bold text-purple-600">${ultimaMedicion.imc || 'N/A'}</p>
                            </div>
                            <div class="bg-indigo-50 p-4 rounded-lg flex items-center justify-center">
                                <button 
                                    onclick="generarNuevaEvaluacion(${paciente.id})"
                                    class="w-full h-full flex flex-col items-center justify-center text-indigo-600 hover:text-indigo-800 transition-colors"
                                    title="Generar nueva evaluación"
                                >
                                    <i class="fas fa-stethoscope text-2xl mb-1"></i>
                                    <span class="text-xs font-semibold">Nueva<br>Evaluación</span>
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <p class="text-yellow-800">No hay mediciones registradas</p>
                        </div>
                    `}
                </div>
                
                <!-- Historial de Evaluaciones -->
                ${predicciones.length > 0 ? `
                    <div class="border-t pt-6">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">
                            <i class="fas fa-history mr-2 text-blue-600"></i>Historial de Evaluaciones (${predicciones.length})
                        </h4>
                        <div class="space-y-3 max-h-64 overflow-y-auto">
                            ${predicciones.map((pred, index) => `
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div class="flex items-center space-x-4">
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-gray-700">${index + 1}</div>
                                        </div>
                                        <div>
                                            <p class="text-sm font-semibold text-gray-900">
                                                ${new Date(pred.fecha_prediccion).toLocaleDateString('es-ES', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                            <p class="text-xs text-gray-500">${pred.modelo_usado || 'Modelo no especificado'}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        ${getRiesgoBadgeHTML(pred.nivel_riesgo)}
                                        ${pred.probabilidad ? `<p class="text-xs text-gray-500 mt-1">${(pred.probabilidad * 100).toFixed(1)}%</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Historial de Mediciones -->
                ${mediciones.length > 1 ? `
                    <div class="border-t pt-6">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">
                            <i class="fas fa-chart-line mr-2 text-green-600"></i>Historial de Mediciones (${mediciones.length})
                        </h4>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Talla</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IMC</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${mediciones.map(med => `
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-4 py-2 text-sm text-gray-900">${new Date(med.fecha_medicion).toLocaleDateString('es-ES')}</td>
                                            <td class="px-4 py-2 text-sm text-gray-900">${med.peso} kg</td>
                                            <td class="px-4 py-2 text-sm text-gray-900">${med.talla} cm</td>
                                            <td class="px-4 py-2 text-sm text-gray-900">${med.imc || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex justify-between pt-4 border-t">
                    <button 
                        onclick="agregarNuevaMedicion(${paciente.id}, '${paciente.nombre}', '${paciente.apellido}'); this.closest('.fixed').remove();" 
                        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <i class="fas fa-plus-circle mr-2"></i>Nueva Medición
                    </button>
                    <div class="space-x-3">
                        <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cerrar
                        </button>
                        <button onclick="editarPaciente(${paciente.id}); this.closest('.fixed').remove();" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-edit mr-2"></i>Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Mostrar modal de edición
function mostrarModalEdicion(paciente) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <h3 class="text-2xl font-bold">Editar Paciente</h3>
            </div>
            
            <form id="form-editar-paciente" class="p-6 space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input type="text" id="edit-nombre" value="${paciente.nombre}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                        <input type="text" id="edit-apellido" value="${paciente.apellido}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                        <input type="date" id="edit-fecha" value="${paciente.fecha_nacimiento}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                        <select id="edit-sexo" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600">
                            <option value="M" ${paciente.sexo === 'M' ? 'selected' : ''}>Masculino</option>
                            <option value="F" ${paciente.sexo === 'F' ? 'selected' : ''}>Femenino</option>
                        </select>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <i class="fas fa-save mr-2"></i>Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar submit
    document.getElementById('form-editar-paciente').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datosActualizados = {
            nombre: document.getElementById('edit-nombre').value,
            apellido: document.getElementById('edit-apellido').value,
            fecha_nacimiento: document.getElementById('edit-fecha').value,
            sexo: document.getElementById('edit-sexo').value
        };
        
        try {
            const { error } = await supabase
                .from('ninos')
                .update(datosActualizados)
                .eq('id', paciente.id);
            
            if (error) throw error;
            
            alert('Paciente actualizado exitosamente');
            modal.remove();
            cargarPacientes(filtrosActivos);
            
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('Error al actualizar el paciente');
        }
    });
}

// Generar nueva evaluación para un paciente existente
async function generarNuevaEvaluacion(ninoId) {
    try {
        // Mostrar modal de loading
        const loadingModal = mostrarModalLoading('Realizando evaluación nutricional...');
        
        // Obtener datos del paciente
        const { data: pacienteData, error: errorPaciente } = await supabase
            .from('ninos')
            .select(`
                *,
                mediciones_antropometricas(*),
                datos_sociodemograficos(*)
            `)
            .eq('id', ninoId)
            .single();
        
        if (errorPaciente) throw errorPaciente;
        
        // Verificar que tenga mediciones
        if (!pacienteData.mediciones_antropometricas || pacienteData.mediciones_antropometricas.length === 0) {
            loadingModal.remove();
            alert('Este paciente no tiene mediciones registradas. Por favor, registre mediciones primero.');
            return;
        }
        
        // Obtener la medición más reciente
        const mediciones = pacienteData.mediciones_antropometricas.sort((a, b) => 
            new Date(b.fecha_medicion) - new Date(a.fecha_medicion)
        );
        const ultimaMedicion = mediciones[0];
        
        // Obtener datos sociodemográficos
        const datosSocio = Array.isArray(pacienteData.datos_sociodemograficos) && pacienteData.datos_sociodemograficos.length > 0
            ? pacienteData.datos_sociodemograficos[0]
            : {};
        
        // Calcular edad en meses
        const fechaNac = new Date(pacienteData.fecha_nacimiento);
        const hoy = new Date();
        const edadMeses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
        
        // Llamar a la función SQL de predicción
        const { data: prediccionData, error: errorPrediccion } = await supabase
            .rpc('predecir_simple', {
                edad_meses: edadMeses,
                peso: ultimaMedicion.peso,
                talla: ultimaMedicion.talla,
                zona: datosSocio.zona_residencia || 'urbana',
                educacion_madre: datosSocio.nivel_educativo_madre || 'secundaria'
            });
        
        if (errorPrediccion) throw errorPrediccion;
        
        if (!prediccionData) {
            throw new Error('No se recibió respuesta de la predicción');
        }
        
        // Guardar predicción en la tabla
        const { error: errorInsertPred } = await supabase
            .from('predicciones')
            .insert([{
                nino_id: ninoId,
                nivel_riesgo: prediccionData.nivel_riesgo,
                probabilidad: prediccionData.probabilidad,
                modelo_usado: 'SQL_Prediccion_v1',
                features_json: {
                    edad_meses: edadMeses,
                    peso: ultimaMedicion.peso,
                    talla: ultimaMedicion.talla,
                    imc: ultimaMedicion.imc,
                    zona: datosSocio.zona_residencia || 'urbana',
                    educacion_madre: datosSocio.nivel_educativo_madre || 'secundaria',
                    factores_riesgo: prediccionData.factores_riesgo || [],
                    recomendaciones: prediccionData.recomendaciones || []
                }
            }]);
        
        if (errorInsertPred) throw errorInsertPred;
        
        // Cerrar loading
        loadingModal.remove();
        
        // Mostrar resultado
        mostrarResultadoEvaluacion(pacienteData, ultimaMedicion.imc, prediccionData);
        
        // Recargar lista de pacientes
        cargarPacientes(filtrosActivos);
        
    } catch (error) {
        console.error('Error al generar evaluación:', error);
        document.querySelector('.fixed')?.remove(); // Cerrar loading si existe
        alert('Error al generar la evaluación: ' + (error.message || 'Error desconocido'));
    }
}

// Mostrar resultado de evaluación (similar al modal de registro pero adaptado)
function mostrarResultadoEvaluacion(paciente, imc, prediccionData) {
    const nivelRiesgo = prediccionData.nivel_riesgo || 'sin evaluar';
    const probabilidad = prediccionData.probabilidad || 0;
    const factores = prediccionData.factores_riesgo || [];
    const recomendaciones = prediccionData.recomendaciones || [];
    
    // Colores según nivel de riesgo
    const colores = {
        'alto': { from: 'red-500', to: 'red-600', text: 'red', icon: 'exclamation-triangle' },
        'medio': { from: 'yellow-500', to: 'yellow-600', text: 'yellow', icon: 'exclamation-circle' },
        'bajo': { from: 'green-500', to: 'green-600', text: 'green', icon: 'check-circle' }
    };
    const color = colores[nivelRiesgo] || colores['bajo'];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style="animation: slideUp 0.4s ease-out">
            <!-- Header con color según riesgo -->
            <div class="bg-gradient-to-r from-${color.from} to-${color.to} text-white p-8 rounded-t-2xl text-center">
                <div class="mb-4">
                    <div class="inline-block bg-white/20 rounded-full p-4">
                        <i class="fas fa-${color.icon} text-5xl"></i>
                    </div>
                </div>
                <h2 class="text-3xl font-bold mb-2">Evaluación Completada</h2>
                <p class="text-${color.text}-100 text-lg">${paciente.nombre} ${paciente.apellido}</p>
            </div>
            
            <!-- Contenido -->
            <div class="p-8 space-y-6">
                <!-- Diagnóstico Principal -->
                <div class="text-center pb-6 border-b">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Diagnóstico Nutricional</h3>
                    <div class="inline-flex items-center px-6 py-3 bg-${color.text}-100 text-${color.text}-800 rounded-full text-xl font-bold border-2 border-${color.text}-300">
                        <i class="fas fa-${color.icon} mr-3"></i>
                        Riesgo ${nivelRiesgo.toUpperCase()}
                    </div>
                    ${probabilidad > 0 ? `
                        <p class="text-gray-600 mt-3">
                            Probabilidad: <span class="font-bold text-${color.text}-600">${(probabilidad * 100).toFixed(1)}%</span>
                        </p>
                    ` : ''}
                </div>
                
                <!-- IMC -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700 font-semibold">Índice de Masa Corporal (IMC)</span>
                        <span class="text-2xl font-bold text-blue-600">${imc}</span>
                    </div>
                </div>
                
                <!-- Factores de Riesgo -->
                ${factores.length > 0 ? `
                    <div>
                        <h4 class="font-bold text-gray-900 mb-3 flex items-center">
                            <i class="fas fa-clipboard-list mr-2 text-${color.text}-600"></i>
                            Factores Identificados
                        </h4>
                        <ul class="space-y-2">
                            ${factores.map(factor => `
                                <li class="flex items-start">
                                    <i class="fas fa-chevron-right text-${color.text}-500 mr-2 mt-1"></i>
                                    <span class="text-gray-700">${factor}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Recomendaciones -->
                ${recomendaciones.length > 0 ? `
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-bold text-blue-900 mb-3 flex items-center">
                            <i class="fas fa-lightbulb mr-2"></i>
                            Recomendaciones
                        </h4>
                        <ul class="space-y-2">
                            ${recomendaciones.map(rec => `
                                <li class="flex items-start">
                                    <i class="fas fa-check text-blue-600 mr-2 mt-1"></i>
                                    <span class="text-blue-900">${rec}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Botón Cerrar -->
                <div class="flex justify-center pt-4">
                    <button 
                        onclick="this.closest('.fixed').remove()" 
                        class="px-8 py-3 bg-gradient-to-r from-${color.from} to-${color.to} text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        <i class="fas fa-check mr-2"></i>Aceptar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Agregar nueva medición a un paciente existente
function agregarNuevaMedicion(ninoId, nombre, apellido) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
                <h3 class="text-2xl font-bold flex items-center">
                    <i class="fas fa-ruler-combined mr-3"></i>
                    Nueva Medición Antropométrica
                </h3>
                <p class="text-green-100 mt-1">Paciente: ${nombre} ${apellido}</p>
            </div>
            
            <!-- Formulario -->
            <form id="form-nueva-medicion" class="p-6 space-y-6">
                <!-- Fecha de medición -->
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <label class="block text-sm font-semibold text-blue-900 mb-2">
                        <i class="fas fa-calendar mr-2"></i>Fecha de Medición
                    </label>
                    <input 
                        type="date" 
                        id="fecha-medicion" 
                        value="${new Date().toISOString().split('T')[0]}"
                        max="${new Date().toISOString().split('T')[0]}"
                        required 
                        class="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                </div>
                
                <!-- Mediciones principales -->
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <i class="fas fa-weight mr-2 text-blue-600"></i>Peso (kg) *
                        </label>
                        <input 
                            type="number" 
                            id="med-peso" 
                            step="0.01" 
                            min="0.5" 
                            max="200"
                            placeholder="Ej: 15.5" 
                            required 
                            class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <i class="fas fa-arrows-alt-v mr-2 text-green-600"></i>Talla (cm) *
                        </label>
                        <input 
                            type="number" 
                            id="med-talla" 
                            step="0.1" 
                            min="30" 
                            max="250"
                            placeholder="Ej: 85.5" 
                            required 
                            class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        >
                    </div>
                </div>
                
                <!-- Mediciones opcionales -->
                <div class="border-t pt-4">
                    <h4 class="text-sm font-semibold text-gray-500 mb-3 uppercase">Mediciones Adicionales (Opcional)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Perímetro Braquial (cm)
                            </label>
                            <input 
                                type="number" 
                                id="med-perimetro" 
                                step="0.1" 
                                min="5" 
                                max="50"
                                placeholder="Ej: 13.5" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Peso al Nacer (gramos)
                            </label>
                            <input 
                                type="number" 
                                id="med-peso-nacer" 
                                min="500" 
                                max="10000"
                                placeholder="Ej: 3200" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                            >
                        </div>
                    </div>
                </div>
                
                <!-- Checkbox para generar evaluación automática -->
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
                    <label class="flex items-start cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="generar-evaluacion-auto" 
                            checked
                            class="mt-1 h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                        >
                        <div class="ml-3">
                            <span class="text-sm font-semibold text-purple-900">
                                <i class="fas fa-stethoscope mr-2"></i>Generar evaluación nutricional automática
                            </span>
                            <p class="text-xs text-purple-700 mt-1">
                                Se ejecutará el diagnóstico automático después de guardar la medición
                            </p>
                        </div>
                    </label>
                </div>
                
                <!-- Botones -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <button 
                        type="button" 
                        onclick="this.closest('.fixed').remove()" 
                        class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                        <i class="fas fa-times mr-2"></i>Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        <i class="fas fa-save mr-2"></i>Guardar Medición
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar submit del formulario
    document.getElementById('form-nueva-medicion').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const peso = parseFloat(document.getElementById('med-peso').value);
        const talla = parseFloat(document.getElementById('med-talla').value);
        const fechaMedicion = document.getElementById('fecha-medicion').value;
        const perimetro = document.getElementById('med-perimetro').value;
        const pesoNacer = document.getElementById('med-peso-nacer').value;
        const generarEvaluacion = document.getElementById('generar-evaluacion-auto').checked;
        
        // Calcular IMC
        const imc = (peso / Math.pow(talla / 100, 2)).toFixed(2);
        
        try {
            // Mostrar loading
            const loadingModal = mostrarModalLoading('Guardando medición...');
            
            // Insertar medición
            const { error: errorMedicion } = await supabase
                .from('mediciones_antropometricas')
                .insert([{
                    nino_id: ninoId,
                    fecha_medicion: fechaMedicion,
                    peso: peso,
                    talla: talla,
                    perimetro_braquial: perimetro ? parseFloat(perimetro) : null,
                    peso_al_nacer: pesoNacer ? parseInt(pesoNacer) : null,
                    imc: parseFloat(imc)
                }]);
            
            if (errorMedicion) throw errorMedicion;
            
            // Cerrar modal de formulario
            modal.remove();
            
            // Si se marcó generar evaluación automática
            if (generarEvaluacion) {
                loadingModal.querySelector('span').textContent = 'Generando evaluación nutricional...';
                
                // Obtener datos necesarios para la predicción
                const { data: pacienteData, error: errorPaciente } = await supabase
                    .from('ninos')
                    .select(`
                        *,
                        datos_sociodemograficos(*)
                    `)
                    .eq('id', ninoId)
                    .single();
                
                if (errorPaciente) throw errorPaciente;
                
                const datosSocio = Array.isArray(pacienteData.datos_sociodemograficos) && pacienteData.datos_sociodemograficos.length > 0
                    ? pacienteData.datos_sociodemograficos[0]
                    : {};
                
                // Calcular edad en meses
                const fechaNac = new Date(pacienteData.fecha_nacimiento);
                const hoy = new Date();
                const edadMeses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
                
                // Llamar a la función de predicción
                const { data: prediccionData, error: errorPrediccion } = await supabase
                    .rpc('predecir_simple', {
                        edad_meses: edadMeses,
                        peso: peso,
                        talla: talla,
                        zona: datosSocio.zona_residencia || 'urbana',
                        educacion_madre: datosSocio.nivel_educativo_madre || 'secundaria'
                    });
                
                if (!errorPrediccion && prediccionData) {
                    // Guardar predicción
                    await supabase
                        .from('predicciones')
                        .insert([{
                            nino_id: ninoId,
                            nivel_riesgo: prediccionData.nivel_riesgo,
                            probabilidad: prediccionData.probabilidad,
                            modelo_usado: 'SQL_Prediccion_v1',
                            features_json: {
                                edad_meses: edadMeses,
                                peso: peso,
                                talla: talla,
                                imc: parseFloat(imc),
                                zona: datosSocio.zona_residencia || 'urbana',
                                educacion_madre: datosSocio.nivel_educativo_madre || 'secundaria',
                                factores_riesgo: prediccionData.factores_riesgo || [],
                                recomendaciones: prediccionData.recomendaciones || []
                            }
                        }]);
                    
                    loadingModal.remove();
                    
                    // Mostrar resultado de la evaluación
                    mostrarResultadoEvaluacion(pacienteData, imc, prediccionData);
                } else {
                    loadingModal.remove();
                    alert('Medición guardada correctamente, pero hubo un error al generar la evaluación.');
                }
            } else {
                loadingModal.remove();
                
                // Mostrar mensaje de éxito simple
                const exitoModal = document.createElement('div');
                exitoModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                exitoModal.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
                        <div class="mb-4">
                            <i class="fas fa-check-circle text-6xl text-green-600"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Medición Guardada!</h3>
                        <p class="text-gray-600 mb-6">La nueva medición se ha registrado correctamente</p>
                        <button 
                            onclick="this.closest('.fixed').remove()" 
                            class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                        >
                            Aceptar
                        </button>
                    </div>
                `;
                document.body.appendChild(exitoModal);
            }
            
            // Recargar lista de pacientes
            cargarPacientes(filtrosActivos);
            
        } catch (error) {
            console.error('Error al guardar medición:', error);
            document.querySelector('.fixed')?.remove();
            alert('Error al guardar la medición: ' + (error.message || 'Error desconocido'));
        }
    });
}

// Exportar funciones al scope global
window.verDetallePaciente = verDetallePaciente;
window.editarPaciente = editarPaciente;
window.confirmarEliminar = confirmarEliminar;
window.generarNuevaEvaluacion = generarNuevaEvaluacion;
window.agregarNuevaMedicion = agregarNuevaMedicion;

// ==========================================
// BUSCADOR DE PACIENTES PARA AGREGAR MEDICIÓN
// ==========================================
let timeoutBusqueda;

function setupBuscadorPacientes() {
    const inputBuscar = document.getElementById('buscar-paciente-medicion');
    const resultadosDiv = document.getElementById('resultados-busqueda');
    
    if (!inputBuscar || !resultadosDiv) {
        console.error('No se encontraron elementos del buscador');
        return;
    }
    
    console.log('Inicializando buscador de pacientes...'); // DEBUG
    
    // Limpiar resultados previos
    resultadosDiv.innerHTML = `
        <div class="text-center py-8 text-gray-500">
            <i class="fas fa-search text-4xl mb-3"></i>
            <p>Escribe al menos 2 caracteres para buscar</p>
        </div>
    `;
    
    // Remover event listeners anteriores clonando el elemento
    const nuevoInput = inputBuscar.cloneNode(true);
    inputBuscar.parentNode.replaceChild(nuevoInput, inputBuscar);
    
    // Agregar nuevo event listener
    nuevoInput.addEventListener('input', async (e) => {
        const termino = e.target.value.trim();
        
        console.log('Buscando:', termino); // DEBUG
        
        // Limpiar timeout anterior
        clearTimeout(timeoutBusqueda);
        
        // Si el término es muy corto, limpiar resultados
        if (termino.length < 2) {
            resultadosDiv.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-search text-4xl mb-3"></i>
                    <p>Escribe al menos 2 caracteres para buscar</p>
                </div>
            `;
            return;
        }
        
        // Mostrar loading
        resultadosDiv.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Buscando pacientes...</p>
            </div>
        `;
        
        // Esperar 500ms antes de buscar (debounce)
        timeoutBusqueda = setTimeout(async () => {
            try {
                console.log('Ejecutando query con término:', termino); // DEBUG
                
                const { data, error } = await supabase
                    .from('ninos')
                    .select(`
                        id,
                        nombre,
                        apellido,
                        fecha_nacimiento,
                        sexo,
                        documento_identidad,
                        mediciones_antropometricas(fecha_medicion, peso, talla)
                    `)
                    .or(`nombre.ilike.%${termino}%,apellido.ilike.%${termino}%,documento_identidad.ilike.%${termino}%`)
                    .order('nombre', { ascending: true })
                    .limit(10);
                
                console.log('Resultados:', data, 'Error:', error); // DEBUG
                
                if (error) throw error;
                if (!data || data.length === 0) {
                    resultadosDiv.innerHTML = `
                        <div class="text-center py-8 bg-gray-50 rounded-lg">
                            <i class="fas fa-search text-4xl text-gray-400 mb-3"></i>
                            <p class="text-gray-600">No se encontraron pacientes con "<strong>${termino}</strong>"</p>
                        </div>
                    `;
                    return;
                }
                
                // Mostrar resultados
                resultadosDiv.innerHTML = `
                    <div class="space-y-3">
                        <p class="text-sm font-semibold text-gray-700 mb-3">
                            <i class="fas fa-users mr-2"></i>${data.length} paciente${data.length > 1 ? 's' : ''} encontrado${data.length > 1 ? 's' : ''}
                        </p>
                        ${data.map(paciente => {
                            // Obtener última medición
                            const mediciones = Array.isArray(paciente.mediciones_antropometricas) 
                                ? paciente.mediciones_antropometricas.sort((a, b) => new Date(b.fecha_medicion) - new Date(a.fecha_medicion))
                                : [];
                            const ultimaMedicion = mediciones.length > 0 ? mediciones[0] : null;
                            
                            // Calcular edad
                            const fechaNac = new Date(paciente.fecha_nacimiento);
                            const hoy = new Date();
                            const edadMeses = Math.floor((hoy - fechaNac) / (1000 * 60 * 60 * 24 * 30.44));
                            
                            return `
                                <div class="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer"
                                     onclick="seleccionarPacienteParaMedicion(${paciente.id}, '${paciente.nombre}', '${paciente.apellido}')">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-4">
                                            <div class="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                ${paciente.nombre.charAt(0)}${paciente.apellido.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 class="text-lg font-bold text-gray-900">${paciente.nombre} ${paciente.apellido}</h3>
                                                <div class="flex items-center space-x-4 text-sm text-gray-600">
                                                    <span><i class="fas fa-birthday-cake mr-1"></i>${edadMeses} meses</span>
                                                    <span><i class="fas fa-${paciente.sexo === 'M' ? 'mars' : 'venus'} mr-1"></i>${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</span>
                                                    ${paciente.documento_identidad ? `<span><i class="fas fa-id-card mr-1"></i>${paciente.documento_identidad}</span>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            ${ultimaMedicion ? `
                                                <div class="text-sm text-gray-600 mb-1">Última medición:</div>
                                                <div class="text-xs text-gray-500">${new Date(ultimaMedicion.fecha_medicion).toLocaleDateString('es-ES')}</div>
                                                <div class="text-sm font-semibold text-emerald-600">${ultimaMedicion.peso}kg • ${ultimaMedicion.talla}cm</div>
                                            ` : `
                                                <div class="text-sm text-gray-500 italic">Sin mediciones</div>
                                            `}
                                        </div>
                                    </div>
                                    <div class="mt-3 flex justify-end">
                                        <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                                            <i class="fas fa-plus-circle mr-2"></i>Agregar Medición
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                
            } catch (error) {
                console.error('Error al buscar pacientes:', error);
                resultadosDiv.innerHTML = `
                    <div class="text-center py-8 bg-red-50 rounded-lg">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-3"></i>
                        <p class="text-red-600">Error al buscar pacientes: ${error.message}</p>
                    </div>
                `;
            }
        }, 500);
    });
}

// Seleccionar paciente y abrir modal de medición
function seleccionarPacienteParaMedicion(ninoId, nombre, apellido) {
    agregarNuevaMedicion(ninoId, nombre, apellido);
}

// Exportar nueva función
window.seleccionarPacienteParaMedicion = seleccionarPacienteParaMedicion;

// Inicializar
setupFiltros();
