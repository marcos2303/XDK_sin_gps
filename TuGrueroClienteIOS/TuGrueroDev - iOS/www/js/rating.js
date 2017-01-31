var ratings = {
	trato: 0,
	presencia: 0,
	vehiculo: 0
};


var encuestaFinal = {
	"idSolicitud": "",
	"TratoCordial": 0,
	"Presencia": 0,
	"TratoVehiculo": 0,
	"Puntual": "",
	"Observacion": "",
	"idGrua": "",
};


function openHelpEncuesta() {
	var parametros = {
		"popup": "pop-final",
		"imagen": "Star",
		"mensaje": "Por favor llene la encuesta cuando haya llegado a su destino.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Continuar'],
		"onClick": ["", "", "", "closePops()"]

	};

	genericPop(parametros);

}


function RemostrarRating() {
	datos = JSON.parse(localStorage.datos);
	solicitud = JSON.parse(localStorage.solicitud);
	misDatos = JSON.parse(localStorage.misDatos);
	params = JSON.parse(localStorage.params);
	parSolicitud = JSON.parse(localStorage.parSolicitud);
	avanzarGeneric('#rating');
	openHelpEncuesta(); //rating.js
}


function setRatin(elemento) {

	var mRating = $(elemento).val();
	var parent = $(elemento).parent(); //Grupo al cual pertenece
	var botones = $(parent).children(); //Todos los hijos del grupo
	setAll(botones, mRating);
	ratings[$(parent).attr('id')] = mRating;
}

function setAll(mBotones, rating) {
	for (var i = 0; i < rating; i++) {
		if ($(mBotones[i]).hasClass('btn-default'))
			genericChange(mBotones[i], 'btn-default', 'btn-warning', 'icon-star-empty', 'icon-star');
	}

	for (i = rating; i < mBotones.length; i++) {
		if ($(mBotones[i]).hasClass('btn-warning'))
			genericChange(mBotones[i], 'btn-warning', 'btn-default', 'icon-star', 'icon-star-empty');
	}
}

function genericChange(elemento, removeStyle, addStyle, removeGlyph, addGlyph) {
	$(elemento).removeClass(removeStyle);
	$(elemento).addClass(addStyle);
	$(elemento).children().removeClass(removeGlyph);
	$(elemento).children().addClass(addGlyph);
}




function enviarRatings() {
	var Error;

	for (var key in ratings) {
		if (ratings[key] === 0) {
			Error = true;
			break;
		}
	}
	if (Error) {
		mostrarError(key);
	} else {
		avanzarGeneric('#comentarios');
	}

}

function mostrarError(key) {


	var Tratados = {
		trato: 'Trato cordial del Gruero.',
		presencia: 'Presencia del Gruero.',
		vehiculo: 'Trato al vehículo.'
	};

	var parametros = {
		"popup": "pop-final",
		"imagen": "Stop",
		"mensaje": "Antes de continuar debe colocar una valoración en " + '"' + Tratados[key] + '"',
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'inline', 'none', 'none'],
		"text": ['', 'Aceptar', '', ''],
		"onClick": ["", "closePops()", "", ""]

	};

	genericPop(parametros);

}


var btnEncuesta = null;
var tiempoRespuesta = "";
var comentariosEncuesta = "";

function resetEncuesta() {
	if (btnEncuesta !== null) {
		$(btnEncuesta).css("background-color", '');
		$(btnEncuesta).css("color", '');
		btnEncuesta = null;
	}
}

function encuesta(boton) {
	encuestaFinal.Puntual = $(boton).val();
	$(boton).css('background-color', 'rgba(240,119,48,0.8)');
	$(boton).css('color', 'rgba(0,0,0,0.8)');
	if (boton !== btnEncuesta)
		resetEncuesta();
	btnEncuesta = boton;
}

function finalizar() {

	encuestaFinal.Observacion = $('#encuesta-coment').val();

	if (btnEncuesta === null) {
		encuestaIncompleta();
	} else {
		finalizacion();
	}
}

function finalizacion() {

	encuestaFinal.idSolicitud = datos.idSolicitud;
	encuestaFinal.TratoCordial = ratings.trato;
	encuestaFinal.Presencia = ratings.presencia;
	encuestaFinal.TratoVehiculo = ratings.vehiculo;
	encuestaFinal.idGrua = datos.idGrua;
	
	AjaxCall("finalizarServicio.php",encuestaFinal,finalizarApp,errorFinalizar);
	mostrarFinalizacion();
}

function finalizarApp(data) {
	console.log(data);
	
	if (data.Success === "OK") {
		forzarSalida();
	} else {
		var parametros = {
			"popup": "pop-final",
			"imagen": "Error",
			"mensaje": "Ha ocurrido un error, desea volver intentarlo",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'Forzar salida', 'Reintentar'],
			"onClick": ["", "", "forzarSalida()", "finalizacion()"]
		};

		genericPop(parametros);
	}
}



function errorFinalizar(error) {
	var parametros = {
		"popup": "pop-final",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'inline'],
		"text": ['', '', 'Forzar salida', 'Reintentar'],
		"onClick": ["", "", "forzarSalida()", "finalizacion()"]
	};

	genericPop(parametros);
}


function mostrarFinalizacion() {
	var parametros = {
		"popup": "pop-final",
		"imagen": "Conectando",
		"mensaje": "Finalizando, por favor espere mientras se completa la operación.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Abortar', ''],
		"onClick": ["", "", "Abortar()", ""]
	};

	genericPop(parametros);
}


function encuestaIncompleta() {
	var parametros = {
		"popup": "pop-final",
		"imagen": "Stop",
		"mensaje": "Debe responder la pregunta final antes de finalizar.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'inline', 'none', 'none'],
		"text": ['', 'Aceptar', '', ''],
		"onClick": ["", "closePops()", "", ""]
	};

	genericPop(parametros);
}