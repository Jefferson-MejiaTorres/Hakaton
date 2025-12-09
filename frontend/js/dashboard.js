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
// Ver detalle desde dashboard - Redirección
// ==========================================
function verDetallePacienteDesdeOtraVista(ninoId) {
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
        setTimeout(() => {
            verDetallePaciente(ninoId);
        }, 500);
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
            cargarAnalisisAvanzado();
        } else if (viewName === 'exportar') {
            // Vista de exportar no requiere carga inicial
        } else if (viewName === 'reportes') {
            cargarReportes();
        } else if (viewName === 'alertas') {
            cargarAlertas();
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
            
            // Si es link externo o no tiene href, permitir navegación normal
            if (!href || !href.startsWith('#')) return;
            
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
                } else if (href === '#analytics') {
                    cargarAnalisisAvanzado();
                } else if (href === '#exportar') {
                    cargarExportarDatos();
                } else if (href === '#reportes') {
                    cargarReportes();
                } else if (href === '#alertas') {
                    cargarAlertas();
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

// ==========================================
// ANÁLISIS AVANZADO (Rol Investigación)
// ==========================================

let analyticsCharts = {};

// Función auxiliar: Calcular edad en meses
function calcularEdadMeses(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const diffTime = Math.abs(hoy - nacimiento);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
}

// Cargar Análisis Avanzado
async function cargarAnalisisAvanzado() {
    try {
        console.log('🔍 Cargando análisis avanzado...');

        // Configurar fechas por defecto (últimos 12 meses para tener más datos)
        const hoy = new Date();
        const hace12Meses = new Date();
        hace12Meses.setMonth(hace12Meses.getMonth() - 12);

        document.getElementById('fecha-inicio-analytics').value = hace12Meses.toISOString().split('T')[0];
        document.getElementById('fecha-fin-analytics').value = hoy.toISOString().split('T')[0];

        // Aplicar análisis inicial (sin filtros de fecha para obtener TODOS los datos)
        await aplicarFiltrosAnalytics(true);

    } catch (error) {
        console.error('Error al cargar análisis avanzado:', error);
    }
}

// Aplicar Filtros de Análisis
async function aplicarFiltrosAnalytics(cargarTodos = false) {
    try {
        console.log('📊 Aplicando filtros de análisis...');

        const fechaInicio = document.getElementById('fecha-inicio-analytics').value;
        const fechaFin = document.getElementById('fecha-fin-analytics').value;
        const zona = document.getElementById('zona-analytics').value;
        const nivelRiesgo = document.getElementById('riesgo-analytics').value;

        console.log('Filtros:', { fechaInicio, fechaFin, zona, nivelRiesgo, cargarTodos });

        // PRIMERO: Obtener TODOS los niños (sin filtros complejos)
        let query = supabase
            .from('ninos')
            .select('*')
            .order('fecha_registro', { ascending: false });

        // NO aplicar filtros de fecha en la carga inicial para ver si hay datos
        if (!cargarTodos && fechaInicio) {
            query = query.gte('fecha_registro', fechaInicio);
        }
        if (!cargarTodos && fechaFin) {
            query = query.lte('fecha_registro', fechaFin);
        }

        const { data: ninos, error: errorNinos } = await query;

        if (errorNinos) {
            console.error('Error obteniendo niños:', errorNinos);
            throw errorNinos;
        }

        console.log('✅ Niños obtenidos:', ninos?.length || 0);

        if (!ninos || ninos.length === 0) {
            console.warn('⚠️ No hay pacientes en la base de datos');
            // Mostrar datos vacíos
            const datosVacios = {
                totalPacientes: 0,
                porZona: { urbana: 0, rural: 0 },
                porRiesgo: { alto: 0, medio: 0, bajo: 0, sin_evaluar: 0 },
                porEdad: { '0-12': 0, '13-24': 0, '25-36': 0, '37-48': 0, '49-60': 0, '60+': 0 },
                porSexo: { M: 0, F: 0 },
                pesoTotal: 0,
                tallaTotal: 0,
                imcTotal: 0,
                contadorMediciones: 0,
                porMes: {},
                estadisticasZona: {
                    urbana: { total: 0, peso: 0, talla: 0, imc: 0, altoRiesgo: 0, contadorMediciones: 0 },
                    rural: { total: 0, peso: 0, talla: 0, imc: 0, altoRiesgo: 0, contadorMediciones: 0 }
                }
            };
            actualizarKPIsAnalytics(datosVacios);
            generarGraficasAnalytics(datosVacios);
            generarTablaEstadisticas(datosVacios);
            return;
        }

        // SEGUNDO: Obtener datos relacionados para cada niño
        const ninosIds = ninos.map(n => n.id);

        // Obtener mediciones
        const { data: mediciones } = await supabase
            .from('mediciones_antropometricas')
            .select('*')
            .in('nino_id', ninosIds)
            .order('fecha_medicion', { ascending: false });

        console.log('✅ Mediciones obtenidas:', mediciones?.length || 0);

        // Obtener datos sociodemográficos
        const { data: sociodem } = await supabase
            .from('datos_sociodemograficos')
            .select('*')
            .in('nino_id', ninosIds);

        console.log('✅ Datos sociodem obtenidos:', sociodem?.length || 0);

        // Obtener predicciones
        const { data: predicciones } = await supabase
            .from('predicciones')
            .select('*')
            .in('nino_id', ninosIds)
            .order('fecha_prediccion', { ascending: false });

        console.log('✅ Predicciones obtenidas:', predicciones?.length || 0);

        // TERCERO: Combinar los datos
        const pacientesCompletos = ninos.map(nino => {
            // Obtener la medición más reciente
            const medicionesNino = mediciones?.filter(m => m.nino_id === nino.id) || [];
            const medicionReciente = medicionesNino.length > 0 ? [medicionesNino[0]] : [];

            // Obtener datos sociodem
            const sociodemNino = sociodem?.filter(s => s.nino_id === nino.id) || [];

            // Obtener predicción más reciente
            const prediccionesNino = predicciones?.filter(p => p.nino_id === nino.id) || [];
            const prediccionReciente = prediccionesNino.length > 0 ? [prediccionesNino[0]] : [];

            return {
                ...nino,
                mediciones_antropometricas: medicionReciente,
                datos_sociodemograficos: sociodemNino,
                predicciones: prediccionReciente
            };
        });

        console.log('✅ Pacientes completos:', pacientesCompletos.length);
        console.log('Muestra de datos:', pacientesCompletos.slice(0, 2));

        // CUARTO: Filtrar por zona y riesgo (lado cliente)
        let pacientesFiltrados = pacientesCompletos;

        // Filtro por zona
        if (zona) {
            pacientesFiltrados = pacientesFiltrados.filter(p => {
                const zonaP = p.datos_sociodemograficos?.[0]?.zona_residencia?.toLowerCase();
                return zonaP === zona.toLowerCase();
            });
            console.log(`Después de filtro zona (${zona}):`, pacientesFiltrados.length);
        }

        // Filtro por riesgo
        if (nivelRiesgo) {
            pacientesFiltrados = pacientesFiltrados.filter(p => {
                const riesgoP = p.predicciones?.[0]?.nivel_riesgo?.toLowerCase();
                return riesgoP === nivelRiesgo.toLowerCase();
            });
            console.log(`Después de filtro riesgo (${nivelRiesgo}):`, pacientesFiltrados.length);
        }

        console.log('Total pacientes filtrados:', pacientesFiltrados.length);

        // Procesar datos para análisis
        const datosAnalisis = procesarDatosAnalytics(pacientesFiltrados);

        // Actualizar KPIs
        actualizarKPIsAnalytics(datosAnalisis);

        // Generar gráficas
        generarGraficasAnalytics(datosAnalisis);

        // Generar tabla de estadísticas
        generarTablaEstadisticas(datosAnalisis);

    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        alert('Error al cargar análisis: ' + error.message);
    }
}

// Procesar Datos para Análisis
function procesarDatosAnalytics(pacientes) {
    console.log('🔄 Procesando datos de', pacientes.length, 'pacientes');

    const datos = {
        totalPacientes: pacientes.length,
        porZona: { urbana: 0, rural: 0 },
        porRiesgo: { alto: 0, medio: 0, bajo: 0, sin_evaluar: 0 },
        porEdad: { '0-12': 0, '13-24': 0, '25-36': 0, '37-48': 0, '49-60': 0, '60+': 0 },
        porSexo: { M: 0, F: 0 },
        pesoTotal: 0,
        tallaTotal: 0,
        imcTotal: 0,
        contadorMediciones: 0,
        porMes: {},
        estadisticasZona: {
            urbana: { total: 0, peso: 0, talla: 0, imc: 0, altoRiesgo: 0, contadorMediciones: 0 },
            rural: { total: 0, peso: 0, talla: 0, imc: 0, altoRiesgo: 0, contadorMediciones: 0 }
        }
    };

    pacientes.forEach(paciente => {
        // Zona - usar 'urbana' si no hay datos
        const zonaBD = paciente.datos_sociodemograficos?.[0]?.zona_residencia;
        const zona = zonaBD ? zonaBD.toLowerCase() : 'urbana';
        
        // Asegurar que la zona existe en el objeto
        if (!datos.porZona[zona]) {
            datos.porZona[zona] = 0;
        }
        datos.porZona[zona]++;

        // Riesgo
        const riesgoBD = paciente.predicciones?.[0]?.nivel_riesgo;
        const riesgo = riesgoBD ? riesgoBD.toLowerCase() : 'sin_evaluar';
        datos.porRiesgo[riesgo] = (datos.porRiesgo[riesgo] || 0) + 1;

        // Edad
        try {
            const edadMeses = calcularEdadMeses(paciente.fecha_nacimiento);
            if (edadMeses <= 12) datos.porEdad['0-12']++;
            else if (edadMeses <= 24) datos.porEdad['13-24']++;
            else if (edadMeses <= 36) datos.porEdad['25-36']++;
            else if (edadMeses <= 48) datos.porEdad['37-48']++;
            else if (edadMeses <= 60) datos.porEdad['49-60']++;
            else datos.porEdad['60+']++;
        } catch (error) {
            console.warn('Error calculando edad para paciente:', paciente.id, error);
        }

        // Sexo
        if (paciente.sexo) {
            datos.porSexo[paciente.sexo] = (datos.porSexo[paciente.sexo] || 0) + 1;
        }

        // Mediciones - puede ser array o un solo objeto
        const mediciones = Array.isArray(paciente.mediciones_antropometricas) 
            ? paciente.mediciones_antropometricas 
            : (paciente.mediciones_antropometricas ? [paciente.mediciones_antropometricas] : []);

        if (mediciones.length > 0) {
            // Usar la medición más reciente
            const medicion = mediciones[0];
            
            if (medicion.peso) {
                datos.pesoTotal += parseFloat(medicion.peso);
                datos.contadorMediciones++;
            }
            if (medicion.talla) {
                datos.tallaTotal += parseFloat(medicion.talla);
            }
            if (medicion.imc) {
                datos.imcTotal += parseFloat(medicion.imc);
            }

            // Estadísticas por zona
            const zonaKey = (zona === 'urbana' || zona === 'rural') ? zona : 'urbana';
            if (datos.estadisticasZona[zonaKey]) {
                datos.estadisticasZona[zonaKey].total++;
                datos.estadisticasZona[zonaKey].contadorMediciones++;
                
                if (medicion.peso) {
                    datos.estadisticasZona[zonaKey].peso += parseFloat(medicion.peso);
                }
                if (medicion.talla) {
                    datos.estadisticasZona[zonaKey].talla += parseFloat(medicion.talla);
                }
                if (medicion.imc) {
                    datos.estadisticasZona[zonaKey].imc += parseFloat(medicion.imc);
                }
                
                if (riesgo === 'alto') {
                    datos.estadisticasZona[zonaKey].altoRiesgo++;
                }
            }
        }

        // Por mes
        try {
            const fecha = new Date(paciente.fecha_registro);
            const mes = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
            datos.porMes[mes] = (datos.porMes[mes] || 0) + 1;
        } catch (error) {
            console.warn('Error procesando fecha para paciente:', paciente.id, error);
        }
    });

    console.log('✅ Datos procesados:', {
        total: datos.totalPacientes,
        zonas: datos.porZona,
        riesgos: datos.porRiesgo,
        mediciones: datos.contadorMediciones
    });

    return datos;
}

// Actualizar KPIs
function actualizarKPIsAnalytics(datos) {
    document.getElementById('kpi-total-pacientes').textContent = datos.totalPacientes;
    
    const pesoProm = datos.contadorMediciones > 0 ? (datos.pesoTotal / datos.contadorMediciones).toFixed(1) : '0';
    document.getElementById('kpi-peso-promedio').innerHTML = `${pesoProm} <span class="text-lg">kg</span>`;
    
    const tallaProm = datos.contadorMediciones > 0 ? (datos.tallaTotal / datos.contadorMediciones).toFixed(1) : '0';
    document.getElementById('kpi-talla-promedio').innerHTML = `${tallaProm} <span class="text-lg">cm</span>`;
    
    const imcProm = datos.contadorMediciones > 0 ? (datos.imcTotal / datos.contadorMediciones).toFixed(1) : '0';
    document.getElementById('kpi-imc-promedio').textContent = imcProm;

    // Contadores de zona
    document.getElementById('zona-urbana-count').textContent = datos.porZona.urbana || 0;
    document.getElementById('zona-rural-count').textContent = datos.porZona.rural || 0;

    // Contadores de riesgo
    document.getElementById('riesgo-alto-count').textContent = datos.porRiesgo.alto || 0;
    document.getElementById('riesgo-medio-count').textContent = datos.porRiesgo.medio || 0;
    document.getElementById('riesgo-bajo-count').textContent = datos.porRiesgo.bajo || 0;

    // Contadores de sexo
    document.getElementById('sexo-femenino-count').textContent = datos.porSexo.F || 0;
    document.getElementById('sexo-masculino-count').textContent = datos.porSexo.M || 0;
}

// Generar Gráficas
function generarGraficasAnalytics(datos) {
    // Destruir gráficas existentes
    Object.values(analyticsCharts).forEach(chart => chart?.destroy());
    analyticsCharts = {};

    // 1. Gráfica de Zona
    const ctxZona = document.getElementById('chart-zona-analytics')?.getContext('2d');
    if (ctxZona) {
        analyticsCharts.zona = new Chart(ctxZona, {
            type: 'doughnut',
            data: {
                labels: ['Zona Urbana', 'Zona Rural'],
                datasets: [{
                    data: [datos.porZona.urbana || 0, datos.porZona.rural || 0],
                    backgroundColor: ['#3B82F6', '#10B981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, font: { size: 12, weight: 'bold' } } },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Gráfica de Riesgo
    const ctxRiesgo = document.getElementById('chart-riesgo-analytics')?.getContext('2d');
    if (ctxRiesgo) {
        analyticsCharts.riesgo = new Chart(ctxRiesgo, {
            type: 'pie',
            data: {
                labels: ['Alto Riesgo', 'Riesgo Medio', 'Bajo Riesgo', 'Sin Evaluar'],
                datasets: [{
                    data: [
                        datos.porRiesgo.alto || 0,
                        datos.porRiesgo.medio || 0,
                        datos.porRiesgo.bajo || 0,
                        datos.porRiesgo.sin_evaluar || 0
                    ],
                    backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#9CA3AF'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, font: { size: 12, weight: 'bold' } } },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. Gráfica de Edad
    const ctxEdad = document.getElementById('chart-edad-analytics')?.getContext('2d');
    if (ctxEdad) {
        analyticsCharts.edad = new Chart(ctxEdad, {
            type: 'bar',
            data: {
                labels: ['0-12 meses', '13-24 meses', '25-36 meses', '37-48 meses', '49-60 meses', '60+ meses'],
                datasets: [{
                    label: 'Número de Pacientes',
                    data: [
                        datos.porEdad['0-12'],
                        datos.porEdad['13-24'],
                        datos.porEdad['25-36'],
                        datos.porEdad['37-48'],
                        datos.porEdad['49-60'],
                        datos.porEdad['60+']
                    ],
                    backgroundColor: 'rgba(147, 51, 234, 0.8)',
                    borderColor: '#9333EA',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1F2937', titleFont: { size: 14 }, bodyFont: { size: 13 } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { size: 11 } },
                        grid: { color: '#E5E7EB' }
                    },
                    x: {
                        ticks: { font: { size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 4. Gráfica de Sexo
    const ctxSexo = document.getElementById('chart-sexo-analytics')?.getContext('2d');
    if (ctxSexo) {
        analyticsCharts.sexo = new Chart(ctxSexo, {
            type: 'doughnut',
            data: {
                labels: ['Femenino', 'Masculino'],
                datasets: [{
                    data: [datos.porSexo.F || 0, datos.porSexo.M || 0],
                    backgroundColor: ['#EC4899', '#3B82F6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, font: { size: 12, weight: 'bold' } } },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 5. Gráfica de Tendencia
    const ctxTendencia = document.getElementById('chart-tendencia-analytics')?.getContext('2d');
    if (ctxTendencia) {
        const meses = Object.keys(datos.porMes).sort();
        const valores = meses.map(mes => datos.porMes[mes]);

        analyticsCharts.tendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Registros por Mes',
                    data: valores,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: '#6366F1',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366F1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1F2937', titleFont: { size: 14 }, bodyFont: { size: 13 } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { size: 11 } },
                        grid: { color: '#E5E7EB' }
                    },
                    x: {
                        ticks: { font: { size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// Generar Tabla de Estadísticas
function generarTablaEstadisticas(datos) {
    const tbody = document.getElementById('tabla-stats-zona');
    if (!tbody) return;

    const zonas = ['urbana', 'rural'];
    const rows = zonas.map(zona => {
        const stats = datos.estadisticasZona[zona];
        
        // Usar contadorMediciones para promedios, no total
        const contadorMed = stats.contadorMediciones || 0;
        const pesoProm = contadorMed > 0 ? (stats.peso / contadorMed).toFixed(1) : '0.0';
        const tallaProm = contadorMed > 0 ? (stats.talla / contadorMed).toFixed(1) : '0.0';
        const imcProm = contadorMed > 0 ? (stats.imc / contadorMed).toFixed(1) : '0.0';
        const porcAltoRiesgo = stats.total > 0 ? ((stats.altoRiesgo / stats.total) * 100).toFixed(1) : '0.0';

        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900 capitalize">
                    <i class="fas fa-map-marker-alt mr-2 ${zona === 'urbana' ? 'text-blue-600' : 'text-emerald-600'}"></i>
                    ${zona}
                </td>
                <td class="px-6 py-4 text-center font-bold text-gray-900">${stats.total}</td>
                <td class="px-6 py-4 text-center text-blue-600 font-semibold">${pesoProm} kg</td>
                <td class="px-6 py-4 text-center text-emerald-600 font-semibold">${tallaProm} cm</td>
                <td class="px-6 py-4 text-center text-purple-600 font-semibold">${imcProm}</td>
                <td class="px-6 py-4 text-center">
                    <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                        ${stats.altoRiesgo}
                    </span>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="px-3 py-1 ${porcAltoRiesgo > 30 ? 'bg-red-100 text-red-700' : porcAltoRiesgo > 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} rounded-full text-sm font-bold">
                        ${porcAltoRiesgo}%
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

// Event Listeners para Analytics
document.addEventListener('DOMContentLoaded', () => {
    // Botón aplicar filtros
    const btnAplicar = document.getElementById('btn-aplicar-filtros-analytics');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', aplicarFiltrosAnalytics);
    }

    // Botón limpiar filtros
    const btnLimpiar = document.getElementById('btn-limpiar-filtros-analytics');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            document.getElementById('fecha-inicio-analytics').value = '';
            document.getElementById('fecha-fin-analytics').value = '';
            document.getElementById('zona-analytics').value = '';
            document.getElementById('riesgo-analytics').value = '';
            cargarAnalisisAvanzado();
        });
    }

    // Botón exportar tabla
    const btnExportar = document.getElementById('btn-exportar-tabla-analytics');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            alert('Función de exportación disponible en la sección "Exportar Datos"');
        });
    }
});

// Exportar funciones
window.cargarAnalisisAvanzado = cargarAnalisisAvanzado;
window.aplicarFiltrosAnalytics = aplicarFiltrosAnalytics;

// Inicializar
setupFiltros();

// ==========================================
// === MÓDULO DE EXPORTACIÓN DE DATOS ===
// ==========================================

// Variable global para almacenar datos filtrados
let datosParaExportar = [];

/**
 * Cargar vista de exportación
 */
async function cargarExportarDatos() {
    console.log('📤 Cargando módulo de exportación...');
    
    // Configurar fechas por defecto (últimos 12 meses)
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 12);
    
    document.getElementById('export-fecha-inicio').value = fechaInicio.toISOString().split('T')[0];
    document.getElementById('export-fecha-fin').value = fechaFin.toISOString().split('T')[0];
    
    // Cargar datos iniciales
    await aplicarFiltrosExport();
}

/**
 * Aplicar filtros y cargar datos para exportación
 */
async function aplicarFiltrosExport() {
    console.log('🔍 Aplicando filtros de exportación...');
    
    try {
        // Obtener valores de filtros
        const fechaInicio = document.getElementById('export-fecha-inicio').value;
        const fechaFin = document.getElementById('export-fecha-fin').value;
        const zona = document.getElementById('export-zona').value;
        const riesgo = document.getElementById('export-riesgo').value;
        const sexo = document.getElementById('export-sexo').value;
        
        // Paso 1: Obtener todos los niños
        let queryNinos = supabase
            .from('ninos')
            .select('*');
        
        if (sexo) {
            queryNinos = queryNinos.eq('sexo', sexo);
        }
        
        const { data: ninos, error: errorNinos } = await queryNinos;
        
        if (errorNinos) throw errorNinos;
        
        console.log(`✅ Niños obtenidos: ${ninos?.length || 0}`);
        
        if (!ninos || ninos.length === 0) {
            datosParaExportar = [];
            actualizarResumenExport(0, 'No hay datos para los filtros seleccionados');
            return;
        }
        
        const ninosIds = ninos.map(n => n.id);
        
        // Paso 2: Obtener mediciones
        let queryMediciones = supabase
            .from('mediciones_antropometricas')
            .select('*')
            .in('nino_id', ninosIds);
        
        if (fechaInicio) {
            queryMediciones = queryMediciones.gte('fecha_medicion', fechaInicio);
        }
        if (fechaFin) {
            queryMediciones = queryMediciones.lte('fecha_medicion', fechaFin);
        }
        
        const { data: mediciones, error: errorMediciones } = await queryMediciones;
        
        if (errorMediciones) throw errorMediciones;
        
        console.log(`✅ Mediciones obtenidas: ${mediciones?.length || 0}`);
        
        // Paso 3: Obtener datos sociodemográficos
        let querySociodem = supabase
            .from('datos_sociodemograficos')
            .select('*')
            .in('nino_id', ninosIds);
        
        if (zona) {
            querySociodem = querySociodem.eq('zona', zona);
        }
        
        const { data: sociodem, error: errorSociodem } = await querySociodem;
        
        if (errorSociodem) throw errorSociodem;
        
        console.log(`✅ Datos sociodemográficos obtenidos: ${sociodem?.length || 0}`);
        
        // Paso 4: Obtener predicciones
        let queryPredicciones = supabase
            .from('predicciones')
            .select('*')
            .in('nino_id', ninosIds);
        
        if (riesgo) {
            queryPredicciones = queryPredicciones.eq('nivel_riesgo', riesgo);
        }
        
        const { data: predicciones, error: errorPredicciones } = await queryPredicciones;
        
        if (errorPredicciones) throw errorPredicciones;
        
        console.log(`✅ Predicciones obtenidas: ${predicciones?.length || 0}`);
        
        // Paso 5: Combinar datos
        datosParaExportar = ninos.map(nino => {
            const medicion = mediciones?.find(m => m.nino_id === nino.id);
            const datos_socio = sociodem?.find(s => s.nino_id === nino.id);
            const prediccion = predicciones?.find(p => p.nino_id === nino.id);
            
            return {
                nino,
                medicion: medicion || null,
                datos_socio: datos_socio || null,
                prediccion: prediccion || null
            };
        }).filter(item => {
            // Aplicar filtros adicionales
            if (zona && (!item.datos_socio || item.datos_socio.zona !== zona)) return false;
            if (riesgo && (!item.prediccion || item.prediccion.nivel_riesgo !== riesgo)) return false;
            if (fechaInicio && item.medicion && item.medicion.fecha_medicion < fechaInicio) return false;
            if (fechaFin && item.medicion && item.medicion.fecha_medicion > fechaFin) return false;
            
            return true;
        });
        
        console.log(`✅ Datos combinados y filtrados: ${datosParaExportar.length}`);
        
        // Actualizar resumen
        const filtrosTexto = construirTextoFiltros(fechaInicio, fechaFin, zona, riesgo, sexo);
        actualizarResumenExport(datosParaExportar.length, filtrosTexto);
        
    } catch (error) {
        console.error('❌ Error al cargar datos para exportar:', error);
        alert('Error al cargar datos. Por favor, intenta de nuevo.');
        datosParaExportar = [];
        actualizarResumenExport(0, 'Error al cargar datos');
    }
}

/**
 * Construir texto descriptivo de filtros aplicados
 */
function construirTextoFiltros(fechaInicio, fechaFin, zona, riesgo, sexo) {
    const filtros = [];
    
    if (fechaInicio || fechaFin) {
        if (fechaInicio && fechaFin) {
            filtros.push(`Período: ${new Date(fechaInicio).toLocaleDateString('es-ES')} - ${new Date(fechaFin).toLocaleDateString('es-ES')}`);
        } else if (fechaInicio) {
            filtros.push(`Desde: ${new Date(fechaInicio).toLocaleDateString('es-ES')}`);
        } else {
            filtros.push(`Hasta: ${new Date(fechaFin).toLocaleDateString('es-ES')}`);
        }
    }
    
    if (zona) filtros.push(`Zona: ${zona}`);
    if (riesgo) filtros.push(`Riesgo: ${riesgo}`);
    if (sexo) filtros.push(`Sexo: ${sexo === 'M' ? 'Masculino' : 'Femenino'}`);
    
    return filtros.length > 0 ? filtros.join(' • ') : 'Sin filtros aplicados';
}

/**
 * Actualizar resumen de exportación
 */
function actualizarResumenExport(total, filtrosTexto) {
    const summary = document.getElementById('export-results-summary');
    const totalElement = document.getElementById('export-total-registros');
    const filtrosElement = document.getElementById('export-filtros-aplicados');
    
    if (summary && totalElement && filtrosElement) {
        totalElement.textContent = total;
        filtrosElement.textContent = filtrosTexto;
        
        if (total > 0) {
            summary.classList.remove('hidden');
        } else {
            summary.classList.add('hidden');
        }
    }
}

/**
 * Limpiar todos los filtros
 */
function limpiarFiltrosExport() {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 12);
    
    document.getElementById('export-fecha-inicio').value = fechaInicio.toISOString().split('T')[0];
    document.getElementById('export-fecha-fin').value = fechaFin.toISOString().split('T')[0];
    document.getElementById('export-zona').value = '';
    document.getElementById('export-riesgo').value = '';
    document.getElementById('export-sexo').value = '';
    
    aplicarFiltrosExport();
}

/**
 * Toggle campos de una sección
 */
function toggleCamposSeccion(seccion, checked) {
    const campos = document.querySelectorAll(`.campo-${seccion}`);
    campos.forEach(campo => {
        campo.checked = checked;
    });
}

/**
 * Seleccionar todos o ningún campo
 */
function seleccionarTodosCampos(seleccionar) {
    const checkboxes = document.querySelectorAll('input[name="campo"]');
    checkboxes.forEach(cb => {
        cb.checked = seleccionar;
    });
    
    // También actualizar checkboxes de secciones
    document.getElementById('campo-datos-basicos').checked = seleccionar;
    document.getElementById('campo-mediciones').checked = seleccionar;
    document.getElementById('campo-sociodem').checked = seleccionar;
    document.getElementById('campo-predicciones').checked = seleccionar;
}

/**
 * Ejecutar exportación según formato seleccionado
 */
async function ejecutarExportacion() {
    if (datosParaExportar.length === 0) {
        alert('No hay datos para exportar. Por favor, aplica filtros primero.');
        return;
    }
    
    // Mostrar estado de carga
    const statusDiv = document.getElementById('export-status');
    const progressSpan = document.getElementById('export-progress');
    statusDiv.classList.remove('hidden');
    progressSpan.textContent = datosParaExportar.length;
    
    try {
        // Obtener formato seleccionado
        const formato = document.querySelector('input[name="formato"]:checked').value;
        
        // Obtener campos seleccionados
        const camposSeleccionados = Array.from(document.querySelectorAll('input[name="campo"]:checked'))
            .map(cb => cb.value);
        
        if (camposSeleccionados.length === 0) {
            alert('Por favor, selecciona al menos un campo para exportar.');
            statusDiv.classList.add('hidden');
            return;
        }
        
        console.log('📋 Exportando en formato:', formato);
        console.log('📋 Campos seleccionados:', camposSeleccionados);
        
        // Ejecutar exportación según formato
        switch (formato) {
            case 'csv':
                exportarCSV(datosParaExportar, camposSeleccionados);
                break;
            case 'json':
                exportarJSON(datosParaExportar, camposSeleccionados);
                break;
            case 'excel':
                exportarExcel(datosParaExportar, camposSeleccionados);
                break;
            default:
                alert('Formato no válido');
        }
        
        // Ocultar estado después de 2 segundos
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error al exportar:', error);
        alert('Error al exportar datos. Por favor, intenta de nuevo.');
        statusDiv.classList.add('hidden');
    }
}

/**
 * Exportar datos a formato CSV
 */
function exportarCSV(datos, campos) {
    console.log('📊 Generando archivo CSV...');
    
    // Construir encabezados
    const headers = campos.map(campo => obtenerNombreCampo(campo));
    
    // Construir filas
    const rows = datos.map(item => {
        return campos.map(campo => {
            const valor = obtenerValorCampo(item, campo);
            // Escapar comas y comillas
            const valorStr = String(valor || '');
            if (valorStr.includes(',') || valorStr.includes('"') || valorStr.includes('\n')) {
                return `"${valorStr.replace(/"/g, '""')}"`;
            }
            return valorStr;
        });
    });
    
    // Combinar todo
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    descargarArchivo(blob, `SIDI_Export_${obtenerTimestamp()}.csv`);
    
    console.log('✅ Archivo CSV generado y descargado');
}

/**
 * Exportar datos a formato JSON
 */
function exportarJSON(datos, campos) {
    console.log('📊 Generando archivo JSON...');
    
    // Construir objetos solo con campos seleccionados
    const jsonData = datos.map(item => {
        const obj = {};
        campos.forEach(campo => {
            obj[campo] = obtenerValorCampo(item, campo);
        });
        return obj;
    });
    
    // Crear JSON con formato legible
    const jsonContent = JSON.stringify({
        metadata: {
            fecha_exportacion: new Date().toISOString(),
            total_registros: datos.length,
            campos_incluidos: campos
        },
        datos: jsonData
    }, null, 2);
    
    // Descargar archivo
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    descargarArchivo(blob, `SIDI_Export_${obtenerTimestamp()}.json`);
    
    console.log('✅ Archivo JSON generado y descargado');
}

/**
 * Exportar datos a formato Excel (CSV con formato mejorado)
 */
function exportarExcel(datos, campos) {
    console.log('📊 Generando archivo Excel...');
    
    // Para Excel usamos formato CSV con separador de punto y coma
    // y configuración compatible con Excel
    
    // Construir encabezados
    const headers = campos.map(campo => obtenerNombreCampo(campo));
    
    // Construir filas
    const rows = datos.map(item => {
        return campos.map(campo => {
            const valor = obtenerValorCampo(item, campo);
            const valorStr = String(valor || '');
            // Usar punto y coma como separador para Excel
            if (valorStr.includes(';') || valorStr.includes('"') || valorStr.includes('\n')) {
                return `"${valorStr.replace(/"/g, '""')}"`;
            }
            return valorStr;
        });
    });
    
    // Combinar con separador de punto y coma
    const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.join(';'))
    ].join('\n');
    
    // Descargar archivo con extensión .csv (Excel lo abrirá automáticamente)
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    descargarArchivo(blob, `SIDI_Export_Excel_${obtenerTimestamp()}.csv`);
    
    console.log('✅ Archivo Excel generado y descargado');
}

/**
 * Obtener nombre legible de un campo
 */
function obtenerNombreCampo(campo) {
    const nombres = {
        // Datos básicos
        'nombre_completo': 'Nombre Completo',
        'fecha_nacimiento': 'Fecha de Nacimiento',
        'edad_meses': 'Edad (meses)',
        'sexo': 'Sexo',
        // Mediciones
        'peso': 'Peso (kg)',
        'talla': 'Talla (cm)',
        'imc': 'IMC',
        'perimetro_cefalico': 'Perímetro Cefálico (cm)',
        'fecha_medicion': 'Fecha de Medición',
        // Sociodemográficos
        'zona': 'Zona',
        'departamento': 'Departamento',
        'municipio': 'Municipio',
        'nivel_educativo_madre': 'Nivel Educativo Madre',
        // Predicciones
        'nivel_riesgo': 'Nivel de Riesgo',
        'probabilidad_riesgo': 'Probabilidad (%)',
        'tipo_desnutricion': 'Tipo de Desnutrición'
    };
    
    return nombres[campo] || campo;
}

/**
 * Obtener valor de un campo desde los datos combinados
 */
function obtenerValorCampo(item, campo) {
    const { nino, medicion, datos_socio, prediccion } = item;
    
    // Calcular edad en meses si se solicita
    if (campo === 'edad_meses' && nino.fecha_nacimiento) {
        const edad = calcularEdadMeses(nino.fecha_nacimiento);
        return edad;
    }
    
    // Nombre completo (concatenar nombre y apellido)
    if (campo === 'nombre_completo') {
        return `${nino.nombre || ''} ${nino.apellido || ''}`.trim();
    }
    
    // Otros datos básicos del niño
    if (['fecha_nacimiento', 'sexo'].includes(campo)) {
        return nino[campo] || '';
    }
    
    // Mediciones antropométricas
    if (['peso', 'talla', 'imc', 'perimetro_cefalico', 'fecha_medicion'].includes(campo)) {
        return medicion ? medicion[campo] || '' : '';
    }
    
    // Datos sociodemográficos
    if (['zona', 'departamento', 'municipio', 'nivel_educativo_madre'].includes(campo)) {
        return datos_socio ? datos_socio[campo] || '' : '';
    }
    
    // Predicciones
    if (['nivel_riesgo', 'probabilidad_riesgo', 'tipo_desnutricion'].includes(campo)) {
        if (!prediccion) return '';
        if (campo === 'probabilidad_riesgo') {
            return prediccion.probabilidad_riesgo ? `${(prediccion.probabilidad_riesgo * 100).toFixed(1)}%` : '';
        }
        return prediccion[campo] || '';
    }
    
    return '';
}

/**
 * Descargar archivo
 */
function descargarArchivo(blob, nombreArchivo) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Obtener timestamp para nombre de archivo
 */
function obtenerTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}`;
}

// Exportar funciones al objeto window
window.cargarExportarDatos = cargarExportarDatos;
window.aplicarFiltrosExport = aplicarFiltrosExport;
window.limpiarFiltrosExport = limpiarFiltrosExport;
window.toggleCamposSeccion = toggleCamposSeccion;
window.seleccionarTodosCampos = seleccionarTodosCampos;
window.ejecutarExportacion = ejecutarExportacion;

console.log('✅ Módulo de exportación cargado correctamente');

// ==========================================
// === MÓDULO DE GENERACIÓN DE REPORTES PDF ===
// ==========================================

// Variable global para datos de reportes
let datosReporte = [];

/**
 * Cargar vista de reportes
 */
async function cargarReportes() {
    console.log('📄 Cargando módulo de reportes...');
    
    // Configurar fechas por defecto (último mes)
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    
    document.getElementById('reporte-fecha-inicio').value = fechaInicio.toISOString().split('T')[0];
    document.getElementById('reporte-fecha-fin').value = fechaFin.toISOString().split('T')[0];
    
    // Cargar vista previa
    await actualizarVistaPrevia();
}

/**
 * Actualizar vista previa de estadísticas
 */
async function actualizarVistaPrevia() {
    console.log('🔄 Actualizando vista previa...');
    
    try {
        const fechaInicio = document.getElementById('reporte-fecha-inicio').value;
        const fechaFin = document.getElementById('reporte-fecha-fin').value;
        const zona = document.getElementById('reporte-zona').value;
        
        // Obtener datos con el mismo approach de 4 pasos
        const { data: ninos } = await supabase.from('ninos').select('*');
        
        if (!ninos || ninos.length === 0) {
            actualizarPreviewUI(0, 0, 0, 0);
            return;
        }
        
        const ninosIds = ninos.map(n => n.id);
        
        // Obtener datos relacionados
        let queryMediciones = supabase.from('mediciones_antropometricas').select('*').in('nino_id', ninosIds);
        if (fechaInicio) queryMediciones = queryMediciones.gte('fecha_medicion', fechaInicio);
        if (fechaFin) queryMediciones = queryMediciones.lte('fecha_medicion', fechaFin);
        
        const { data: mediciones } = await queryMediciones;
        
        let querySociodem = supabase.from('datos_sociodemograficos').select('*').in('nino_id', ninosIds);
        if (zona) querySociodem = querySociodem.eq('zona', zona);
        
        const { data: sociodem } = await querySociodem;
        const { data: predicciones } = await supabase.from('predicciones').select('*').in('nino_id', ninosIds);
        
        // Combinar datos
        datosReporte = ninos.map(nino => {
            const medicion = mediciones?.find(m => m.nino_id === nino.id);
            const datos_socio = sociodem?.find(s => s.nino_id === nino.id);
            const prediccion = predicciones?.find(p => p.nino_id === nino.id);
            
            return {
                nino,
                medicion: medicion || null,
                datos_socio: datos_socio || null,
                prediccion: prediccion || null
            };
        }).filter(item => {
            if (zona && (!item.datos_socio || item.datos_socio.zona !== zona)) return false;
            return true;
        });
        
        // Calcular estadísticas
        const total = datosReporte.length;
        const alto = datosReporte.filter(item => item.prediccion?.nivel_riesgo === 'alto').length;
        const moderado = datosReporte.filter(item => item.prediccion?.nivel_riesgo === 'moderado').length;
        const bajo = datosReporte.filter(item => item.prediccion?.nivel_riesgo === 'bajo').length;
        
        actualizarPreviewUI(total, alto, moderado, bajo);
        
        console.log(`✅ Vista previa actualizada: ${total} pacientes`);
        
    } catch (error) {
        console.error('❌ Error al actualizar vista previa:', error);
        actualizarPreviewUI(0, 0, 0, 0);
    }
}

/**
 * Actualizar UI de vista previa
 */
function actualizarPreviewUI(total, alto, moderado, bajo) {
    document.getElementById('preview-total').textContent = total;
    document.getElementById('preview-alto').textContent = alto;
    document.getElementById('preview-moderado').textContent = moderado;
    document.getElementById('preview-bajo').textContent = bajo;
}

/**
 * Generar reporte según tipo
 */
async function generarReporte(tipo) {
    console.log(`📄 Generando reporte: ${tipo}`);
    
    if (datosReporte.length === 0) {
        alert('No hay datos para generar el reporte. Por favor, ajusta los filtros.');
        return;
    }
    
    // Mostrar estado de carga
    const statusDiv = document.getElementById('reporte-status');
    statusDiv.classList.remove('hidden');
    
    try {
        let contenidoHTML = '';
        
        switch (tipo) {
            case 'ejecutivo':
                contenidoHTML = generarReporteEjecutivo();
                break;
            case 'zona':
                contenidoHTML = generarReporteZona();
                break;
            case 'alto-riesgo':
                contenidoHTML = generarReporteAltoRiesgo();
                break;
            case 'personalizado':
                contenidoHTML = generarReportePersonalizado();
                break;
            default:
                throw new Error('Tipo de reporte no válido');
        }
        
        // Convertir HTML a PDF y descargar
        await descargarReportePDF(contenidoHTML, tipo);
        
        // Ocultar estado
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error al generar reporte:', error);
        alert('Error al generar el reporte. Por favor, intenta de nuevo.');
        statusDiv.classList.add('hidden');
    }
}

/**
 * Generar contenido HTML para Reporte Ejecutivo
 */
function generarReporteEjecutivo() {
    const fechaInicio = document.getElementById('reporte-fecha-inicio').value;
    const fechaFin = document.getElementById('reporte-fecha-fin').value;
    const zona = document.getElementById('reporte-zona').value;
    
    // Calcular estadísticas
    const total = datosReporte.length;
    const alto = datosReporte.filter(i => i.prediccion?.nivel_riesgo === 'alto').length;
    const moderado = datosReporte.filter(i => i.prediccion?.nivel_riesgo === 'moderado').length;
    const bajo = datosReporte.filter(i => i.prediccion?.nivel_riesgo === 'bajo').length;
    const sinEvaluar = total - alto - moderado - bajo;
    
    // Distribución por zona
    const urbana = datosReporte.filter(i => i.datos_socio?.zona === 'Urbana').length;
    const rural = datosReporte.filter(i => i.datos_socio?.zona === 'Rural').length;
    
    // Distribución por sexo
    const masculino = datosReporte.filter(i => i.nino.sexo === 'M').length;
    const femenino = datosReporte.filter(i => i.nino.sexo === 'F').length;
    
    // Promedios
    const medicionesConDatos = datosReporte.filter(i => i.medicion);
    const pesoPromedio = medicionesConDatos.length > 0 
        ? (medicionesConDatos.reduce((sum, i) => sum + (parseFloat(i.medicion.peso) || 0), 0) / medicionesConDatos.length).toFixed(1)
        : 0;
    const tallaPromedio = medicionesConDatos.length > 0
        ? (medicionesConDatos.reduce((sum, i) => sum + (parseFloat(i.medicion.talla) || 0), 0) / medicionesConDatos.length).toFixed(1)
        : 0;
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Ejecutivo - SIDI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #0066CC;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #0066CC;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #0066CC;
            border-bottom: 2px solid #00A86B;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        .stat-box {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        .stat-box h3 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            font-weight: normal;
        }
        .stat-box .value {
            font-size: 32px;
            font-weight: bold;
            color: #0066CC;
        }
        .risk-alto { color: #DC2626; }
        .risk-moderado { color: #F59E0B; }
        .risk-bajo { color: #10B981; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table th {
            background-color: #0066CC;
            color: white;
            padding: 12px;
            text-align: left;
        }
        table td {
            border: 1px solid #ddd;
            padding: 10px;
        }
        table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 REPORTE EJECUTIVO</h1>
        <p><strong>Sistema Inteligente de Detección de Desnutrición Infantil</strong></p>
        <p>Universidad de Pamplona - Norte de Santander</p>
        <p>Período: ${new Date(fechaInicio).toLocaleDateString('es-ES')} - ${new Date(fechaFin).toLocaleDateString('es-ES')}</p>
        ${zona ? `<p>Zona: ${zona}</p>` : ''}
        <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
    </div>

    <div class="section">
        <h2>Resumen General</h2>
        <div class="stats-grid">
            <div class="stat-box">
                <h3>Total de Pacientes</h3>
                <div class="value">${total}</div>
            </div>
            <div class="stat-box">
                <h3>Alto Riesgo</h3>
                <div class="value risk-alto">${alto}</div>
                <small>${total > 0 ? ((alto/total)*100).toFixed(1) : 0}%</small>
            </div>
            <div class="stat-box">
                <h3>Riesgo Moderado</h3>
                <div class="value risk-moderado">${moderado}</div>
                <small>${total > 0 ? ((moderado/total)*100).toFixed(1) : 0}%</small>
            </div>
            <div class="stat-box">
                <h3>Bajo Riesgo</h3>
                <div class="value risk-bajo">${bajo}</div>
                <small>${total > 0 ? ((bajo/total)*100).toFixed(1) : 0}%</small>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Distribución Geográfica</h2>
        <table>
            <tr>
                <th>Zona</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
            </tr>
            <tr>
                <td>Zona Urbana</td>
                <td>${urbana}</td>
                <td>${total > 0 ? ((urbana/total)*100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
                <td>Zona Rural</td>
                <td>${rural}</td>
                <td>${total > 0 ? ((rural/total)*100).toFixed(1) : 0}%</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Distribución por Sexo</h2>
        <table>
            <tr>
                <th>Sexo</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
            </tr>
            <tr>
                <td>Masculino</td>
                <td>${masculino}</td>
                <td>${total > 0 ? ((masculino/total)*100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
                <td>Femenino</td>
                <td>${femenino}</td>
                <td>${total > 0 ? ((femenino/total)*100).toFixed(1) : 0}%</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Indicadores Antropométricos Promedio</h2>
        <div class="stats-grid">
            <div class="stat-box">
                <h3>Peso Promedio</h3>
                <div class="value">${pesoPromedio}</div>
                <small>kg</small>
            </div>
            <div class="stat-box">
                <h3>Talla Promedio</h3>
                <div class="value">${tallaPromedio}</div>
                <small>cm</small>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Conclusiones y Recomendaciones</h2>
        <ul>
            <li>Se identificaron <strong>${alto}</strong> casos de alto riesgo que requieren atención inmediata.</li>
            <li>El ${total > 0 ? ((alto/total)*100).toFixed(1) : 0}% de los casos evaluados presenta riesgo alto de desnutrición.</li>
            <li>Se recomienda realizar seguimiento mensual a todos los casos de alto y moderado riesgo.</li>
            <li>Es necesario fortalecer programas nutricionales en ${rural > urbana ? 'zona rural' : 'zona urbana'}.</li>
        </ul>
    </div>

    <div class="footer">
        <p>Este reporte fue generado automáticamente por SIDI</p>
        <p>© 2025 Universidad de Pamplona - Todos los derechos reservados</p>
    </div>
</body>
</html>
    `;
    
    return html;
}

/**
 * Generar contenido HTML para Reporte por Zona
 */
function generarReporteZona() {
    const fechaInicio = document.getElementById('reporte-fecha-inicio').value;
    const fechaFin = document.getElementById('reporte-fecha-fin').value;
    
    // Separar por zona
    const datosUrbana = datosReporte.filter(i => i.datos_socio?.zona === 'Urbana');
    const datosRural = datosReporte.filter(i => i.datos_socio?.zona === 'Rural');
    
    // Estadísticas por zona
    const statsUrbana = calcularEstadisticasZona(datosUrbana);
    const statsRural = calcularEstadisticasZona(datosRural);
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte por Zona - SIDI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #0066CC;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #0066CC;
            margin: 0;
            font-size: 28px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #0066CC;
            border-bottom: 2px solid #00A86B;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table th {
            background-color: #0066CC;
            color: white;
            padding: 12px;
            text-align: left;
        }
        table td {
            border: 1px solid #ddd;
            padding: 10px;
        }
        .zona-urbana { background-color: #EFF6FF; }
        .zona-rural { background-color: #F0FDF4; }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🗺️ REPORTE DE ANÁLISIS POR ZONA</h1>
        <p><strong>Sistema Inteligente de Detección de Desnutrición Infantil</strong></p>
        <p>Período: ${new Date(fechaInicio).toLocaleDateString('es-ES')} - ${new Date(fechaFin).toLocaleDateString('es-ES')}</p>
        <p>Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
    </div>

    <div class="section">
        <h2>Comparativa General</h2>
        <table>
            <tr>
                <th>Indicador</th>
                <th class="zona-urbana">Zona Urbana</th>
                <th class="zona-rural">Zona Rural</th>
            </tr>
            <tr>
                <td><strong>Total Pacientes</strong></td>
                <td class="zona-urbana">${statsUrbana.total}</td>
                <td class="zona-rural">${statsRural.total}</td>
            </tr>
            <tr>
                <td>Alto Riesgo</td>
                <td class="zona-urbana">${statsUrbana.alto} (${statsUrbana.porcentajeAlto}%)</td>
                <td class="zona-rural">${statsRural.alto} (${statsRural.porcentajeAlto}%)</td>
            </tr>
            <tr>
                <td>Riesgo Moderado</td>
                <td class="zona-urbana">${statsUrbana.moderado} (${statsUrbana.porcentajeModerado}%)</td>
                <td class="zona-rural">${statsRural.moderado} (${statsRural.porcentajeModerado}%)</td>
            </tr>
            <tr>
                <td>Bajo Riesgo</td>
                <td class="zona-urbana">${statsUrbana.bajo} (${statsUrbana.porcentajeBajo}%)</td>
                <td class="zona-rural">${statsRural.bajo} (${statsRural.porcentajeBajo}%)</td>
            </tr>
            <tr>
                <td>Peso Promedio (kg)</td>
                <td class="zona-urbana">${statsUrbana.pesoPromedio}</td>
                <td class="zona-rural">${statsRural.pesoPromedio}</td>
            </tr>
            <tr>
                <td>Talla Promedio (cm)</td>
                <td class="zona-urbana">${statsUrbana.tallaPromedio}</td>
                <td class="zona-rural">${statsRural.tallaPromedio}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Análisis y Recomendaciones</h2>
        <h3>Zona Urbana</h3>
        <ul>
            <li>Total de pacientes evaluados: ${statsUrbana.total}</li>
            <li>Casos de alto riesgo: ${statsUrbana.alto} (${statsUrbana.porcentajeAlto}%)</li>
            <li>Se recomienda ${statsUrbana.alto > 0 ? 'fortalecer programas de seguimiento nutricional' : 'mantener los programas actuales'}</li>
        </ul>
        
        <h3>Zona Rural</h3>
        <ul>
            <li>Total de pacientes evaluados: ${statsRural.total}</li>
            <li>Casos de alto riesgo: ${statsRural.alto} (${statsRural.porcentajeAlto}%)</li>
            <li>Se recomienda ${statsRural.alto > statsUrbana.alto ? 'priorizar intervenciones en esta zona' : 'mantener vigilancia continua'}</li>
        </ul>
    </div>

    <div class="footer">
        <p>Este reporte fue generado automáticamente por SIDI</p>
        <p>© 2025 Universidad de Pamplona</p>
    </div>
</body>
</html>
    `;
    
    return html;
}

/**
 * Calcular estadísticas para una zona específica
 */
function calcularEstadisticasZona(datos) {
    const total = datos.length;
    const alto = datos.filter(i => i.prediccion?.nivel_riesgo === 'alto').length;
    const moderado = datos.filter(i => i.prediccion?.nivel_riesgo === 'moderado').length;
    const bajo = datos.filter(i => i.prediccion?.nivel_riesgo === 'bajo').length;
    
    const medicionesConDatos = datos.filter(i => i.medicion);
    const pesoPromedio = medicionesConDatos.length > 0 
        ? (medicionesConDatos.reduce((sum, i) => sum + (parseFloat(i.medicion.peso) || 0), 0) / medicionesConDatos.length).toFixed(1)
        : 0;
    const tallaPromedio = medicionesConDatos.length > 0
        ? (medicionesConDatos.reduce((sum, i) => sum + (parseFloat(i.medicion.talla) || 0), 0) / medicionesConDatos.length).toFixed(1)
        : 0;
    
    return {
        total,
        alto,
        moderado,
        bajo,
        porcentajeAlto: total > 0 ? ((alto/total)*100).toFixed(1) : 0,
        porcentajeModerado: total > 0 ? ((moderado/total)*100).toFixed(1) : 0,
        porcentajeBajo: total > 0 ? ((bajo/total)*100).toFixed(1) : 0,
        pesoPromedio,
        tallaPromedio
    };
}

/**
 * Generar contenido HTML para Reporte de Alto Riesgo
 */
function generarReporteAltoRiesgo() {
    const casosAltoRiesgo = datosReporte.filter(i => i.prediccion?.nivel_riesgo === 'alto');
    
    let filasTabla = '';
    casosAltoRiesgo.forEach((item, index) => {
        const nombre = `${item.nino.nombre} ${item.nino.apellido}`;
        const edad = item.nino.fecha_nacimiento ? calcularEdadMeses(item.nino.fecha_nacimiento) : 'N/D';
        const peso = item.medicion?.peso || 'N/D';
        const talla = item.medicion?.talla || 'N/D';
        const zona = item.datos_socio?.zona || 'N/D';
        const probabilidad = item.prediccion?.probabilidad_riesgo 
            ? `${(item.prediccion.probabilidad_riesgo * 100).toFixed(1)}%` 
            : 'N/D';
        
        filasTabla += `
            <tr>
                <td>${index + 1}</td>
                <td>${nombre}</td>
                <td>${edad} meses</td>
                <td>${item.nino.sexo === 'M' ? 'Masculino' : 'Femenino'}</td>
                <td>${peso} kg</td>
                <td>${talla} cm</td>
                <td>${zona}</td>
                <td><strong>${probabilidad}</strong></td>
            </tr>
        `;
    });
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Casos de Alto Riesgo - SIDI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #DC2626;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #DC2626;
            margin: 0;
            font-size: 28px;
        }
        .alert-box {
            background-color: #FEE2E2;
            border-left: 4px solid #DC2626;
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 12px;
        }
        table th {
            background-color: #DC2626;
            color: white;
            padding: 10px;
            text-align: left;
        }
        table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ REPORTE DE CASOS DE ALTO RIESGO</h1>
        <p><strong>Sistema Inteligente de Detección de Desnutrición Infantil</strong></p>
        <p>Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
    </div>

    <div class="alert-box">
        <strong>⚠️ ATENCIÓN:</strong> Este reporte contiene ${casosAltoRiesgo.length} casos clasificados como ALTO RIESGO que requieren intervención inmediata.
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Paciente</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Peso</th>
                <th>Talla</th>
                <th>Zona</th>
                <th>Probabilidad</th>
            </tr>
        </thead>
        <tbody>
            ${filasTabla || '<tr><td colspan="8" style="text-align:center;">No hay casos de alto riesgo en el período seleccionado</td></tr>'}
        </tbody>
    </table>

    <div style="margin-top: 30px;">
        <h2 style="color: #DC2626;">Plan de Acción Recomendado</h2>
        <ol>
            <li><strong>Contacto Inmediato:</strong> Establecer comunicación con las familias en las próximas 24-48 horas.</li>
            <li><strong>Evaluación Médica:</strong> Programar consulta con nutricionista y pediatra.</li>
            <li><strong>Seguimiento:</strong> Realizar control semanal durante el primer mes.</li>
            <li><strong>Apoyo Nutricional:</strong> Gestionar suplementos alimenticios si es necesario.</li>
            <li><strong>Educación:</strong> Capacitar a las familias sobre alimentación adecuada.</li>
        </ol>
    </div>

    <div class="footer">
        <p>Este reporte fue generado automáticamente por SIDI</p>
        <p>© 2025 Universidad de Pamplona</p>
    </div>
</body>
</html>
    `;
    
    return html;
}

/**
 * Generar reporte personalizado
 */
function generarReportePersonalizado() {
    // Por ahora, generar reporte ejecutivo
    // TODO: Implementar selección personalizada de campos
    return generarReporteEjecutivo();
}

/**
 * Descargar reporte como PDF (simulado con HTML)
 */
async function descargarReportePDF(htmlContent, tipo) {
    // Crear un blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    
    // Crear enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SIDI_Reporte_${tipo}_${obtenerTimestamp()}.html`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log(`✅ Reporte ${tipo} descargado correctamente`);
    
    // Nota: Para generar PDF real, se necesitaría una librería como jsPDF o html2pdf
    // Por ahora descargamos como HTML que se puede abrir en el navegador e imprimir como PDF
}

// Exportar funciones al objeto window
window.cargarReportes = cargarReportes;
window.actualizarVistaPrevia = actualizarVistaPrevia;
window.generarReporte = generarReporte;

console.log('✅ Módulo de reportes cargado correctamente');

// ==========================================
// === MÓDULO DE ALERTAS DE RIESGO ===
// ==========================================

// Variables globales para alertas
let alertasData = [];
let alertaSeleccionada = null;

/**
 * Cargar vista de alertas
 */
async function cargarAlertas() {
    console.log('🔔 Cargando módulo de alertas...');
    await cargarTodasLasAlertas();
}

/**
 * Cargar todas las alertas de alto riesgo
 */
async function cargarTodasLasAlertas() {
    console.log('📋 Obteniendo alertas de alto riesgo...');
    
    try {
        // Obtener todos los pacientes con predicción de alto riesgo
        const { data: predicciones, error: errorPredicciones } = await supabase
            .from('predicciones')
            .select('*')
            .eq('nivel_riesgo', 'alto')
            .order('fecha_prediccion', { ascending: false });
        
        if (errorPredicciones) {
            console.error('❌ Error al obtener predicciones:', errorPredicciones);
            throw errorPredicciones;
        }
        
        console.log(`✅ Predicciones obtenidas: ${predicciones?.length || 0}`);
        
        if (!predicciones || predicciones.length === 0) {
            console.log('⚠️ No hay predicciones de alto riesgo');
            alertasData = [];
            actualizarUIAlertas();
            return;
        }
        
        const ninosIds = predicciones.map(p => p.nino_id);
        console.log('👶 IDs de niños:', ninosIds);
        
        // Obtener datos de los niños
        const { data: ninos, error: errorNinos } = await supabase
            .from('ninos')
            .select('*')
            .in('id', ninosIds);
        
        if (errorNinos) {
            console.error('❌ Error al obtener niños:', errorNinos);
            throw errorNinos;
        }
        
        console.log(`✅ Niños obtenidos: ${ninos?.length || 0}`);
        
        // Obtener datos sociodemográficos
        const { data: sociodem, error: errorSociodem } = await supabase
            .from('datos_sociodemograficos')
            .select('*')
            .in('nino_id', ninosIds);
        
        if (errorSociodem) {
            console.error('❌ Error al obtener datos sociodemográficos:', errorSociodem);
            // No es crítico, continuamos
        }
        
        console.log(`✅ Datos sociodemográficos obtenidos: ${sociodem?.length || 0}`);
        
        // Combinar datos y crear alertas
        alertasData = predicciones.map(prediccion => {
            const nino = ninos?.find(n => n.id === prediccion.nino_id);
            const datos_socio = sociodem?.find(s => s.nino_id === prediccion.nino_id);
            
            if (!nino) return null;
            
            // Simular estado de alerta (en producción vendría de una tabla de seguimiento)
            const diasDesdeDeteccion = Math.floor((new Date() - new Date(prediccion.fecha_prediccion)) / (1000 * 60 * 60 * 24));
            let estado = 'pendiente';
            
            if (diasDesdeDeteccion > 7) {
                estado = Math.random() > 0.5 ? 'seguimiento' : 'resuelto';
            }
            
            return {
                id: prediccion.id,
                nino_id: prediccion.nino_id,
                nombre: `${nino.nombre} ${nino.apellido}`,
                fecha_nacimiento: nino.fecha_nacimiento,
                sexo: nino.sexo,
                zona: datos_socio?.zona_residencia || 'N/D',
                nivel_riesgo: prediccion.nivel_riesgo,
                probabilidad: prediccion.probabilidad_riesgo,
                fecha_deteccion: prediccion.fecha_prediccion,
                estado: estado,
                dias_desde_deteccion: diasDesdeDeteccion,
                tipo_desnutricion: prediccion.tipo_desnutricion
            };
        }).filter(a => a !== null);
        
        console.log(`✅ ${alertasData.length} alertas procesadas y cargadas`);
        actualizarUIAlertas();
        
    } catch (error) {
        console.error('❌ Error al cargar alertas:', error);
        alertasData = [];
        actualizarUIAlertas();
    }
}

/**
 * Actualizar toda la UI de alertas
 */
function actualizarUIAlertas() {
    console.log('🔄 Actualizando UI de alertas...');
    actualizarKPIsAlertas();
    actualizarTablaAlertas(alertasData);
    verificarCasosCriticos();
    console.log('✅ UI de alertas actualizada');
}

/**
 * Actualizar KPIs de alertas
 */
function actualizarKPIsAlertas() {
    const criticos = alertasData.filter(a => a.dias_desde_deteccion > 2 && a.estado === 'pendiente').length;
    const pendientes = alertasData.filter(a => a.estado === 'pendiente').length;
    const seguimiento = alertasData.filter(a => a.estado === 'seguimiento').length;
    const resueltos = alertasData.filter(a => a.estado === 'resuelto').length;
    
    console.log('📊 KPIs:', { criticos, pendientes, seguimiento, resueltos });
    
    const elemCriticos = document.getElementById('alertas-criticos');
    const elemPendientes = document.getElementById('alertas-pendientes');
    const elemSeguimiento = document.getElementById('alertas-seguimiento');
    const elemResueltos = document.getElementById('alertas-resueltos');
    
    if (elemCriticos) elemCriticos.textContent = criticos;
    if (elemPendientes) elemPendientes.textContent = pendientes;
    if (elemSeguimiento) elemSeguimiento.textContent = seguimiento;
    if (elemResueltos) elemResueltos.textContent = resueltos;
}

/**
 * Actualizar tabla de alertas
 */
function actualizarTablaAlertas(alertas) {
    console.log(`📋 Actualizando tabla con ${alertas?.length || 0} alertas`);
    
    const tbody = document.getElementById('tabla-alertas');
    const totalSpan = document.getElementById('total-alertas-mostradas');
    
    if (!tbody) {
        console.error('❌ No se encontró el elemento tabla-alertas');
        return;
    }
    
    if (!totalSpan) {
        console.error('❌ No se encontró el elemento total-alertas-mostradas');
    }
    
    if (!alertas || alertas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                        <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                        <p class="text-gray-600 text-lg font-semibold">No hay alertas activas</p>
                        <p class="text-gray-500 text-sm">Todos los casos de alto riesgo están bajo control</p>
                    </div>
                </td>
            </tr>
        `;
        if (totalSpan) totalSpan.textContent = '0 alertas';
        console.log('✅ Tabla actualizada (sin alertas)');
        return;
    }
    
    if (totalSpan) totalSpan.textContent = `${alertas.length} alerta${alertas.length !== 1 ? 's' : ''}`;
    
    tbody.innerHTML = alertas.map(alerta => {
        const edad = calcularEdadMeses(alerta.fecha_nacimiento);
        const fechaFormato = new Date(alerta.fecha_deteccion).toLocaleDateString('es-ES');
        
        // Badge de estado
        let estadoBadge = '';
        if (alerta.estado === 'pendiente') {
            estadoBadge = '<span class="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800"><i class="fas fa-clock mr-1"></i>Pendiente</span>';
        } else if (alerta.estado === 'seguimiento') {
            estadoBadge = '<span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><i class="fas fa-user-check mr-1"></i>En Seguimiento</span>';
        } else if (alerta.estado === 'resuelto') {
            estadoBadge = '<span class="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Resuelto</span>';
        }
        
        // Indicador de urgencia
        let urgenciaClass = '';
        if (alerta.dias_desde_deteccion > 2 && alerta.estado === 'pendiente') {
            urgenciaClass = 'bg-red-50 border-l-4 border-red-500';
        }
        
        return `
            <tr class="${urgenciaClass} hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-red-600"></i>
                        </div>
                        <div class="ml-4">
                            <p class="font-semibold text-gray-900">${alerta.nombre}</p>
                            <p class="text-xs text-gray-500">${alerta.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                    ${edad} meses
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs font-semibold ${alerta.zona?.toLowerCase() === 'urbana' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                        ${alerta.zona}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            <i class="fas fa-exclamation-triangle mr-1"></i>ALTO
                        </span>
                        <span class="ml-2 text-xs text-gray-600">${alerta.probabilidad ? `${(alerta.probabilidad * 100).toFixed(1)}%` : ''}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm">
                    <p class="text-gray-900">${fechaFormato}</p>
                    <p class="text-xs text-gray-500">Hace ${alerta.dias_desde_deteccion} día${alerta.dias_desde_deteccion !== 1 ? 's' : ''}</p>
                </td>
                <td class="px-6 py-4">
                    ${estadoBadge}
                </td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <button onclick="verDetalleAlerta(${alerta.nino_id})" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="abrirModalAlerta(${alerta.id}, '${alerta.nombre.replace(/'/g, "\\'")}')" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold" title="Actualizar estado">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Tabla actualizada con', alertas.length, 'filas');
}

/**
 * Verificar casos críticos que requieren atención urgente
 */
function verificarCasosCriticos() {
    const criticos = alertasData.filter(a => 
        a.dias_desde_deteccion > 2 && a.estado === 'pendiente'
    ).length;
    
    const banner = document.getElementById('banner-criticos');
    const numCriticos = document.getElementById('banner-num-criticos');
    
    if (criticos > 0) {
        numCriticos.textContent = criticos;
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

/**
 * Aplicar filtros a las alertas
 */
function aplicarFiltrosAlertas() {
    const estadoFiltro = document.getElementById('filtro-estado-alerta').value;
    const zonaFiltro = document.getElementById('filtro-zona-alerta').value;
    const diasFiltro = document.getElementById('filtro-dias-alerta').value;
    
    let alertasFiltradas = [...alertasData];
    
    // Filtro por estado
    if (estadoFiltro) {
        alertasFiltradas = alertasFiltradas.filter(a => a.estado === estadoFiltro);
    }
    
    // Filtro por zona
    if (zonaFiltro) {
        alertasFiltradas = alertasFiltradas.filter(a => a.zona === zonaFiltro);
    }
    
    // Filtro por días
    if (diasFiltro) {
        const dias = parseInt(diasFiltro);
        alertasFiltradas = alertasFiltradas.filter(a => a.dias_desde_deteccion <= dias);
    }
    
    actualizarTablaAlertas(alertasFiltradas);
    console.log(`🔍 Filtros aplicados: ${alertasFiltradas.length} alertas mostradas`);
}

/**
 * Filtrar solo casos críticos
 */
function filtrarCriticos() {
    document.getElementById('filtro-estado-alerta').value = 'pendiente';
    document.getElementById('filtro-dias-alerta').value = '';
    
    const criticas = alertasData.filter(a => 
        a.dias_desde_deteccion > 2 && a.estado === 'pendiente'
    );
    
    actualizarTablaAlertas(criticas);
}

/**
 * Ver detalle de una alerta
 */
function verDetalleAlerta(ninoId) {
    console.log('👁️ Ver detalle de paciente:', ninoId);
    // Redirigir a la vista de pacientes con el detalle
    showView('pacientes');
    setTimeout(() => {
        verDetallePaciente(ninoId);
    }, 500);
}

/**
 * Abrir modal para actualizar estado de alerta
 */
function abrirModalAlerta(alertaId, nombrePaciente) {
    alertaSeleccionada = alertasData.find(a => a.id === alertaId);
    
    if (!alertaSeleccionada) {
        alert('Error: No se encontró la alerta');
        return;
    }
    
    document.getElementById('modal-paciente-nombre').textContent = nombrePaciente;
    document.getElementById('modal-nuevo-estado').value = alertaSeleccionada.estado;
    document.getElementById('modal-notas').value = '';
    
    document.getElementById('modal-accion-alerta').classList.remove('hidden');
}

/**
 * Cerrar modal de alerta
 */
function cerrarModalAlerta() {
    document.getElementById('modal-accion-alerta').classList.add('hidden');
    alertaSeleccionada = null;
}

/**
 * Guardar estado actualizado de alerta
 */
async function guardarEstadoAlerta() {
    if (!alertaSeleccionada) return;
    
    const nuevoEstado = document.getElementById('modal-nuevo-estado').value;
    const notas = document.getElementById('modal-notas').value;
    
    console.log('💾 Actualizando estado de alerta:', {
        id: alertaSeleccionada.id,
        estado: nuevoEstado,
        notas: notas
    });
    
    // En producción, aquí se actualizaría la base de datos
    // Por ahora solo actualizamos localmente
    alertaSeleccionada.estado = nuevoEstado;
    
    // Actualizar UI
    actualizarUIAlertas();
    cerrarModalAlerta();
    
    // Mostrar notificación
    mostrarNotificacion('Estado actualizado correctamente', 'success');
}

/**
 * Mostrar notificación temporal
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const notif = document.createElement('div');
    notif.className = `fixed top-20 right-4 ${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in flex items-center gap-3`;
    notif.innerHTML = `
        <i class="fas ${iconos[tipo]} text-xl"></i>
        <span class="font-semibold">${mensaje}</span>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('animate-slide-out');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Exportar funciones al objeto window
window.cargarAlertas = cargarAlertas;
window.aplicarFiltrosAlertas = aplicarFiltrosAlertas;
window.filtrarCriticos = filtrarCriticos;
window.verDetalleAlerta = verDetalleAlerta;
window.abrirModalAlerta = abrirModalAlerta;
window.cerrarModalAlerta = cerrarModalAlerta;
window.guardarEstadoAlerta = guardarEstadoAlerta;

console.log('✅ Módulo de alertas cargado correctamente');
