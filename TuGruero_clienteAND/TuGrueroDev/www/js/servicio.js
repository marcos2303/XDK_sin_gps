var servicioActivo = false;




function mostrarServicio() {

	localStorage.Etapa = "trayecto";
	activate_subpage('#trayecto');
	servicioActivo = true;

	var backs = document.getElementsByName('btn-bck');
	for (var b = 0; b < backs.length; b++)
		$(backs[b]).css('display', 'none');

	//grualatlng = new google.maps.LatLng(datos.Latitud, datos.Longitud);

	crearTrayecto();
	datosGruero();
	var parametros = {
		"popup": "pop-generic",
		"imagen": "GruaLoc",
		"mensaje": "<p><h3>Ya conseguimos un gruero disponible.</h3></p><p>En el mapa podrá ubicar la posición de la grúa asignada pulsando el botón correspondiente.</p>",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Continuar'],
		//"onClick": ["", "", "", "mostrarTaxi()"]
		"onClick": ["", "", "", "closePops()"]
		
	};

	genericPop(parametros);

}

function RemostrarServicio() {
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

	mostrarServicio();
	//clearInterval(callInterval);
	//callInterval = setTimeout(refrescarGrua, 2000);
	clearInterval(callInterval);
	setTimeout(refrescarGrua, 2000);

}



function datosGruero() {

	var textos = document.getElementById("datos-gruero").getElementsByTagName('p');
	textos[1].innerHTML = datos.Nombre+" "+datos.Apellido ;
	textos[3].innerHTML = datos.Placa;
	textos[5].innerHTML = datos.Modelo;
	textos[7].innerHTML = datos.Color;

	var boton = document.getElementById("btn-call-gruero");
	boton.innerHTML = '<i class="icon icon-llamar button-icon-left"></i>' + datos.Celular;
}



function crearTrayecto() {
	//setCarros();
	MakeTrayecto();

	callInterval = setTimeout(refrescarGrua, 30000);
}



function refrescarGrua() {

	var gruaID = {
		"idGrua": datos.idGrua,
		"idSolicitud": datos.idSolicitud
	};

	AjaxCall("gruaLoc.php", gruaID, gruaCheck, gruaError);

}



function gruaCheck(data) {

	grualatlng = new google.maps.LatLng(data.Latitud, data.Longitud);
	refreshGruaPos();
	console.log(data);

	switch (data.EstatusGrua) {
	case "Activo":
		callInterval = setTimeout(refrescarGrua, 25000);
		break;

	case "Asistiendo":
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Asistir",
			"mensaje": "El gruero ha indicado que ya lo está asistiendo, por favor confirme.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'No, aún no', 'Sí, correcto'],
			"onClick": ["", "", "rechazarAsistencia()", "confirmarAsistencia()"]
		};
		genericPop(parametros);
		break;

	case "Abandonado":
		servicioActivo = false;
		var paramet = {
			"popup": "pop-generic",
			"imagen": "Alerta",
			"mensaje": "El Gruero ha indicado que ya no puede continuar con el servicio.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'Finalizar', 'Solicitar otra grúa'],
			"onClick": ["", "", "resetApp()", "pedirOtraGrua()"]
		};
		genericPop(paramet);
		break;
	}
}




function pedirOtraGrua() {
	closePops();
	localStorage.Etapa = "pedirOtraGrua";
	activate_subpage('#resumen');
}


function gruaError(error) {
	console.log(error);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Alerta",
		"mensaje": (error.readyState === 0) ? msn.ErrorGrua : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i>Call Center', '', '', 'Reintentar'],
		"onClick": ["llamarCallCenter()", "", "", "ReintentarGrua()"]
	};
	genericPop(parametros);

}

function ReintentarGrua() {
	closePops();
	setTimeout(refrescarGrua, 15000);
}



function rechazarAsistencia() {
	callInterval = setTimeout(refrescarGrua, 30000);
	closePops();
}



function confirmarAsistencia() {

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Conectando",
		"mensaje": "Por favor espere mientras se completa el proceso de confirmación.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Abortar', ''],
		"onClick": ["", "", "Abortar()", ""]
	};
	genericPop(parametros);

	var servicioID = {
		"idSolicitud": datos.idSolicitud,
		"idGrua": datos.idGrua,

	};

	AjaxCall("confirmarAsistencia.php", servicioID, checkConfirmar, confirmarError);

}

function checkConfirmar(respuesta) {
	servicioActivo = false;
	if (respuesta.Error === undefined) {
		clearTimeout(callInterval);
		closePops();
		localStorage.Etapa = "rating";
		avanzarGeneric('#rating');
		//factivate_page('#Encuesta');
		openHelpEncuesta(); //rating.js
	} else {

		var parametros = {
			"popup": "pop-generic",
			"imagen": "Error",
			"mensaje": "No se pudo realizar la confirmarción, pulse el botón de reintentar para confirmar la asistencia.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'Cerrar', 'Reintentar'],
			"onClick": ["", "", "closePops()", "confirmarAsistencia()"]
		};
		genericPop(parametros);
	}
}

function confirmarError(error) {

	//	alert("Algo no funcionó bien, el sistema sigue activo" + errorData.responseText);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Reintentar'],
		"onClick": ["", "", "", "confirmarAsistencia()"]
	};
	genericPop(parametros);

}



function mostrarGrua(boton) {
	var CAMBIO = ($(boton).children().hasClass('icon-mostrar')) ? $(boton).children().removeClass('icon-mostrar').addClass('icon-ocultar') : $(boton).children().removeClass('icon-ocultar').addClass('icon-mostrar');
}

function localizar(boton) {
	var latlng = ($(boton).val() === "carro") ? carrolatlng : grualatlng;
	UbicarEnMapa(mapas.Trayecto, latlng);
	//ubicar(latlng);
}

function cancelarServicio() {

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Alto",
		"mensaje": "¿Está usted realmente seguro en interrumpir el servicio de grúa ya solicitado?",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'inline'],
		"text": ['', ',', 'Si, cancelar', 'No, continuar'],
		"onClick": ["", "", "cancelacion()", "closePops()"]

	};

	genericPop(parametros);
}

function cancelacion() {
	clearTimeout(callInterval);

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Conectando",
		"mensaje": "Espere mientras se procesa la cancelación del servicio de grúa.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Abortar', ''],
		"onClick": ["", "", "Abortar()", ""]

	};
	genericPop(parametros);


	var servicioID = {
		"idSolicitud": datos.idSolicitud,
	};

	AjaxCall("cancelarServicio.php", servicioID, checkCancelarServicio, cancelarServicioError);

}



function checkCancelarServicio(data) {

	if (data.Success === "OK") {
		servicioActivo = false;
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Alerta",
			"mensaje": "Se ha cancelado exitosamente el servicio.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'Finalizar', 'Solicitar otra grúa'],
			"onClick": ["", "", "resetApp()", "pedirOtraGrua()"]
		};
		genericPop(parametros);
	} else {
		alert("No se pudo ejecutar la acción, intente de nuevo");
		callInterval = setTimeout(refrescarGrua, 30000);

	}
}



function cancelarServicioError(error) {
	console.log(error);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.responseText === "") ? msn.ErrorConexion : error.responseText,
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i>Call Center', '', '', 'Reintentar'],
		"onClick": ["llamarCallCenter()", "", "", "cancelacion()"]
	};
	genericPop(parametros);

	//callInterval = setTimeout(refrescarGrua, 30000);
}