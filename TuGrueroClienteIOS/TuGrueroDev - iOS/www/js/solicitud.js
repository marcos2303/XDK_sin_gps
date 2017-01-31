var datos = {
	"idSolicitud": "",
	"idGrua": "",
	"Nombre": "",
	"Placa": "",
	"Modelo": "",
	"Color": "",
	"Celular": "",
	"Latitud": "",
	"Longitud": ""
};


var moreMSN;
var timeOutSol;

function enviarSolicitud() {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Conectando",
		"mensaje": "Enviando Solicitud, espere mientras se completa el proceso",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cancelar solicitud', ''],
		"onClick": ["", "", "cancelarSolicitud(true)", ""]
	};

	genericPop(parametros);
	moreMSN = 0;
	sendSolicitud();
}



function sendSolicitud() {

	solicitud.Modelo = misDatos.Modelo;
	console.log("Se comentó: solicitud.Modelo");
	AjaxCall("solicitudCliente.php", solicitud, validarSolicitud, errorSolicitud);

}



function validarSolicitud(respuesta) {
	console.log(respuesta);
	if (respuesta.idSolicitud !== 'null') {
		datos.idSolicitud = respuesta.idSolicitud;
		console.log(datos.idSolicitud);
		esperandoPorGrua();
		timeOutSol = setTimeout(TimeOutSolicitud, 135000);
		//setTimeout(function(){ alert("tres segundos"); }, 60000); //con data integrada

		localStorage.solicitud = JSON.stringify(solicitud);
		localStorage.datos = JSON.stringify(datos); // Guardando datos
		localStorage.Etapa = 'esperandoPorGrua';

	}
}

function RetomarSolicitud() {

	datos = JSON.parse(localStorage.datos);
	solicitud = JSON.parse(localStorage.solicitud);
	misDatos = JSON.parse(localStorage.misDatos);
	params = JSON.parse(localStorage.params);
	parSolicitud = JSON.parse(localStorage.parSolicitud);

	var botones = document.getElementsByName('btn-add');
	$(botones[1]).addClass('collapsed');

	var textos = document.getElementById("reumen-textos").getElementsByTagName('p');
	textos[0].innerHTML = params.Cedula;
	textos[1].innerHTML = params.Placa;
	textos[2].innerHTML = misDatos.Marca;
	textos[3].innerHTML = misDatos.Modelo;
	textos[4].innerHTML = parSolicitud.QueOcurre;
	textos[5].innerHTML = solicitud.Direccion;
	showResumen();
	$('#cell-contacto').val(solicitud.CellContacto);
	$('#comentarios-add').val(solicitud.InfoAdicional);
	myNextBtn = $('#btn-solicitar');
	myNextBtn.attr('value', 'No');
	myNextBtn.attr('disabled', 'disabled');
	avanzarGeneric('#resumen');

	esperandoPorGrua();
	timeOutSol = setTimeout(TimeOutSolicitud, 135000);
}



function errorSolicitud(error) {
	console.log(error);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};

	genericPop(parametros);
}



function cancelarSolicitud(showM) {
	clearTimeout(callInterval);
	clearTimeout(timeOutSol);

	AjaxCall("cancelarSolicitud.php", datos, checkCancelarSolicitud, errorCancelarSolicitud,showM);

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Stop",
		"mensaje": "Cancelando solicitud, espere mientras se completa el proceso.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Abortar', ''],
		"onClick": ["", "", "Abortar()", ""]
	};

	if (showM)
		genericPop(parametros);

}


function checkCancelarSolicitud(data, showM) {
	console.log(data);
	localStorage.Etapa = "resumen";
	if (data.Fallo !== undefined) {
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Alerta",
			"mensaje": data.Fallo,
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Continuar'],
			"onClick": ["", "", "", "obtenerDatos()"]
		};

		genericPop(parametros);

	} else if (showM) {

		closePops();
	}
}




function errorCancelarSolicitud(error) {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'inline', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i> Call Center', '', 'Cancelar solicitud', 'Continuar'],
		"onClick": ["llamarCallCenter()", "", "cancelarSolicitud(true)", "esperandoPorGrua()"]

	};
	genericPop(parametros);

}



function esperandoPorGrua() {

	console.log("esperandoGrua");
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Logon",
		"mensaje": mEsperandoSol.Inicio,
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cancelar solicitud', ''],
		"onClick": ["", "", "cancelarSolicitud(true)", ""]
	};

	genericPop(parametros);
	callInterval = setTimeout(verificarEstatus, 20000); //Ciclo para verficar servicio
}




function verificarEstatus() {

	AjaxCall("checkSolicitud.php", datos, checkStatus, errorStatus);

}

function checkStatus(respuesta) {
	console.log(respuesta);

	if (respuesta.Estatus === "Localizando") {
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Logon",
			"mensaje": (moreMSN === 0) ? MensajeEspera(1) : (moreMSN === 1) ? MensajeEspera(2) : MensajeEspera(1),
			"displaybarra": ['block'],
			"displaysBotones": ['none', 'none', 'inline', 'none'],
			"text": ['', '', 'Cancelar solicitud', ''],
			"onClick": ["", "", "cancelarSolicitud(true)", ""]
		};

		genericPop(parametros);
		callInterval = setTimeout(verificarEstatus, 20000);
	}

	if (respuesta.Estatus === "Asignado") {
		clearTimeout(callInterval);
		clearTimeout(timeOutSol);
		obtenerDatos();
	}

	if (respuesta.Estatus === "Desierto") {
		clearTimeout(callInterval);
		clearTimeout(timeOutSol);
		desierto();
	}
}

function MensajeEspera(msnID) {
	console.log(msnID);
	var myMsn = (moreMSN === 0) ? mEsperandoSol.Inicio : (moreMSN === 1) ? mEsperandoSol.OpcionA : mEsperandoSol.OpcionB;
	console.log(myMsn);
	moreMSN = msnID;
	return myMsn;
}

function desierto() {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Callcenter",
		"mensaje": "No se encontraron grueros disponibles en esta búsqueda, por favor solicite una grúa nuevamente.",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['Solicitar', '', '', '<i class="icon icon-llamar2"></i> Call Center'],
		"onClick": ["closePops()", "", "", "llamarCallCenter()"]
	};
	genericPop(parametros);
}


function TimeOutSolicitud() {

	clearTimeout(callInterval);
	cancelarSolicitud(false);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Alerta",
		"mensaje": "No se pudo ubicar una grúa para asistirlo, puede solicitar una nueva grúa.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'inline'],
		"text": ['', '', 'Cancelar', 'Solicitar nueva grúa'],
		"onClick": ["", "", "closePops()", "enviarSolicitud()"]
	};
	genericPop(parametros);

}



function errorStatus(error) {
	console.log(error);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i> Call Center', '', '', 'Reintertar'],
		"onClick": ["llamarCallCenter()", "", "", "esperandoPorGrua()"]
	};

	genericPop(parametros);
	//alert("Ha ocurrido un error en verificarEstatus()");
}





//Buscando parámetros del gruero.
function obtenerDatos() {
	buscandoDatos();
	AjaxCall("gruaDatos.php", datos, datosGrua, errorBusqueda);

}

function buscandoDatos() {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Stop",
		"mensaje": "Obteniendo los datos del Gruero.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Abortar', ''],
		"onClick": ["", "", "Abortar()", ""]
	};
	genericPop(parametros);
}

function datosGrua(data) {


	var id = datos.idSolicitud;
	datos = data;
	datos.idSolicitud = id;

	localStorage.datos = JSON.stringify(datos);
	console.log(data);

	//console.log(datos);
	iniciarServicio();

}


function errorBusqueda(error) {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i>Call Center', '', '', 'Reintertar'],
		"onClick": ["llamarCallCenter()", "", "", "buscandoDatos()"]

	};

	genericPop(parametros);
}


function mostrarTaxi() {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Callcenter",
		"mensaje": "<p style=text-align:left;>Puede solicitar un servicio de taxi llamando a nuestro call center, solo si:</p><p style=text-align:left;>- Son 3 o más personas en el vehículo.</p><p style=text-align:left;>- Se encuentra con niño/s menores de 10 años en el vehículo (obligatorio)</p><p style=text-align:left;>",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i> Call Center', '', '', 'Aceptar'],
		"onClick": ["llamarCallCenter()", "", "", "closePops()"]
	};
	genericPop(parametros);
}



function iniciarServicio() {
	closePops();
	mostrarServicio();
}

/*
function AbortarServicio() {
	alert("AbortarServicio: falta codigo");

}
*/