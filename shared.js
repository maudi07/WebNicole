// Lógica principal de LunaConta
const CLAVE_CUENTAS = "contaPastel_cuentas";
const CLAVE_ASIENTOS = "contaPastel_asientos";
const CLAVE_EMPRESA = "lunaconta_empresa";

const empresaInicial = {
  nombre: "Mi empresa",
  rfc: "",
  domicilio: "",
  periodo: "Periodo actual",
  periodoInicio: "",
  periodoFin: "",
  responsable: ""
};

const cuentasIniciales = [
  { codigo: "1001", nombre: "Caja", tipo: "Activo", subtipo: "", naturaleza: "Deudora" },
  { codigo: "1002", nombre: "Bancos", tipo: "Activo", subtipo: "", naturaleza: "Deudora" },
  { codigo: "1003", nombre: "Clientes", tipo: "Activo", subtipo: "", naturaleza: "Deudora" },
  { codigo: "1004", nombre: "Documentos por cobrar", tipo: "Activo", subtipo: "", naturaleza: "Deudora" },
  { codigo: "1005", nombre: "Almacén", tipo: "Activo", subtipo: "", naturaleza: "Deudora" },
  { codigo: "2001", nombre: "Proveedores", tipo: "Pasivo", subtipo: "", naturaleza: "Acreedora" },
  { codigo: "2002", nombre: "Documentos por pagar", tipo: "Pasivo", subtipo: "", naturaleza: "Acreedora" },
  { codigo: "2003", nombre: "Acreedores diversos", tipo: "Pasivo", subtipo: "", naturaleza: "Acreedora" },
  { codigo: "3001", nombre: "Capital social", tipo: "Capital", subtipo: "", naturaleza: "Acreedora" },
  { codigo: "4001", nombre: "Ventas", tipo: "Ingreso", subtipo: "", naturaleza: "Acreedora" },
  { codigo: "4002", nombre: "Ingresos por servicios", tipo: "Ingreso", subtipo: "", naturaleza: "Acreedora" },
  { codigo: "4101", nombre: "Productos financieros", tipo: "Ingreso", subtipo: "Otros ingresos", naturaleza: "Acreedora" },
  { codigo: "4102", nombre: "Otros productos", tipo: "Ingreso", subtipo: "Otros ingresos", naturaleza: "Acreedora" },
  { codigo: "5001", nombre: "Sueldos de ventas", tipo: "Gasto", subtipo: "Gastos de venta", naturaleza: "Deudora" },
  { codigo: "5002", nombre: "Publicidad", tipo: "Gasto", subtipo: "Gastos de venta", naturaleza: "Deudora" },
  { codigo: "5003", nombre: "Fletes sobre venta", tipo: "Gasto", subtipo: "Gastos de venta", naturaleza: "Deudora" },
  { codigo: "5101", nombre: "Sueldos de administración", tipo: "Gasto", subtipo: "Gastos de administración", naturaleza: "Deudora" },
  { codigo: "5102", nombre: "Renta", tipo: "Gasto", subtipo: "Gastos de administración", naturaleza: "Deudora" },
  { codigo: "5103", nombre: "Luz e internet", tipo: "Gasto", subtipo: "Gastos de administración", naturaleza: "Deudora" },
  { codigo: "5201", nombre: "Gastos financieros", tipo: "Gasto", subtipo: "Otros gastos", naturaleza: "Deudora" },
  { codigo: "5202", nombre: "Pérdida cambiaria", tipo: "Gasto", subtipo: "Otros gastos", naturaleza: "Deudora" }
];

document.addEventListener("DOMContentLoaded", function () {
  prepararDatosIniciales();
  prepararMenu();

  const pagina = document.body.dataset.page;

  if (pagina === "inicio") iniciarInicio();
  if (pagina === "catalogo") iniciarCatalogo();
  if (pagina === "transacciones") iniciarTransacciones();
  if (pagina === "diario") iniciarDiario();
  if (pagina === "mayor") iniciarMayor();
  if (pagina === "balanza") iniciarBalanza();
  if (pagina === "balance") iniciarBalance();
  if (pagina === "estados") iniciarResultadoIntegral();
});

function prepararDatosIniciales() {
  if (!localStorage.getItem(CLAVE_CUENTAS)) {
    guardarCuentas(cuentasIniciales);
  }

  if (!localStorage.getItem(CLAVE_ASIENTOS)) {
    guardarAsientos([]);
  }

  if (!localStorage.getItem(CLAVE_EMPRESA)) {
    guardarEmpresa(empresaInicial);
  }
}

function prepararMenu() {
  const pagina = document.body.dataset.page;
  const links = document.querySelectorAll(".menu a");
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  links.forEach(function (link) {
    if (link.dataset.link === pagina) {
      link.classList.add("activo");
    }
  });

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }
}

function obtenerEmpresa() {
  return JSON.parse(localStorage.getItem(CLAVE_EMPRESA)) || empresaInicial;
}

function guardarEmpresa(empresa) {
  localStorage.setItem(CLAVE_EMPRESA, JSON.stringify(empresa));
}

function obtenerTextoPeriodoEmpresa(empresa) {
  const inicio = empresa.periodoInicio || "";
  const fin = empresa.periodoFin || "";

  if (inicio && fin) {
    return "Periodo del " + formatearFechaCorta(inicio) + " al " + formatearFechaCorta(fin);
  }

  if (inicio) {
    return "Periodo desde " + formatearFechaCorta(inicio);
  }

  if (fin) {
    return "Periodo hasta " + formatearFechaCorta(fin);
  }

  return empresa.periodo || "Periodo actual";
}

function formatearFechaCorta(fecha) {
  if (!fecha) return "";

  const partes = fecha.split("-");
  if (partes.length !== 3) return fecha;

  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function obtenerCuentas() {
  return JSON.parse(localStorage.getItem(CLAVE_CUENTAS)) || [];
}

function guardarCuentas(cuentas) {
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
}

function obtenerAsientos() {
  return JSON.parse(localStorage.getItem(CLAVE_ASIENTOS)) || [];
}

function guardarAsientos(asientos) {
  localStorage.setItem(CLAVE_ASIENTOS, JSON.stringify(asientos));
}

function buscarCuenta(codigo) {
  return obtenerCuentas().find(function (cuenta) {
    return cuenta.codigo === codigo;
  });
}

function dinero(numero) {
  const valor = Number(numero) || 0;
  return valor.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN"
  });
}

function numero(valor) {
  return Number(valor) || 0;
}

function mostrarMensaje(elemento, texto, tipo) {
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.className = "mensaje " + (tipo || "");
}

function crearFilaVacia(colspan, texto) {
  return `<tr><td colspan="${colspan}" class="empty">${texto}</td></tr>`;
}

function ordenarCuentas(cuentas) {
  return cuentas.slice().sort(function (a, b) {
    return a.codigo.localeCompare(b.codigo);
  });
}

function ordenarAsientos(asientos) {
  return asientos.slice().sort(function (a, b) {
    return a.fecha.localeCompare(b.fecha);
  });
}

function obtenerMovimientos() {
  const asientos = obtenerAsientos();
  let movimientos = [];

  asientos.forEach(function (asiento) {
    asiento.movimientos.forEach(function (movimiento) {
      movimientos.push({
        id: asiento.id,
        fecha: asiento.fecha,
        descripcion: asiento.descripcion,
        codigo: movimiento.codigo,
        nombre: movimiento.nombre,
        debe: numero(movimiento.debe),
        haber: numero(movimiento.haber)
      });
    });
  });

  return movimientos;
}

function resumenPorCuenta() {
  const cuentas = obtenerCuentas();
  const movimientos = obtenerMovimientos();

  return cuentas.map(function (cuenta) {
    const movs = movimientos.filter(function (mov) {
      return mov.codigo === cuenta.codigo;
    });

    const debe = movs.reduce(function (suma, mov) {
      return suma + mov.debe;
    }, 0);

    const haber = movs.reduce(function (suma, mov) {
      return suma + mov.haber;
    }, 0);

    const diferencia = debe - haber;
    const saldoDeudor = diferencia > 0 ? diferencia : 0;
    const saldoAcreedor = diferencia < 0 ? Math.abs(diferencia) : 0;
    const saldoNormal = cuenta.naturaleza === "Deudora" ? debe - haber : haber - debe;

    return {
      cuenta: cuenta,
      debe: debe,
      haber: haber,
      saldoDeudor: saldoDeudor,
      saldoAcreedor: saldoAcreedor,
      saldoNormal: saldoNormal,
      movimientos: movs
    };
  });
}

function saldoParaReporte(cuenta) {
  const resumen = resumenPorCuenta().find(function (item) {
    return item.cuenta.codigo === cuenta.codigo;
  });

  if (!resumen) return 0;

  if (cuenta.tipo === "Activo" || cuenta.tipo === "Gasto") {
    return resumen.debe - resumen.haber;
  }

  return resumen.haber - resumen.debe;
}

function calcularResultadoPeriodo() {
  const cuentas = obtenerCuentas();
  let ingresos = 0;
  let gastos = 0;

  cuentas.forEach(function (cuenta) {
    const saldo = saldoParaReporte(cuenta);

    if (cuenta.tipo === "Ingreso") {
      ingresos += saldo;
    }

    if (cuenta.tipo === "Gasto") {
      gastos += saldo;
    }
  });

  return ingresos - gastos;
}

function crearOpcionesCuentas() {
  const cuentas = ordenarCuentas(obtenerCuentas());
  let opciones = `<option value="">Selecciona una cuenta</option>`;

  cuentas.forEach(function (cuenta) {
    opciones += `<option value="${cuenta.codigo}">${cuenta.codigo} - ${cuenta.nombre}</option>`;
  });

  return opciones;
}

// Datos de la empresa
function prepararFormularioEmpresa() {
  const form = document.getElementById("formEmpresa");
  if (!form) return;

  const empresa = obtenerEmpresa();
  document.getElementById("empresaNombre").value = empresa.nombre || "";
  document.getElementById("empresaRfc").value = empresa.rfc || "";
  document.getElementById("empresaDomicilio").value = empresa.domicilio || "";
  document.getElementById("empresaPeriodoInicio").value = empresa.periodoInicio || "";
  document.getElementById("empresaPeriodoFin").value = empresa.periodoFin || "";
  document.getElementById("empresaResponsable").value = empresa.responsable || "";
  actualizarVistaEmpresa();

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nuevaEmpresa = {
      nombre: document.getElementById("empresaNombre").value.trim() || "Mi empresa",
      rfc: document.getElementById("empresaRfc").value.trim(),
      domicilio: document.getElementById("empresaDomicilio").value.trim(),
      periodoInicio: document.getElementById("empresaPeriodoInicio").value,
      periodoFin: document.getElementById("empresaPeriodoFin").value,
      responsable: document.getElementById("empresaResponsable").value.trim()
    };

    nuevaEmpresa.periodo = obtenerTextoPeriodoEmpresa(nuevaEmpresa);

    guardarEmpresa(nuevaEmpresa);
    actualizarVistaEmpresa();
    mostrarMensaje(document.getElementById("mensajeEmpresa"), "Datos de empresa guardados correctamente.", "ok");
  });
}

function actualizarVistaEmpresa() {
  const vista = document.getElementById("empresaVista");
  if (!vista) return;

  const empresa = obtenerEmpresa();
  vista.innerHTML = `
    <strong>${limpiarTextoHTML(empresa.nombre || "Mi empresa")}</strong>
    <span>${limpiarTextoHTML(obtenerTextoPeriodoEmpresa(empresa))}</span>
    <span>${empresa.rfc ? "RFC: " + limpiarTextoHTML(empresa.rfc) : "RFC no capturado"}</span>
  `;
}

// Inicio
function iniciarInicio() {
  prepararFormularioEmpresa();

  const cuentas = obtenerCuentas();
  const asientos = obtenerAsientos();
  const movimientos = obtenerMovimientos();

  const totalDebe = movimientos.reduce(function (suma, mov) { return suma + mov.debe; }, 0);
  const totalHaber = movimientos.reduce(function (suma, mov) { return suma + mov.haber; }, 0);

  document.getElementById("totalCuentas").textContent = cuentas.length;
  document.getElementById("totalAsientos").textContent = asientos.length;
  document.getElementById("totalDebe").textContent = dinero(totalDebe);
  document.getElementById("totalHaber").textContent = dinero(totalHaber);

  const totalesBalance = obtenerTotalesBalance();
  document.getElementById("inicioActivo").textContent = dinero(totalesBalance.activo);
  document.getElementById("inicioPasivoCapital").textContent = dinero(totalesBalance.pasivoCapital);

  const mensaje = document.getElementById("inicioMensaje");
  if (Math.abs(totalesBalance.activo - totalesBalance.pasivoCapital) < 0.01) {
    mensaje.textContent = "Cuadra correctamente";
  } else {
    mensaje.textContent = "No cuadra todavía";
  }

  const tabla = document.getElementById("tablaInicio");
  const ultimos = ordenarAsientos(asientos).slice(-5).reverse();

  if (ultimos.length === 0) {
    tabla.innerHTML = crearFilaVacia(5, "Aún no hay asientos registrados.");
    return;
  }

  tabla.innerHTML = "";
  ultimos.forEach(function (asiento) {
    const debe = asiento.movimientos.reduce(function (suma, mov) { return suma + numero(mov.debe); }, 0);
    const haber = asiento.movimientos.reduce(function (suma, mov) { return suma + numero(mov.haber); }, 0);

    tabla.innerHTML += `
      <tr>
        <td>${asiento.fecha}</td>
        <td>${asiento.descripcion}</td>
        <td>${asiento.movimientos.length}</td>
        <td class="money">${dinero(debe)}</td>
        <td class="money">${dinero(haber)}</td>
      </tr>
    `;
  });
}

// Catálogo de cuentas
function iniciarCatalogo() {
  const form = document.getElementById("formCuenta");
  const buscar = document.getElementById("buscarCuenta");
  const btnReiniciar = document.getElementById("btnReiniciarCatalogo");

  pintarCatalogo();

  document.getElementById("tipoCuenta").addEventListener("change", sugerirNaturaleza);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const codigo = document.getElementById("codigoCuenta").value.trim();
    const nombre = document.getElementById("nombreCuenta").value.trim();
    const tipo = document.getElementById("tipoCuenta").value;
    const subtipo = document.getElementById("subtipoCuenta").value;
    const naturaleza = document.getElementById("naturalezaCuenta").value;
    const mensaje = document.getElementById("mensajeCuenta");

    if (!codigo || !nombre) {
      mostrarMensaje(mensaje, "Completa el código y el nombre de la cuenta.", "error");
      return;
    }

    const cuentas = obtenerCuentas();
    const existe = cuentas.some(function (cuenta) {
      return cuenta.codigo === codigo;
    });

    if (existe) {
      mostrarMensaje(mensaje, "Ya existe una cuenta con ese código.", "error");
      return;
    }

    cuentas.push({
      codigo: codigo,
      nombre: nombre,
      tipo: tipo,
      subtipo: subtipo,
      naturaleza: naturaleza
    });

    guardarCuentas(cuentas);
    form.reset();
    sugerirNaturaleza();
    pintarCatalogo();
    mostrarMensaje(mensaje, "Cuenta agregada correctamente.", "ok");
  });

  buscar.addEventListener("input", function () {
    pintarCatalogo(buscar.value);
  });

  btnReiniciar.addEventListener("click", function () {
    const seguro = confirm("Esto borrará cuentas y asientos guardados. ¿Deseas continuar?");
    if (!seguro) return;

    guardarCuentas(cuentasIniciales);
    guardarAsientos([]);
    pintarCatalogo();
    mostrarMensaje(document.getElementById("mensajeCuenta"), "Datos reiniciados correctamente.", "ok");
  });

  sugerirNaturaleza();
}

function sugerirNaturaleza() {
  const tipo = document.getElementById("tipoCuenta").value;
  const naturaleza = document.getElementById("naturalezaCuenta");

  if (tipo === "Activo" || tipo === "Gasto") {
    naturaleza.value = "Deudora";
  } else {
    naturaleza.value = "Acreedora";
  }
}

function pintarCatalogo(filtro) {
  const tabla = document.getElementById("tablaCatalogo");
  let cuentas = ordenarCuentas(obtenerCuentas());
  const texto = (filtro || "").toLowerCase();

  if (texto) {
    cuentas = cuentas.filter(function (cuenta) {
      return cuenta.codigo.toLowerCase().includes(texto) ||
        cuenta.nombre.toLowerCase().includes(texto) ||
        cuenta.tipo.toLowerCase().includes(texto) ||
        cuenta.subtipo.toLowerCase().includes(texto);
    });
  }

  if (cuentas.length === 0) {
    tabla.innerHTML = crearFilaVacia(6, "No se encontraron cuentas.");
    return;
  }

  tabla.innerHTML = "";
  cuentas.forEach(function (cuenta) {
    tabla.innerHTML += `
      <tr>
        <td><strong>${cuenta.codigo}</strong></td>
        <td>${cuenta.nombre}</td>
        <td><span class="badge blue">${cuenta.tipo}</span></td>
        <td>${cuenta.subtipo || "-"}</td>
        <td><span class="badge ${cuenta.naturaleza === "Deudora" ? "green" : "yellow"}">${cuenta.naturaleza}</span></td>
        <td><button class="remove-btn" onclick="eliminarCuenta('${cuenta.codigo}')">Eliminar</button></td>
      </tr>
    `;
  });
}

function eliminarCuenta(codigo) {
  const movimientos = obtenerMovimientos();
  const tieneMovimientos = movimientos.some(function (mov) {
    return mov.codigo === codigo;
  });

  if (tieneMovimientos) {
    alert("No puedes eliminar una cuenta que ya tiene movimientos registrados.");
    return;
  }

  const seguro = confirm("¿Eliminar esta cuenta del catálogo?");
  if (!seguro) return;

  const cuentas = obtenerCuentas().filter(function (cuenta) {
    return cuenta.codigo !== codigo;
  });

  guardarCuentas(cuentas);
  pintarCatalogo(document.getElementById("buscarCuenta").value);
}

// Registro de asientos
function iniciarTransacciones() {
  const fecha = document.getElementById("fechaAsiento");
  const form = document.getElementById("formAsiento");

  fecha.valueAsDate = new Date();
  agregarMovimiento();
  agregarMovimiento();

  document.getElementById("btnAgregarMovimiento").addEventListener("click", agregarMovimiento);
  document.getElementById("btnLimpiarAsiento").addEventListener("click", limpiarAsiento);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    guardarAsientoNuevo();
  });
}

function agregarMovimiento() {
  const tabla = document.getElementById("tablaMovimientos");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>
      <select class="movimiento-select cuenta-mov" required>
        ${crearOpcionesCuentas()}
      </select>
    </td>
    <td><input class="input-small debe-mov" type="number" min="0" step="0.01" value="0"></td>
    <td><input class="input-small haber-mov" type="number" min="0" step="0.01" value="0"></td>
    <td><button type="button" class="remove-btn">X</button></td>
  `;

  tabla.appendChild(fila);

  fila.querySelector(".remove-btn").addEventListener("click", function () {
    fila.remove();
    calcularTotalesAsiento();
  });

  fila.querySelectorAll("input, select").forEach(function (elemento) {
    elemento.addEventListener("input", calcularTotalesAsiento);
    elemento.addEventListener("change", calcularTotalesAsiento);
  });

  calcularTotalesAsiento();
}

function calcularTotalesAsiento() {
  const debeInputs = document.querySelectorAll(".debe-mov");
  const haberInputs = document.querySelectorAll(".haber-mov");
  let debe = 0;
  let haber = 0;

  debeInputs.forEach(function (input) {
    debe += numero(input.value);
  });

  haberInputs.forEach(function (input) {
    haber += numero(input.value);
  });

  document.getElementById("totalDebeAsiento").textContent = dinero(debe);
  document.getElementById("totalHaberAsiento").textContent = dinero(haber);

  const mensaje = document.getElementById("mensajeAsiento");
  if (debe === 0 && haber === 0) {
    mostrarMensaje(mensaje, "Captura movimientos en debe y haber.", "");
  } else if (Math.abs(debe - haber) < 0.01) {
    mostrarMensaje(mensaje, "El asiento cuadra correctamente.", "ok");
  } else {
    mostrarMensaje(mensaje, "El asiento no cuadra. El Debe y el Haber deben ser iguales.", "error");
  }
}

function guardarAsientoNuevo() {
  const fecha = document.getElementById("fechaAsiento").value;
  const descripcion = document.getElementById("descripcionAsiento").value.trim();
  const filas = document.querySelectorAll("#tablaMovimientos tr");
  const mensaje = document.getElementById("mensajeAsiento");

  let movimientos = [];
  let totalDebe = 0;
  let totalHaber = 0;
  let hayError = false;

  if (!fecha || !descripcion) {
    mostrarMensaje(mensaje, "Captura la fecha y la descripción.", "error");
    return;
  }

  filas.forEach(function (fila) {
    const codigo = fila.querySelector(".cuenta-mov").value;
    const debe = numero(fila.querySelector(".debe-mov").value);
    const haber = numero(fila.querySelector(".haber-mov").value);

    if (!codigo && debe === 0 && haber === 0) {
      return;
    }

    if (!codigo) {
      hayError = true;
      return;
    }

    if (debe > 0 && haber > 0) {
      hayError = true;
      return;
    }

    if (debe === 0 && haber === 0) {
      hayError = true;
      return;
    }

    const cuenta = buscarCuenta(codigo);

    movimientos.push({
      codigo: codigo,
      nombre: cuenta ? cuenta.nombre : "Cuenta no encontrada",
      debe: debe,
      haber: haber
    });

    totalDebe += debe;
    totalHaber += haber;
  });

  if (hayError) {
    mostrarMensaje(mensaje, "Revisa los movimientos: cada línea debe tener cuenta y solo Debe o solo Haber.", "error");
    return;
  }

  if (movimientos.length < 2) {
    mostrarMensaje(mensaje, "Un asiento debe tener mínimo dos movimientos.", "error");
    return;
  }

  if (Math.abs(totalDebe - totalHaber) >= 0.01) {
    mostrarMensaje(mensaje, "No se guardó. El total del Debe debe ser igual al total del Haber.", "error");
    return;
  }

  const asientos = obtenerAsientos();
  asientos.push({
    id: Date.now(),
    fecha: fecha,
    descripcion: descripcion,
    movimientos: movimientos
  });

  guardarAsientos(asientos);
  limpiarAsiento();
  mostrarMensaje(mensaje, "Asiento guardado correctamente.", "ok");
}

function limpiarAsiento() {
  document.getElementById("descripcionAsiento").value = "";
  document.getElementById("fechaAsiento").valueAsDate = new Date();
  document.getElementById("tablaMovimientos").innerHTML = "";
  agregarMovimiento();
  agregarMovimiento();
  calcularTotalesAsiento();
}

// Libro diario
function iniciarDiario() {
  const contenedor = document.getElementById("contenedorDiario");
  const asientos = ordenarAsientos(obtenerAsientos());

  if (asientos.length === 0) {
    contenedor.innerHTML = `<section class="card empty">Aún no hay asientos registrados.</section>`;
    return;
  }

  contenedor.innerHTML = "";

  asientos.forEach(function (asiento, indiceAsiento) {
    const totalDebe = asiento.movimientos.reduce(function (suma, mov) {
      return suma + numero(mov.debe);
    }, 0);

    const totalHaber = asiento.movimientos.reduce(function (suma, mov) {
      return suma + numero(mov.haber);
    }, 0);

    let filas = "";

    asiento.movimientos.forEach(function (movimiento) {
      const esAbono = numero(movimiento.haber) > 0;
      filas += `
        <tr>
          <td>
            <strong class="account-name ${esAbono ? "abono-name" : ""}">${movimiento.nombre}</strong>
            <span class="account-code">${movimiento.codigo}</span>
          </td>
          <td class="money amount-debit">${movimiento.debe > 0 ? dinero(movimiento.debe) : "—"}</td>
          <td class="money amount-credit">${movimiento.haber > 0 ? dinero(movimiento.haber) : "—"}</td>
        </tr>
      `;
    });

    contenedor.innerHTML += `
      <article class="journal-card">
        <div class="journal-head">
          <div>
            <span class="journal-label">Asiento ${indiceAsiento + 1}</span>
            <h2>${asiento.descripcion}</h2>
            <p>${asiento.fecha}</p>
          </div>
          <div class="journal-info">
            <span>Partida #${asiento.id}</span>
            <strong>${asiento.movimientos.length} movimientos</strong>
          </div>
        </div>

        <div class="journal-body">
          <div class="table-wrap simple-scroll">
            <table class="journal-table">
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Debe</th>
                  <th>Haber</th>
                </tr>
              </thead>
              <tbody>${filas}</tbody>
              <tfoot>
                <tr>
                  <th>Totales</th>
                  <th class="money amount-debit">${dinero(totalDebe)}</th>
                  <th class="money amount-credit">${dinero(totalHaber)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </article>
    `;
  });
}

// Libro mayor
function iniciarMayor() {
  const contenedor = document.getElementById("contenedorMayor");
  const resumen = resumenPorCuenta().filter(function (item) {
    return item.movimientos.length > 0;
  });

  if (resumen.length === 0) {
    contenedor.innerHTML = `<section class="card empty">Aún no hay movimientos para mostrar en el libro mayor.</section>`;
    return;
  }

  contenedor.innerHTML = "";

  resumen.forEach(function (item) {
    let saldo = 0;
    let filas = "";
    const totalDebe = item.debe;
    const totalHaber = item.haber;
    const saldoFinal = item.cuenta.naturaleza === "Deudora" ? totalDebe - totalHaber : totalHaber - totalDebe;

    item.movimientos
      .sort(function (a, b) { return a.fecha.localeCompare(b.fecha); })
      .forEach(function (mov) {
        if (item.cuenta.naturaleza === "Deudora") {
          saldo += mov.debe - mov.haber;
        } else {
          saldo += mov.haber - mov.debe;
        }

        filas += `
          <tr>
            <td>${mov.fecha}</td>
            <td>${mov.descripcion}</td>
            <td class="money amount-debit">${mov.debe > 0 ? dinero(mov.debe) : "—"}</td>
            <td class="money amount-credit">${mov.haber > 0 ? dinero(mov.haber) : "—"}</td>
            <td class="money ${saldo < 0 ? "amount-credit" : ""}">${dinero(saldo)}</td>
          </tr>
        `;
      });

    contenedor.innerHTML += `
      <article class="ledger-card">
        <div class="ledger-head ledger-head-modern">
          <div>
            <h2>${item.cuenta.nombre}</h2>
            <p>${item.cuenta.codigo} · ${item.cuenta.tipo} · ${item.cuenta.naturaleza}</p>
          </div>
          <div class="ledger-balance">
            <span>Saldo</span>
            <strong>${dinero(saldoFinal)}</strong>
          </div>
        </div>
        <div class="table-wrap simple-scroll">
          <table class="ledger-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Debe</th>
                <th>Haber</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
            <tfoot>
              <tr>
                <th colspan="2">Totales</th>
                <th class="money amount-debit">${dinero(totalDebe)}</th>
                <th class="money amount-credit">${dinero(totalHaber)}</th>
                <th class="money">${dinero(saldoFinal)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </article>
    `;
  });
}

// Balanza de comprobación
function iniciarBalanza() {
  const tabla = document.getElementById("tablaBalanza");
  const resumen = resumenPorCuenta().filter(function (item) {
    return item.debe > 0 || item.haber > 0;
  });

  let totalDebe = 0;
  let totalHaber = 0;
  let totalSaldoDeudor = 0;
  let totalSaldoAcreedor = 0;

  if (resumen.length === 0) {
    tabla.innerHTML = crearFilaVacia(6, "No hay movimientos registrados.");
    return;
  }

  tabla.innerHTML = "";

  resumen.forEach(function (item) {
    totalDebe += item.debe;
    totalHaber += item.haber;
    totalSaldoDeudor += item.saldoDeudor;
    totalSaldoAcreedor += item.saldoAcreedor;

    tabla.innerHTML += `
      <tr>
        <td><strong>${item.cuenta.codigo}</strong></td>
        <td>${item.cuenta.nombre}</td>
        <td class="money">${dinero(item.debe)}</td>
        <td class="money">${dinero(item.haber)}</td>
        <td class="money">${item.saldoDeudor ? dinero(item.saldoDeudor) : "-"}</td>
        <td class="money">${item.saldoAcreedor ? dinero(item.saldoAcreedor) : "-"}</td>
      </tr>
    `;
  });

  document.getElementById("balanzaDebe").textContent = dinero(totalDebe);
  document.getElementById("balanzaHaber").textContent = dinero(totalHaber);
  document.getElementById("balanzaSaldoDeudor").textContent = dinero(totalSaldoDeudor);
  document.getElementById("balanzaSaldoAcreedor").textContent = dinero(totalSaldoAcreedor);

  const mensaje = document.getElementById("mensajeBalanza");
  if (Math.abs(totalDebe - totalHaber) < 0.01 && Math.abs(totalSaldoDeudor - totalSaldoAcreedor) < 0.01) {
    mostrarMensaje(mensaje, "La balanza cuadra correctamente.", "ok");
  } else {
    mostrarMensaje(mensaje, "La balanza no cuadra. Revisa los asientos registrados.", "error");
  }
}

// Balance general
function iniciarBalance() {
  const totales = obtenerTotalesBalance();

  pintarListaReporte("listaActivo", "Activo");
  pintarListaReporte("listaPasivo", "Pasivo");
  pintarListaReporte("listaCapital", "Capital", true);

  document.getElementById("totalActivo").textContent = dinero(totales.activo);
  document.getElementById("totalPasivo").textContent = dinero(totales.pasivo);
  document.getElementById("totalCapital").textContent = dinero(totales.capital);
  document.getElementById("totalPasivoCapital").textContent = dinero(totales.pasivoCapital);

  const mensaje = document.getElementById("mensajeBalance");
  const diferencia = totales.activo - totales.pasivoCapital;

  if (Math.abs(diferencia) < 0.01) {
    mostrarMensaje(mensaje, "Correcto: Activo = Pasivo + Capital.", "ok");
  } else {
    mostrarMensaje(mensaje, "Diferencia: " + dinero(diferencia) + ". Revisa si faltan asientos o cuentas.", "error");
  }
}

function obtenerTotalesBalance() {
  const cuentas = obtenerCuentas();
  let activo = 0;
  let pasivo = 0;
  let capital = 0;
  const resultado = calcularResultadoPeriodo();

  cuentas.forEach(function (cuenta) {
    const saldo = saldoParaReporte(cuenta);

    if (cuenta.tipo === "Activo") activo += saldo;
    if (cuenta.tipo === "Pasivo") pasivo += saldo;
    if (cuenta.tipo === "Capital") capital += saldo;
  });

  // El resultado del periodo se suma al capital para comprobar el balance.
  capital += resultado;

  return {
    activo: activo,
    pasivo: pasivo,
    capital: capital,
    pasivoCapital: pasivo + capital,
    resultado: resultado
  };
}

function pintarListaReporte(idElemento, tipo, incluirResultado) {
  const contenedor = document.getElementById(idElemento);
  const cuentas = ordenarCuentas(obtenerCuentas()).filter(function (cuenta) {
    return cuenta.tipo === tipo;
  });

  let html = "";
  let hayDatos = false;

  cuentas.forEach(function (cuenta) {
    const saldo = saldoParaReporte(cuenta);
    if (Math.abs(saldo) < 0.01) return;

    hayDatos = true;
    html += `
      <div class="report-row">
        <span>${cuenta.codigo} - ${cuenta.nombre}</span>
        <strong>${dinero(saldo)}</strong>
      </div>
    `;
  });

  if (incluirResultado) {
    const resultado = calcularResultadoPeriodo();
    if (Math.abs(resultado) >= 0.01) {
      hayDatos = true;
      html += `
        <div class="report-row">
          <span>Utilidad o pérdida del periodo</span>
          <strong>${dinero(resultado)}</strong>
        </div>
      `;
    }
  }

  if (!hayDatos) {
    html = `<div class="report-row"><span>Sin movimientos</span><strong>${dinero(0)}</strong></div>`;
  }

  contenedor.innerHTML = html;
}

// Estado de resultado integral
function iniciarResultadoIntegral() {
  const ingresos = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Ingreso" && cuenta.subtipo === "";
  });

  const otrosIngresos = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Ingreso" && cuenta.subtipo === "Otros ingresos";
  });

  const costoVentas = obtenerCategoriaResultado(function (cuenta) {
    return cuentaEsCostoDeVentas(cuenta);
  });

  const gastosVenta = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Gasto" && cuenta.subtipo === "Gastos de venta" && !cuentaEsCostoDeVentas(cuenta);
  });

  const gastosAdmin = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Gasto" && cuenta.subtipo === "Gastos de administración";
  });

  const otrosGastos = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Gasto" && cuenta.subtipo === "Otros gastos" && !cuentaEsCostoDeVentas(cuenta);
  });

  const totalIngresos = ingresos.total + otrosIngresos.total;
  const totalCostosGastos = costoVentas.total + gastosVenta.total + gastosAdmin.total + otrosGastos.total;
  const utilidadBruta = ingresos.total - costoVentas.total;
  const utilidadOperacion = utilidadBruta - gastosVenta.total - gastosAdmin.total;
  const utilidadAntesImpuestos = utilidadOperacion + otrosIngresos.total - otrosGastos.total;
  const utilidadNeta = utilidadAntesImpuestos;
  const margen = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;

  document.getElementById("resumenIngresos").textContent = dinero(totalIngresos);
  document.getElementById("resumenGastos").textContent = dinero(totalCostosGastos);

  const contenedor = document.getElementById("resultadoIntegralVista");
  contenedor.innerHTML = `
    ${crearTarjetaResultado("Ingresos", ingresos.total, ingresos.items, "income")}
    ${crearTarjetaResultado("Costo de ventas", costoVentas.total, costoVentas.items, "expense")}

    <div class="formula-card">Ventas - Costo de ventas =</div>

    ${crearTarjetaResultado("Otros ingresos", otrosIngresos.total, otrosIngresos.items, "income soft")}
    ${crearTarjetaResultado("Gastos de venta", gastosVenta.total, gastosVenta.items, "expense soft")}
    ${crearTarjetaResultado("Gastos de administración", gastosAdmin.total, gastosAdmin.items, "expense soft")}
    ${crearTarjetaResultado("Otros gastos", otrosGastos.total, otrosGastos.items, "expense soft")}

    <article class="utility-card">
      <span>Utilidad bruta</span>
      <strong>${dinero(utilidadBruta)}</strong>
    </article>

    <article class="utility-card">
      <span>Utilidad de operación</span>
      <strong>${dinero(utilidadOperacion)}</strong>
    </article>

    <article class="utility-card">
      <span>Utilidad antes de impuestos</span>
      <strong>${dinero(utilidadAntesImpuestos)}</strong>
    </article>

    <article class="utility-card final">
      <div>
        <span>${utilidadNeta >= 0 ? "Utilidad neta" : "Pérdida neta"}</span>
        <strong>${dinero(utilidadNeta)}</strong>
      </div>
      <div class="margin-box">
        <span>Margen neto</span>
        <strong>${margen.toFixed(1)}%</strong>
      </div>
    </article>
  `;
}

function cuentaEsCostoDeVentas(cuenta) {
  const nombre = cuenta.nombre.toLowerCase();
  return cuenta.tipo === "Gasto" && (cuenta.subtipo === "Costo de ventas" || nombre.includes("costo"));
}

function obtenerCategoriaResultado(filtro) {
  const cuentas = ordenarCuentas(obtenerCuentas()).filter(filtro);
  let total = 0;
  let items = [];

  cuentas.forEach(function (cuenta) {
    const saldo = saldoParaReporte(cuenta);
    if (Math.abs(saldo) < 0.01) return;

    total += saldo;
    items.push({
      codigo: cuenta.codigo,
      nombre: cuenta.nombre,
      saldo: saldo
    });
  });

  return {
    total: total,
    items: items
  };
}

function crearTarjetaResultado(titulo, total, items, clase) {
  let filas = "";

  if (items.length === 0) {
    filas = `<div class="result-item empty-line"><span>Sin movimientos</span><strong>${dinero(0)}</strong></div>`;
  } else {
    items.forEach(function (item) {
      filas += `
        <div class="result-item">
          <div>
            <strong>${item.nombre}</strong>
            <span>${item.codigo}</span>
          </div>
          <strong>${dinero(item.saldo)}</strong>
        </div>
      `;
    });
  }

  return `
    <article class="result-section ${clase}">
      <div class="result-section-head">
        <h2>${titulo}</h2>
        <strong>${dinero(total)}</strong>
      </div>
      <div class="result-section-body">
        ${filas}
      </div>
    </article>
  `;
}


// Generación de reportes para imprimir o guardar como PDF
function generarPDF(tipoReporte) {
  const empresa = obtenerEmpresa();
  const titulo = obtenerTituloReporte(tipoReporte);
  const contenido = crearContenidoPDF(tipoReporte);
  const fecha = new Date().toLocaleDateString("es-MX");
  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert("El navegador bloqueó la ventana del PDF. Permite ventanas emergentes para esta página.");
    return;
  }

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${limpiarTextoHTML(titulo)}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; margin: 28px; color: #1f2937; }
        .pdf-header { text-align: center; border-bottom: 3px solid #8e73d5; padding-bottom: 16px; margin-bottom: 24px; }
        .pdf-header h1 { margin: 0; font-size: 28px; color: #2f3343; }
        .pdf-header h2 { margin: 10px 0 6px; font-size: 20px; color: #8e73d5; }
        .pdf-header p { margin: 3px 0; color: #606b80; font-size: 13px; }
        .pdf-info { display: flex; justify-content: space-between; gap: 12px; margin: 12px 0 22px; font-size: 13px; color: #606b80; }
        .pdf-section { margin-bottom: 24px; page-break-inside: avoid; }
        .pdf-section h3 { margin: 0 0 10px; padding: 9px 12px; background: #f0e9ff; color: #3b3156; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
        th, td { border: 1px solid #d9d4df; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #fbf7ff; color: #4b445e; text-transform: uppercase; font-size: 11px; }
        tfoot th, tfoot td { background: #f2fbf6; font-weight: bold; }
        .right { text-align: right; white-space: nowrap; }
        .total-box { display: flex; justify-content: space-between; padding: 10px 12px; margin-top: 8px; border-radius: 8px; background: #f7f2ff; font-weight: bold; }
        .grand { background: #eaf8ff; }
        .result-box { padding: 12px; border: 1px solid #d9d4df; border-radius: 10px; margin-top: 10px; }
        .ok { color: #2b7a4b; font-weight: bold; }
        .error { color: #a64242; font-weight: bold; }
        .firma { margin-top: 50px; display: flex; justify-content: center; }
        .firma div { width: 260px; border-top: 1px solid #555; text-align: center; padding-top: 8px; color: #606b80; }
        @page { margin: 18mm; }
        @media print { body { margin: 0; } button { display: none; } }
      </style>
    </head>
    <body>
      <header class="pdf-header">
        <h1>${limpiarTextoHTML(empresa.nombre || "Mi empresa")}</h1>
        <h2>${limpiarTextoHTML(titulo)}</h2>
        <p>${limpiarTextoHTML(obtenerTextoPeriodoEmpresa(empresa))}</p>
        ${empresa.rfc ? `<p>RFC: ${limpiarTextoHTML(empresa.rfc)}</p>` : ""}
        ${empresa.domicilio ? `<p>${limpiarTextoHTML(empresa.domicilio)}</p>` : ""}
      </header>
      <div class="pdf-info">
        <span>Fecha de elaboración: ${fecha}</span>
        <span>Generado en LunaConta</span>
      </div>
      ${contenido}
      ${empresa.responsable ? `<div class="firma"><div>${limpiarTextoHTML(empresa.responsable)}<br>Responsable</div></div>` : ""}
      <script>
        window.onload = function () {
          setTimeout(function () { window.print(); }, 300);
        };
      <\/script>
    </body>
    </html>
  `);

  ventana.document.close();
}

function obtenerTituloReporte(tipoReporte) {
  if (tipoReporte === "catalogo") return "Catálogo de cuentas";
  if (tipoReporte === "diario") return "Libro diario";
  if (tipoReporte === "mayor") return "Libro mayor";
  if (tipoReporte === "balanza") return "Balanza de comprobación";
  if (tipoReporte === "balance") return "Balance general";
  if (tipoReporte === "estados") return "Estado de resultado integral";
  return "Reporte contable";
}

function crearContenidoPDF(tipoReporte) {
  if (tipoReporte === "catalogo") return pdfCatalogo();
  if (tipoReporte === "diario") return pdfDiario();
  if (tipoReporte === "mayor") return pdfMayor();
  if (tipoReporte === "balanza") return pdfBalanza();
  if (tipoReporte === "balance") return pdfBalanceGeneral();
  if (tipoReporte === "estados") return pdfResultadoIntegral();
  return `<p>No se encontró información para este reporte.</p>`;
}

function limpiarTextoHTML(texto) {
  return String(texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pdfCatalogo() {
  const cuentas = ordenarCuentas(obtenerCuentas());
  let filas = "";

  cuentas.forEach(function (cuenta) {
    filas += `
      <tr>
        <td>${limpiarTextoHTML(cuenta.codigo)}</td>
        <td>${limpiarTextoHTML(cuenta.nombre)}</td>
        <td>${limpiarTextoHTML(cuenta.tipo)}</td>
        <td>${limpiarTextoHTML(cuenta.subtipo || "-")}</td>
        <td>${limpiarTextoHTML(cuenta.naturaleza)}</td>
      </tr>
    `;
  });

  return `
    <section class="pdf-section">
      <h3>Cuentas registradas</h3>
      <table>
        <thead><tr><th>Código</th><th>Cuenta</th><th>Tipo</th><th>Subtipo</th><th>Naturaleza</th></tr></thead>
        <tbody>${filas || `<tr><td colspan="5">Sin cuentas registradas.</td></tr>`}</tbody>
      </table>
    </section>
  `;
}

function pdfDiario() {
  const asientos = ordenarAsientos(obtenerAsientos());
  if (asientos.length === 0) return `<p>No hay asientos registrados.</p>`;

  let html = "";
  asientos.forEach(function (asiento, indice) {
    let filas = "";
    let totalDebe = 0;
    let totalHaber = 0;

    asiento.movimientos.forEach(function (mov) {
      totalDebe += numero(mov.debe);
      totalHaber += numero(mov.haber);
      filas += `
        <tr>
          <td>${limpiarTextoHTML(mov.codigo)}</td>
          <td>${limpiarTextoHTML(mov.nombre)}</td>
          <td class="right">${mov.debe > 0 ? dinero(mov.debe) : "-"}</td>
          <td class="right">${mov.haber > 0 ? dinero(mov.haber) : "-"}</td>
        </tr>
      `;
    });

    html += `
      <section class="pdf-section">
        <h3>Asiento ${indice + 1}: ${limpiarTextoHTML(asiento.descripcion)}</h3>
        <p><strong>Fecha:</strong> ${limpiarTextoHTML(asiento.fecha)} &nbsp; <strong>Partida:</strong> ${limpiarTextoHTML(asiento.id)}</p>
        <table>
          <thead><tr><th>Código</th><th>Cuenta</th><th>Debe</th><th>Haber</th></tr></thead>
          <tbody>${filas}</tbody>
          <tfoot><tr><th colspan="2">Totales</th><th class="right">${dinero(totalDebe)}</th><th class="right">${dinero(totalHaber)}</th></tr></tfoot>
        </table>
      </section>
    `;
  });

  return html;
}

function pdfMayor() {
  const resumen = resumenPorCuenta().filter(function (item) {
    return item.movimientos.length > 0;
  });

  if (resumen.length === 0) return `<p>No hay movimientos registrados.</p>`;

  let html = "";
  resumen.forEach(function (item) {
    let saldo = 0;
    let filas = "";
    const saldoFinal = item.cuenta.naturaleza === "Deudora" ? item.debe - item.haber : item.haber - item.debe;

    item.movimientos
      .sort(function (a, b) { return a.fecha.localeCompare(b.fecha); })
      .forEach(function (mov) {
        if (item.cuenta.naturaleza === "Deudora") {
          saldo += mov.debe - mov.haber;
        } else {
          saldo += mov.haber - mov.debe;
        }

        filas += `
          <tr>
            <td>${limpiarTextoHTML(mov.fecha)}</td>
            <td>${limpiarTextoHTML(mov.descripcion)}</td>
            <td class="right">${mov.debe > 0 ? dinero(mov.debe) : "-"}</td>
            <td class="right">${mov.haber > 0 ? dinero(mov.haber) : "-"}</td>
            <td class="right">${dinero(saldo)}</td>
          </tr>
        `;
      });

    html += `
      <section class="pdf-section">
        <h3>${limpiarTextoHTML(item.cuenta.codigo)} - ${limpiarTextoHTML(item.cuenta.nombre)}</h3>
        <p><strong>Tipo:</strong> ${limpiarTextoHTML(item.cuenta.tipo)} &nbsp; <strong>Naturaleza:</strong> ${limpiarTextoHTML(item.cuenta.naturaleza)} &nbsp; <strong>Saldo final:</strong> ${dinero(saldoFinal)}</p>
        <table>
          <thead><tr><th>Fecha</th><th>Descripción</th><th>Debe</th><th>Haber</th><th>Saldo</th></tr></thead>
          <tbody>${filas}</tbody>
          <tfoot><tr><th colspan="2">Totales</th><th class="right">${dinero(item.debe)}</th><th class="right">${dinero(item.haber)}</th><th class="right">${dinero(saldoFinal)}</th></tr></tfoot>
        </table>
      </section>
    `;
  });

  return html;
}

function pdfBalanza() {
  const resumen = resumenPorCuenta().filter(function (item) {
    return item.debe > 0 || item.haber > 0;
  });

  let totalDebe = 0;
  let totalHaber = 0;
  let totalSaldoDeudor = 0;
  let totalSaldoAcreedor = 0;
  let filas = "";

  resumen.forEach(function (item) {
    totalDebe += item.debe;
    totalHaber += item.haber;
    totalSaldoDeudor += item.saldoDeudor;
    totalSaldoAcreedor += item.saldoAcreedor;

    filas += `
      <tr>
        <td>${limpiarTextoHTML(item.cuenta.codigo)}</td>
        <td>${limpiarTextoHTML(item.cuenta.nombre)}</td>
        <td class="right">${dinero(item.debe)}</td>
        <td class="right">${dinero(item.haber)}</td>
        <td class="right">${item.saldoDeudor ? dinero(item.saldoDeudor) : "-"}</td>
        <td class="right">${item.saldoAcreedor ? dinero(item.saldoAcreedor) : "-"}</td>
      </tr>
    `;
  });

  const cuadra = Math.abs(totalDebe - totalHaber) < 0.01 && Math.abs(totalSaldoDeudor - totalSaldoAcreedor) < 0.01;

  return `
    <section class="pdf-section">
      <table>
        <thead><tr><th>Código</th><th>Cuenta</th><th>Debe</th><th>Haber</th><th>Saldo deudor</th><th>Saldo acreedor</th></tr></thead>
        <tbody>${filas || `<tr><td colspan="6">Sin movimientos registrados.</td></tr>`}</tbody>
        <tfoot><tr><th colspan="2">Totales</th><th class="right">${dinero(totalDebe)}</th><th class="right">${dinero(totalHaber)}</th><th class="right">${dinero(totalSaldoDeudor)}</th><th class="right">${dinero(totalSaldoAcreedor)}</th></tr></tfoot>
      </table>
      <p class="${cuadra ? "ok" : "error"}">${cuadra ? "La balanza cuadra correctamente." : "La balanza no cuadra."}</p>
    </section>
  `;
}

function pdfBalanceGeneral() {
  const totales = obtenerTotalesBalance();
  const activo = crearFilasReportePDF("Activo");
  const pasivo = crearFilasReportePDF("Pasivo");
  const capital = crearFilasReportePDF("Capital", true);
  const diferencia = totales.activo - totales.pasivoCapital;

  return `
    <section class="pdf-section">
      <h3>Activo</h3>
      <table><tbody>${activo || `<tr><td>Sin movimientos</td><td class="right">${dinero(0)}</td></tr>`}</tbody></table>
      <div class="total-box"><span>Total activo</span><strong>${dinero(totales.activo)}</strong></div>
    </section>
    <section class="pdf-section">
      <h3>Pasivo</h3>
      <table><tbody>${pasivo || `<tr><td>Sin movimientos</td><td class="right">${dinero(0)}</td></tr>`}</tbody></table>
      <div class="total-box"><span>Total pasivo</span><strong>${dinero(totales.pasivo)}</strong></div>
    </section>
    <section class="pdf-section">
      <h3>Capital</h3>
      <table><tbody>${capital || `<tr><td>Sin movimientos</td><td class="right">${dinero(0)}</td></tr>`}</tbody></table>
      <div class="total-box"><span>Total capital</span><strong>${dinero(totales.capital)}</strong></div>
      <div class="total-box grand"><span>Pasivo + Capital</span><strong>${dinero(totales.pasivoCapital)}</strong></div>
      <p class="${Math.abs(diferencia) < 0.01 ? "ok" : "error"}">${Math.abs(diferencia) < 0.01 ? "Correcto: Activo = Pasivo + Capital." : "Diferencia: " + dinero(diferencia)}</p>
    </section>
  `;
}

function crearFilasReportePDF(tipo, incluirResultado) {
  const cuentas = ordenarCuentas(obtenerCuentas()).filter(function (cuenta) {
    return cuenta.tipo === tipo;
  });

  let filas = "";
  cuentas.forEach(function (cuenta) {
    const saldo = saldoParaReporte(cuenta);
    if (Math.abs(saldo) < 0.01) return;
    filas += `<tr><td>${limpiarTextoHTML(cuenta.codigo)} - ${limpiarTextoHTML(cuenta.nombre)}</td><td class="right">${dinero(saldo)}</td></tr>`;
  });

  if (incluirResultado) {
    const resultado = calcularResultadoPeriodo();
    if (Math.abs(resultado) >= 0.01) {
      filas += `<tr><td>Utilidad o pérdida del periodo</td><td class="right">${dinero(resultado)}</td></tr>`;
    }
  }

  return filas;
}

function pdfResultadoIntegral() {
  const ingresos = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Ingreso" && cuenta.subtipo === "";
  });

  const otrosIngresos = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Ingreso" && cuenta.subtipo === "Otros ingresos";
  });

  const costoVentas = obtenerCategoriaResultado(function (cuenta) {
    return cuentaEsCostoDeVentas(cuenta);
  });

  const gastosVenta = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Gasto" && cuenta.subtipo === "Gastos de venta" && !cuentaEsCostoDeVentas(cuenta);
  });

  const gastosAdmin = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Gasto" && cuenta.subtipo === "Gastos de administración";
  });

  const otrosGastos = obtenerCategoriaResultado(function (cuenta) {
    return cuenta.tipo === "Gasto" && cuenta.subtipo === "Otros gastos" && !cuentaEsCostoDeVentas(cuenta);
  });

  const totalIngresos = ingresos.total + otrosIngresos.total;
  const utilidadBruta = ingresos.total - costoVentas.total;
  const utilidadOperacion = utilidadBruta - gastosVenta.total - gastosAdmin.total;
  const utilidadAntesImpuestos = utilidadOperacion + otrosIngresos.total - otrosGastos.total;
  const utilidadNeta = utilidadAntesImpuestos;
  const margen = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;

  return `
    ${crearSeccionResultadoPDF("Ingresos", ingresos)}
    ${crearSeccionResultadoPDF("Costo de ventas", costoVentas)}
    <div class="total-box"><span>Utilidad bruta</span><strong>${dinero(utilidadBruta)}</strong></div>
    ${crearSeccionResultadoPDF("Otros ingresos", otrosIngresos)}
    ${crearSeccionResultadoPDF("Gastos de venta", gastosVenta)}
    ${crearSeccionResultadoPDF("Gastos de administración", gastosAdmin)}
    ${crearSeccionResultadoPDF("Otros gastos", otrosGastos)}
    <section class="pdf-section result-box">
      <div class="total-box"><span>Utilidad de operación</span><strong>${dinero(utilidadOperacion)}</strong></div>
      <div class="total-box"><span>Utilidad antes de impuestos</span><strong>${dinero(utilidadAntesImpuestos)}</strong></div>
      <div class="total-box grand"><span>${utilidadNeta >= 0 ? "Utilidad neta" : "Pérdida neta"}</span><strong>${dinero(utilidadNeta)}</strong></div>
      <div class="total-box"><span>Margen neto</span><strong>${margen.toFixed(1)}%</strong></div>
    </section>
  `;
}

function crearSeccionResultadoPDF(titulo, datos) {
  let filas = "";

  datos.items.forEach(function (item) {
    filas += `<tr><td>${limpiarTextoHTML(item.codigo)} - ${limpiarTextoHTML(item.nombre)}</td><td class="right">${dinero(item.saldo)}</td></tr>`;
  });

  return `
    <section class="pdf-section">
      <h3>${limpiarTextoHTML(titulo)}</h3>
      <table>
        <tbody>${filas || `<tr><td>Sin movimientos</td><td class="right">${dinero(0)}</td></tr>`}</tbody>
        <tfoot><tr><th>Total ${limpiarTextoHTML(titulo.toLowerCase())}</th><th class="right">${dinero(datos.total)}</th></tr></tfoot>
      </table>
    </section>
  `;
}
