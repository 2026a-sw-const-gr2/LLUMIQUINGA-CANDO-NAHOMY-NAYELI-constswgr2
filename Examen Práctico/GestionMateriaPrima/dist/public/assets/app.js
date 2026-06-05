const API_URL = '/api/tasks';
let currentTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// 1. Cargar e inspeccionar los registros existentes
async function loadTasks() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error al cargar insumos:', error);
        alert(`No se pudo conectar con la API: ${error.message}`);
    }
}

// 2. Renderizar la tabla dinámicamente
function renderTasks(tasks) {
    const tbody = document.getElementById('tasks-list');
    if (!tbody) return;
    tbody.innerHTML = '';

    tasks.forEach(task => {
        const fecha = task.fecha_creacion
            ? new Date(task.fecha_creacion).toLocaleString()
            : new Date().toLocaleString();

        // Escapar caracteres para evitar rupturas de strings en el HTML inline de las funciones
        const tituloEscapado = task.titulo.replace(/'/g, "\\'");
        const descripcionEscapada = (task.descripcion || '').replace(/'/g, "\\'");

        tbody.innerHTML += `
            <tr id="row-${task.id}">
                <td style="padding: 8px; font-size: 12px; color: #666;">${task.id}</td>
                <td style="padding: 8px;"><strong>${task.titulo}</strong></td>
                <td style="padding: 8px;">${task.descripcion || 'Sin detalles'}</td>
                <td style="padding: 8px;"><u>${task.estado.toUpperCase()}</u></td>
                <td style="padding: 8px; font-size: 12px;">${fecha}</td>
                <td style="padding: 8px;">
                    <button type="button" onclick="editTask('${task.id}', '${tituloEscapado}', '${descripcionEscapada}', '${task.estado}')">Editar</button>
                    <button type="button" style="background-color: #ffdde1; border-color: #cca3a3;" onclick="deleteTask('${task.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// 3. ¡FUNCIÓN CRÍTICA CORREGIDA!: Guardar y Registrar en Planta
async function saveTask() {
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');
    const estadoSelect = document.getElementById('estado');

    if (!tituloInput || !estadoSelect) return;

    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput ? descripcionInput.value.trim() : '';
    const estado = estadoSelect.value;

    if (!titulo) {
        alert('Por favor, ingrese el nombre de la Orden de Producción o Insumo.');
        return;
    }

    // Estructuramos el payload que exigen los DTOs del backend (CreateTaskDto / UpdateTaskDto)
    const taskData = {
        titulo: titulo,
        descripcion: descripcion,
        estado: estado
    };

    try {
        let response;
        if (currentTaskId) {
            // Si hay un ID seleccionado, realizamos una actualización parcial (PATCH)
            response = await fetch(`${API_URL}/${currentTaskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        } else {
            // Si el ID está vacío, registramos una nueva orden (POST)
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        }

        if (response.ok) {
            clearForm();
            await loadTasks(); // Recargar la tabla con los datos frescos de SQLite
        } else {
            const errorMsg = await response.text();
            alert(`Error en el servidor (${response.status}): ${errorMsg}`);
        }
    } catch (error) {
        console.error('Error al procesar la operación:', error);
        alert(`Error de red o JS: ${error.message}`);
    }
}

// 4. Cargar datos de la fila al formulario para edición
function editTask(id, titulo, descripcion, estado) {
    currentTaskId = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('estado').value = estado;
    
    const btnGuardar = document.getElementById('btn-guardar');
    if (btnGuardar) btnGuardar.innerText = 'Actualizar Registro';
}

// 5. Eliminar registro físico
async function deleteTask(id) {
    if (!confirm('¿Seguro que desea eliminar este lote de control?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadTasks();
        } else {
            alert(`Error al eliminar: HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Error al eliminar registro:', error);
        alert(`Error al eliminar: ${error.message}`);
    }
}

// 6. Limpiar campos e inicializar estados del formulario
function clearForm() {
    currentTaskId = null;
    document.getElementById('titulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('estado').value = 'pendiente';
    
    const btnGuardar = document.getElementById('btn-guardar');
    if (btnGuardar) btnGuardar.innerText = 'Registrar en Planta';
}