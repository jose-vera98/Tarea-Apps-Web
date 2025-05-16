document.addEventListener('DOMContentLoaded', function () {
	// --- Region y Comuna ---
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');

    const comunasPorRegion = {
        'RM': ['Santiago', 'Ñuñoa', 'La Reina', 'Providencia'],
        'V': ['Valparaíso', 'Viña del Mar', 'Concón']
        // Agrega más si quieres
    };

    regionSelect.addEventListener('change', function () {
        const region = regionSelect.value;
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (comunasPorRegion[region]) {
            comunasPorRegion[region].forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });

    // --- Contacto ---
    const contactarPor = document.getElementById('contactar_por');
    const contactoExtra = document.getElementById('contacto_extra');

    contactarPor.addEventListener('change', function () {
        contactoExtra.innerHTML = '';
        if (this.value) {
            const label = document.createElement('label');
            label.textContent = 'ID o URL de contacto:';
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'contacto_id';
            input.minLength = 4;
            input.maxLength = 50;
            contactoExtra.appendChild(label);
            contactoExtra.appendChild(document.createElement('br'));
            contactoExtra.appendChild(input);
        }
    });

	// --- Tema ---
    const tema = document.getElementById('tema');
    const temaOtro = document.getElementById('tema_otro');

    tema.addEventListener('change', function () {
        temaOtro.innerHTML = '';
        if (this.value === 'otro') {
            const label = document.createElement('label');
            label.textContent = 'Describa el tema:';
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'tema_otro';
            input.minLength = 3;
            input.maxLength = 15;
            temaOtro.appendChild(label);
            temaOtro.appendChild(document.createElement('br'));
            temaOtro.appendChild(input);
        }
    });

	// --- Fotos ---
	const botonAgregarFoto = document.getElementById('agregar-foto');
	const contenedorFotos = document.getElementById('fotos');

	botonAgregarFoto.addEventListener('click', function () {
		const actuales = contenedorFotos.querySelectorAll('input[type="file"]');
		if (actuales.length >= 5) return;

		const nuevoInput = document.createElement('input');
		nuevoInput.type = 'file';
		nuevoInput.name = 'foto[]';
		nuevoInput.accept = 'image/*';
		contenedorFotos.appendChild(document.createElement('br'));
		contenedorFotos.appendChild(nuevoInput);

		// Oculta el botón si ya hay 5
		if (contenedorFotos.querySelectorAll('input[type="file"]').length >= 5) {
			botonAgregarFoto.style.display = 'none';
		}
	});
});




// --- Validaciones del formulario ---
const form = document.getElementById('form-actividad');
const confirmacion = document.getElementById('confirmacion');
const mensajeFinal = document.getElementById('mensaje-final');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita envío por defecto

    // 1. Validaciones manuales
    let errores = [];

    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const inicio = document.getElementById('inicio').value;
    const termino = document.getElementById('termino').value;
    const tema = document.getElementById('tema').value;
    const fotos = document.querySelectorAll('input[type="file"]');

    // Validaciones
    if (!region) errores.push("Debe seleccionar una región.");
    if (!comuna) errores.push("Debe seleccionar una comuna.");
    if (!nombre || nombre.length > 200) errores.push("Nombre es obligatorio y máximo 200 caracteres.");
    if (!email || email.length > 100 || !/^\S+@\S+\.\S+$/.test(email)) errores.push("Email no válido.");
    if (!inicio) errores.push("Debe ingresar fecha y hora de inicio.");
    if (termino && (new Date(termino) <= new Date(inicio))) {
        errores.push("La fecha de término debe ser mayor a la de inicio.");
    }
    if (!tema) errores.push("Debe seleccionar un tema.");

    if (tema === 'otro') {
        const otroInput = document.querySelector('input[name="tema_otro"]');
        if (!otroInput || otroInput.value.length < 3 || otroInput.value.length > 15) {
            errores.push("Tema 'otro' debe tener entre 3 y 15 caracteres.");
        }
    }

    if (fotos.length < 1 || fotos.length > 5) {
        errores.push("Debe subir entre 1 y 5 fotos.");
    }

    // Mostrar errores o continuar
    if (errores.length > 0) {
        alert("Errores:\n" + errores.join("\n"));
        return;
    }

    // Oculta formulario, muestra confirmación
    form.style.display = 'none';
    confirmacion.style.display = 'block';
});

// --- Botones de confirmación ---
document.getElementById('confirmar-si').addEventListener('click', function () {
    confirmacion.style.display = 'none';
    mensajeFinal.style.display = 'block';
});

document.getElementById('confirmar-no').addEventListener('click', function () {
    confirmacion.style.display = 'none';
    form.style.display = 'block';
});
