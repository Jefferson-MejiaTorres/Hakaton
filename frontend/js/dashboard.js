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
        '#registrar': 'view-registrar',
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
            
            // Cerrar loading
            loadingModal.remove();
            
            // Mostrar modal de éxito
            mostrarModalExito(ninoCreado, imc);
            
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

// Modal de éxito
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
            const ultimaMedicion = Array.isArray(paciente.mediciones_antropometricas) && paciente.mediciones_antropometricas.length > 0 
                ? paciente.mediciones_antropometricas[0] 
                : {};
            const datosSocio = Array.isArray(paciente.datos_sociodemograficos) && paciente.datos_sociodemograficos.length > 0 
                ? paciente.datos_sociodemograficos[0] 
                : {};
            const ultimaPrediccion = Array.isArray(paciente.predicciones) && paciente.predicciones.length > 0 
                ? paciente.predicciones[0] 
                : {};
            
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
    
    const ultimaMedicion = Array.isArray(paciente.mediciones_antropometricas) && paciente.mediciones_antropometricas.length > 0 
        ? paciente.mediciones_antropometricas[0] 
        : null;
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <h3 class="text-2xl font-bold">Detalles del Paciente</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6 space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-500 mb-1">Nombre Completo</h4>
                        <p class="text-lg text-gray-900">${paciente.nombre} ${paciente.apellido}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-gray-500 mb-1">Fecha de Nacimiento</h4>
                        <p class="text-lg text-gray-900">${new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-gray-500 mb-1">Sexo</h4>
                        <p class="text-lg text-gray-900">${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-gray-500 mb-1">Documento</h4>
                        <p class="text-lg text-gray-900">${paciente.documento_identidad || 'No registrado'}</p>
                    </div>
                </div>
                
                ${ultimaMedicion ? `
                    <div class="border-t pt-6">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">Última Medición</h4>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Peso</p>
                                <p class="text-2xl font-bold text-blue-600">${ultimaMedicion.peso} kg</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Talla</p>
                                <p class="text-2xl font-bold text-green-600">${ultimaMedicion.talla} cm</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">IMC</p>
                                <p class="text-2xl font-bold text-purple-600">${ultimaMedicion.imc || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                ` : '<p class="text-gray-500 italic">No hay mediciones registradas</p>'}
                
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cerrar
                    </button>
                    <button onclick="editarPaciente(${paciente.id}); this.closest('.fixed').remove();" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-edit mr-2"></i>Editar
                    </button>
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

// Exportar funciones al scope global
window.verDetallePaciente = verDetallePaciente;
window.editarPaciente = editarPaciente;
window.confirmarEliminar = confirmarEliminar;

// Inicializar
setupFiltros();
