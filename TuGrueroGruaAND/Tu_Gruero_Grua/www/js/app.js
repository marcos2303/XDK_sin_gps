/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

var appVersion = "1.0.0";

var jqxhr = null; //Variable para envair consultas

var params = {
	"ID": "V",
	"Cedula": "",
	"Placa": "",
	"Clave": ""
};


var gruaParam = {
	"idGrua": "3",
	"mToken": "",
	"Nombre": "",
	"Celular": "",
	"Modelo": "",
	"Placa": "",
    "Estado": "Distrito capital",
	"Lat": "10.4921509",
	"Lng": "-66.8762886",
};

var datosCliente;
var modeloCarro = "";
var laSolicitud;

var mId;
var callInterval = null;
var selBtn = null;
var selOpt = null;

var media;
var misDatos;
var myNextBtn;

var selCat = null;

var backPage = '#home_grua';
var mlatlng = ""; //GPS origen corregido
var grualatlng = "";

var vistos = [false, false, false, false, false];

//localStorage['gruaParam'] = JSON.stringify(gruaParam);
//console.log(JSON.parse(localStorage['gruaParam']));


function Sonido() {
	try {
		media.play();
	} catch (e) {
		console.log("try failed:", e);
	}
}



//Administra la ventana de Adevertencia al inicio
function Advertencia(accion) {
	//snd.play();
	var mAccion = (accion === "open") ? function () {
		$("#popupEntrar").modal("show");
	} : function () {
		activate_page('#paginaApp');
		avanzarGeneric('#sub-terminos');
		$("#popupEntrar").modal("hide");
	};
	mAccion();

}

function Sesion() {

	console.log(localStorage.gruaParam, localStorage.appVersion);
	if (localStorage.gruaParam === undefined || localStorage.appVersion !== appVersion) {
		console.log("BORRADO");
		localStorage.clear();
		localStorage.appVersion = appVersion;
		localStorage.setItem('disponible', "NO");
		//activate_page('#ma');
		//avanzarGeneric('#legal');

	} else {
		//	localStorage.clear();
		gruaParam = JSON.parse(localStorage.gruaParam);
		var Name = document.getElementById("nombre-gruero"); //Venatana padre
		var mensaje = Name.getElementsByTagName('p');
		mensaje[0].innerHTML = gruaParam.Nombre;
		var Datos = document.getElementById("datos-grua");
		var contenido = Datos.getElementsByTagName('p');
		contenido[0].innerHTML = gruaParam.Placa;
		contenido[1].innerHTML = gruaParam.Modelo;
		contenido[2].innerHTML = gruaParam.Celular;

		Sincronizar();
	}
}



function Sincronizar() {
	switch (localStorage.Etapa) {
	case '#en_ruta':
		//	StartGPS();
		RetomarServicio();
		setTimeout(VerificarServicio, 30000);
		break;
	case '#a_destino':

		RetomarAsistir();
		setTimeout(VerificarServicio, 30000);
		break;

	default:
		avanzarGeneric('#home_grua');

		gruaParam = JSON.parse(localStorage.gruaParam);
		var Name = document.getElementById("nombre-gruero"); //Venatana padre
		var mensaje = Name.getElementsByTagName('p');
		mensaje[0].innerHTML = gruaParam.Nombre;
		var Datos = document.getElementById("datos-grua");
		var contenido = Datos.getElementsByTagName('p');
		contenido[0].innerHTML = gruaParam.Placa;
		contenido[1].innerHTML = gruaParam.Modelo;
		contenido[2].innerHTML = gruaParam.Celular;


		var disponible = localStorage.getItem('disponible');
		PreSelect(disponible);

		if (disponible === "SI") {

			var param = {
				"popup": "popupInico",
				"imagen": "Conectando",
				"mensaje": "Activando dispositivo en la plataforma, Por favor espere.",
				"displaybarra": ['Block'],
				"displaysBotones": ['none', 'none', 'none', 'inline'],
				"text": ['', '', '', 'Cerrar'],
				"onClick": ["", "", "", "closePops()"]

			};

			genericPop(param);
			GCM(true);
			//	StartGPS();
		}

	}
}


function checkTerminos() {

	if (localStorage.terminos === "Si") {
		avanzarGeneric("#datos_inicio");
	} else {

		var parametros = {
			"popup": "popupInico",
			"imagen": "Alto",
			"mensaje": "Debe aceptar los términos y condiciones legales para poder continuar.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "closePops()"],
		};

		genericPop(parametros);
	}
}


var termElem;

function aceptarTerminos(boton) {

	var elemento = boton.getElementsByTagName('i');
	termElem = elemento;
	if ($(elemento).hasClass('icon-opcion')) {
		$(elemento).removeClass('icon-opcion').addClass('icon-seleccionado');
		$('#btn-solicitar').attr('value', 'Si');
		localStorage.setItem('terminos', "Si");
		//	myNextBtn.removeAttr('disabled');

	} else {
		$(elemento).removeClass('icon-seleccionado').addClass('icon-opcion');
		$('#btn-solicitar').attr('value', 'No');
		localStorage.setItem('terminos', "No");

		//myNextBtn.attr('disabled', 'disabled');

	}

}



function GuardarSesion() {
	localStorage.appVersion = appVersion;
	localStorage.gruaParam = JSON.stringify(gruaParam);
}



function CerrarSesion() {

	if (localStorage.Etapa !== "#en_ruta") {

		var parametros = {
			"popup": "popupInico",
			"imagen": "Alto",
			"mensaje": "¿Desea cerrar sesión?",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'No, cancelar', 'Si, cerrar sesión'],
			"onClick": ["", "", "closePops()", "LogOut()"],
		};

		genericPop(parametros);
	} else {
		PreAbandonar();
	}
}


function LogOut() {

	var parametros = {
		"idGrua": gruaParam.idGrua,
		"UUID": device.uuid
	};

	AjaxCall("logoutGrua.php", parametros, SuccessLogOut, ErrorLogOut);


	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Por favor espere mientras se completa la operación.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};
	genericPop(param);


}



function SuccessLogOut(data) {
	if (data.Error === undefined) {
		StopGPS();
		closePops();
		localStorage.clear();
		gruaParam.mToken = "";
		$('#cedula').val("");
		$('#placa').val("");
		$('#clave').val("");
		$('#menu').addClass('oculto-head');


		if (termElem != undefined) {
			$(termElem).removeClass('icon-seleccionado').addClass('icon-opcion');
			$('#btn-solicitar').attr('value', 'No');
			localStorage.setItem('terminos', "No");
		}

		activate_page('#mainpage');
		activate_subpage('#page_inicio');
	}
}



function ErrorLogOut(error) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};
	genericPop(parametros);
}



//Asigna el tipo de ID al documento de identidad 
function cambiarId(id) {
	params.ID = id;
	$('#tipoID').html(id + " <span class=caret></span>");
}



function verificacion() {

	params.Cedula = params.ID + "-" + $('#cedula').val();
	params.Placa = $('#placa').val().toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
	params.Clave = $('#clave').val();
	params.UUID = device.uuid;
	console.log(params.UUID);
	var OK = cedulaCheck($('#cedula').val()) ? placaCheck(params.Placa, $('#placa').val()) ? ClaveCheck(params.Clave) ? preEnvio() : false : false : false;
}



function cedulaCheck(cedula) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (cedula.indexOf('.') < 0) ? $.isNumeric(cedula) ? (cedula.length > 5) ? "OK" : mCedula.Corta : mCedula.Numerica : mCedula.Signo;
	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}



function placaCheck(placa, original) {
	gruaParam.Placa = placa;
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};

	parametros.mensaje = (placa !== "") ? (placa.length > 5) ? (placa.length === original.length) ? "OK" : mPlaca.Formato : mPlaca.Corta : mPlaca.Vacia;
	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}



function ClaveCheck(clave) {

	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "Debe seleccionar su empresa de SEGUROS para continuar.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};
	parametros.mensaje = (clave !== "") ? (clave.length > 3) ? "OK" : mClave.Corta : mClave.Vacia;
	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}



function genericPop(parametros) {

	var pop = document.getElementById(parametros.popup); //Venatana padre
	var imagen = pop.getElementsByTagName('img');
	imagen[0].src = "images/SVGs/" + parametros.imagen + ".svg";

	var mensaje = pop.getElementsByTagName('p');
	var botones = pop.getElementsByTagName('button'); //[0]interno,[1]aceptar,[2]cancelar,[2]Conitnuar
	var barra = pop.getElementsByClassName('progress');
	barra[0].style.display = parametros.displaybarra;
	hideShow(botones, parametros);
	mensaje[0].innerHTML = parametros.mensaje;

	if (!$("#" + parametros.popup).hasClass('in')) {
		$("#" + parametros.popup).modal("show");
	}


	$(imagen[0]).css('width', 'auto');
	$(imagen[0]).css('height', 'auto');
	$(imagen[0]).css('min-width', '100%');
	$(imagen[0]).css('min-height', '100%');

}



function closePops() {

	if ($("#popupInico").hasClass("in"))
		$("#popupInico").modal("hide");
	if ($("#pop-generic").hasClass("in"))
		$("#pop-generic").modal("hide");
	if ($("#pop-final").hasClass("in"))
		$("#pop-final").modal("hide");
}



function hideShow(elementos, parametros) {

	for (var i = 0; i < elementos.length; i++) {
		elementos[i].style.display = parametros.displaysBotones[i];
		elementos[i].setAttribute('onClick', parametros.onClick[i]);
		elementos[i].innerHTML = parametros.text[i];
	}
}



function preEnvio() {

	var parametros = {
		"popup": "popupInico",
		"imagen": "Logon",
		"mensaje": msn.PreEnvio,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'inline'],
		"text": ['', '', 'Cancelar', 'Continuar'],
		"onClick": ["", "", "closePops()", "enviarDatos()"]

	};
	genericPop(parametros);
}

function enviarDatos() {

	var parametros = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Por favor espere mientras se completa la operación.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]

	};
	genericPop(parametros);
	LoginGrua();
}



function LoginGrua() {

	AjaxCall("loginGruaN.php", params, SuccessLogin, ErrorLogin);

}


function AjaxCall(URL, parametros, exito, fallo, extra) {
	console.log(extra);
	jqxhr = $.ajax({
		url: "http://52.25.178.106/grueroapp/" + URL,
		type: "POST",
		data: JSON.stringify(parametros),
		dataType: "JSON",
		timeout: 30000,
	});

	jqxhr.done(function (data) {
		if (extra === undefined) {
			exito(data);
		} else {
			exito(data, extra);
		}
	});

	jqxhr.fail(function (jqXHR, textStatus) {
		if (textStatus !== "abort") {

			if (extra === undefined) {
				fallo(jqXHR);
			} else {
				fallo(jqXHR, extra);
			}


		}
	});
}

function Abortar() {
	closePops();
	jqxhr.abort();
}

function setEstado(data)
{
    gruaParam.Estado = $(data).val();
    
		var parametros = {
			"idGrua": gruaParam.idGrua,
			"disponible": "SI",
            "Estado": gruaParam.Estado, 
			"UUID": device.uuid
                       
                        
		};
		/*var parametros2 = {
			"popup": "popupInico",
			"imagen": "Conectando",
			"mensaje": "Actualizando ubicación, espere un momento",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'none'],
			"text": ['', '', '', ''],
			"onClick": ["", "", "", ""]
		};
        genericPop(parametros2);*/
        var parametros3 = {
            "popup": "popupInico",
            "imagen": "Conectando",
            "mensaje": "Ubicación actualizada con éxito.",
            "displaybarra": ['none'],
            "displaysBotones": ['none', 'none', 'none', 'inline'],
            "text": ['', '', '', 'Ok'],
            "onClick": ["", "", "", "closePops()"]

        };
		genericPop(parametros3);
		AjaxCall("activarGruaN.php", parametros, SuccessEstado, ErrorEstado, "SI");

    
    
}
function SuccessEstado()
{
		/*var parametros = {
			"popup": "popupInico",
			"imagen": "Conectando",
			"mensaje": "Ubicación actualizada satisfactoriamente",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'none'],
			"text": ['', '', 'Cerrar', ''],
			"onClick": ["", "", "closePops()", ""]
		};
		genericPop(parametros);*/
    //closePops();
}
function ErrorEstado(error, valor) {
    closePops();
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};
	//console.log(valor);
	//PreSelect((valor === "SI") ? "NO" : "SI");
	genericPop(parametros);
	//  StopGPS();
}

function SuccessLogin(data) {
	console.log(data);

	if (data.idGrua !== undefined) {
		gruaParam.idGrua = data.idGrua;
		gruaParam.Celular = data.Celular;
		gruaParam.Modelo = data.Modelo;
		gruaParam.Nombre = data.Nombre + " " + data.Apellido;
		localStorage.setItem('disponible', "NO");
		GuardarSesion();
		var Name = document.getElementById("nombre-gruero"); //Venatana padre
		var mensaje = Name.getElementsByTagName('p');
		mensaje[0].innerHTML = gruaParam.Nombre;
		var Datos = document.getElementById("datos-grua");
		var contenido = Datos.getElementsByTagName('p');
		contenido[0].innerHTML = params.Placa;
		contenido[1].innerHTML = gruaParam.Modelo;
		contenido[2].innerHTML = gruaParam.Celular;

		$("#popupInico").modal("hide");

		avanzarGeneric("#home_grua");
		PreSelect("NO");
	} else if (data.Fallo !== undefined) {

		var parametros = {
			"popup": "popupInico",
			"imagen": "Alerta",
			"mensaje": data.Fallo,
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'none'],
			"text": ['', '', 'Cerrar', ''],
			"onClick": ["", "", "closePops()", ""]
		};
		genericPop(parametros);

	} else {
		var param = {
			"popup": "popupInico",
			"imagen": "Error",
			"mensaje": data.Error,
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'none'],
			"text": ['', '', 'Cerrar', ''],
			"onClick": ["", "", "closePops()", ""]
		};
		genericPop(param);

	}

}

function ErrorLogin(error) {
	var param = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]
	};
	genericPop(param);
}




function PreSelect(tipo) {
	console.log(tipo);

	if (tipo === "NO") {
		$('#btn-disponible-next').attr('disabled', 'disabled');
        $('#input-estado').attr('disabled', 'disabled');
	} else {

		$('#btn-disponible-next').removeAttr('disabled');
        $('#input-estado').removeAttr('disabled');
	}


	var contenedor = document.getElementById(tipo + "-btn");
	var botones = contenedor.getElementsByTagName('Button');
	var boton = botones[0];
	if ($(boton).attr('Color') !== undefined) {
		$(boton).css('background-color', $(boton).attr('Color'));
	} else {
		$(boton).css('background-color', 'rgba(240,119,48,0.8)');
	}
	$(boton).css('color', 'rgba(0,0,0,0.8)');

	if (boton !== selBtn)
		resetBtn();

	selBtn = boton;
}





function seleccionar(boton) {

	if ($(boton).attr('Color') !== undefined) {
		$(boton).css('background-color', $(boton).attr('Color'));
	} else {
		$(boton).css('background-color', 'rgba(240,119,48,0.8)');
	}
	$(boton).css('color', 'rgba(0,0,0,0.8)');

	if (boton !== selBtn) {
		resetBtn();
		Disponible($(boton).val());

	}
	selBtn = boton;

}

function resetBtn() {
	if (selBtn !== null) {
		$(selBtn).css("background-color", '');
		$(selBtn).css("color", '');
		selBtn = null;
	}
}



function Disponible(valor) {

	var parametros = {
		"idGrua": gruaParam.idGrua,
		"disponible": valor,
        "Estado": $('#input-estado').val(),
		"UUID": device.uuid
	};




	if (valor === "SI") {

		GCM(true);
        $('#input-estado').removeAttr('disabled');
        $('#btn-disponible-next').removeAttr('disabled');

        
	} else {
        $('#input-estado').attr('disabled', 'disabled');
		$('#btn-disponible-next').attr('disabled', 'disabled');
		AjaxCall("activarGruaN.php", parametros, SuccessActivar, ErrorActivar, "NO");


	}

	/*var msn = (valor === "SI") ? "Activando" : "Desactivando";
	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": msn + " grúa en la plataforma, Por favor espere.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]

	};*/
	//"onClick": (valor === "SI") ? ["", "", "Abortador('NO')", ""] : ["", "", "Abortador('SI')", ""],

	//genericPop(param);
    if (valor === "SI") {
        var param = {
            "popup": "popupInico",
            "imagen": "Conectando",
            "mensaje": "Gruero activo para recibir solicitudes.",
            "displaybarra": ['none'],
            "displaysBotones": ['none', 'none', 'none', 'inline'],
            "text": ['', '', '', 'Ok'],
            "onClick": ["", "", "", "closePops()"]

        };
        genericPop(param);
        $('#input-estado').removeAttr('disabled');
        $('#btn-disponible-next').removeAttr('disabled');
    }
}



function Abortador(tipo) {
	PreSelect(tipo);
	localStorage.setItem('disponible', tipo);
	Abortar();
}


function SuccessActivar(response, valor) {

	console.log(valor);
	if (response.OK !== undefined) {
		localStorage.setItem('disponible', valor);
		if (valor === "SI") {
			$('#btn-disponible-next').removeAttr('disabled');
			StartGPS(true);
			/*
			if (gruaParam.mToken === "") {
				GCM(true);
			} else {
				StartGPS(false);
			}
*/

		} else {
			$('#btn-disponible-next').attr('disabled', 'disabled');
			StopGPS();
			closePops();
		}

	} else if (response.Fallo !== undefined) {

		var parametros = {
			"popup": "popupInico",
			"imagen": "Alto",
			"mensaje": response.Fallo,
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'none'],
			"text": ['', '', 'Cerrar', ''],
			"onClick": ["", "", "closePops()", ""]

		};
		genericPop(parametros);
		//alert(response.Suspendido);
		//closePops();
		//StopGPS();
	} else {
		//alert(response.Error);
		closePops();
		//StopGPS();
	}
}

function ErrorActivar(error, valor) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};
	//console.log(valor);
	PreSelect((valor === "SI") ? "NO" : "SI");
	genericPop(parametros);
	//  StopGPS();
}



function MostrarSolicitud(boton) {
	if (boton !== undefined) {
		mId = $(boton).attr('mid');

	} else {
		mId = localStorage.getItem('mId');
	}
	SolReviewd(mId);
	modeloCarro = solDatos[mId].Modelo;

	localStorage.setItem('Solicitud', solDatos[mId].idSolicitud);
	//localStorage.setItem('Etapa', 'MostrarSolicitud');
	localStorage.setItem('mId', mId);

	var parametros = {
		"idSolicitud": solDatos[mId].idSolicitud,
	};

	AjaxCall("verSolicitud.php", parametros, SuccessVer, ErrorVer, mId);

	/*
	jqxhr = $.ajax({
		url: "http://52.25.178.106/grueroapp/verSolicitud.php",
		type: "POST",
		data: JSON.stringify(parametros),
		dataType: "JSON",
		timeout: 15000,
	});

	jqxhr.done(function (data) {
		SuccessVer(data, mId);
	});

	jqxhr.fail(function (jqXHR, textStatus) {
		if (textStatus !== "abort") {
			ErrorVer(jqXHR);
		}
	});
*/

	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Obteniendo más datos de la solicitud, Por favor espere mientras se completa el proceso.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};

	genericPop(param);
}

function SolReviewd(mId) {
	console.log(mId);
	vistos[mId] = true;
	var idWell = "#solwell" + mId;
	$(idWell).css('background-color', 'rgba(20, 24, 28, 0.9)');
}





function SuccessVer(data, mId) {
	console.log(mId);

	if (data.Fallo === undefined) {

		laSolicitud = data;
		var profit = Number(laSolicitud.Monto);
		laSolicitud.Monto = 'Bs. ' + profit.toLocaleString().replace(",", ".") + ',00';
		SetResumen();
		avanzarGeneric('#sol_resumen');


	} else {
		var param = {
			"popup": "popupInico",
			"imagen": "Stop",
			"mensaje": "La solicitud que usted ha marcado, ya no se encuentra disponible.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "closePops()"]
		};

		genericPop(param);
		RemoveList(mId);
	}
}

function ErrorVer(error) {
	var param = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.verSolicitud : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};
	genericPop(param);
}


function format2(n, currency) {
	return currency + " " + n.replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
}



function SetResumen() {
	var well = document.getElementById('resumen-sol');
	var textos = well.getElementsByTagName('p');
	textos[1].innerHTML = laSolicitud.Monto;
	textos[3].innerHTML = modeloCarro;

	var queOcurre = (laSolicitud.QueOcurre === "Neumático espichado") ? getNumCauchos() : laSolicitud.QueOcurre;

	textos[5].innerHTML = queOcurre;
	textos[9].innerHTML = laSolicitud.Direccion;
	textos[11].innerHTML = laSolicitud.InfoAdicional;
	//	console.log(textos);
}

function getNumCauchos() {
	var cauchos = 0;
	console.log(laSolicitud.Neumaticos);
	for (var i = 0; i < 4; i++) {
		if (laSolicitud.Neumaticos.charAt(i) === "1") {
			cauchos++;
		}
	}

	var respuesta = (cauchos === 1) ? " Neumático espichado" : " Neumáticos espichados";
	return cauchos + respuesta;
}


/////////////////////////////////////////Organizando solicitudes

function RemoveList(mId) {
	$(solElementos[solDatos.length - 1]).css('display', 'none');
	solDatos.splice(mId, 1);
	vistos.splice(mId, 1);
	vistos.push(false);
	console.log(vistos);
	OrganizarList();
}



function OrganizarList() {
	for (var i = 0; i < solDatos.length; i++) {
		$(solElementos[i]).css('display', 'Block');
		var idWell;
		if (vistos[i]) {
			idWell = "#solwell" + i;
			$(idWell).css('background-color', 'rgba(20, 24, 28, 0.9)');
		} else {
			idWell = "#solwell" + i;
			$(idWell).css('background-color', '');
		}
		var mensaje = solDatos[i].Modelo + " - " + solDatos[i].Problema + '<br>' + solDatos[i].TimeOpen;
		solBoton[i].innerHTML = mensaje;
	}
}




/////////////////////Tomar servicio


function PreTomar() {

	var param = {
		"popup": "popupInico",
		"imagen": "Logon",
		"mensaje": "¿Desea tomar la solicitud de servicio #" + laSolicitud.idSolicitud + ", por un monto de " + laSolicitud.Monto + "?. El sistema realizará la comprobación antes de asignarle el servicio.",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'inline', 'none'],
		"text": ['Continuar', '', 'Cancelar', ''],
		"onClick": ["TomarServicio()", "", "closePops()", ""]
	};

	genericPop(param);
}



function TomarServicio() {
	localStorage.laSolicitud = JSON.stringify(laSolicitud);

	var parametros = {
		"idGrua": gruaParam.idGrua,
		"idSolicitud": laSolicitud.idSolicitud,
	};

	AjaxCall("tomarSolicitud.php", parametros, SuccessTomar, ErrorTomar);

	/*
	jqxhr = $.ajax({
		url: "http://52.25.178.106/grueroapp/tomarSolicitud.php",
		type: "POST",
		data: JSON.stringify(parametros),
		dataType: "JSON",
		timeout: 15000,
	});

	jqxhr.done(function (data) {
		SuccessTomar(data);
	});

	jqxhr.fail(function (jqXHR, textStatus) {
		if (textStatus !== "abort") {
			ErrorTomar(jqXHR);
		}
	});
*/
	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Obteniendo más datos de la solicitud, Por favor espere mientras se completa el proceso.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};

	genericPop(param);
}



function SuccessTomar(data) {

	if (data.Fallo === undefined) {
		console.log(data);
		datosCliente = data;
		localStorage.datosCliente = JSON.stringify(datosCliente);
		//closePops();
		HideBack(true);

		avanzarGeneric('#en_ruta');
		FillResumen();
		MakeRuta();


		localStorage.setItem('disponible', "NO");
		//localStorage.setItem('Etapa', 'en_ruta')
		localStorage.setItem('idSolicitud', laSolicitud.idSolicitud);


	} else if (data.Error !== undefined) {

		var params = {
			"popup": "popupInico",
			"imagen": "Error",
			"mensaje": "Se ha detectado un error: " + data.Error + ". Intente nuevamente.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "closePops()"]
		};

		genericPop(params);

	} else {


		var param = {
			"popup": "popupInico",
			"imagen": "Stop",
			"mensaje": "Ha ocurrido un error: " + data.Fallo,
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "GoBack()"]
		};
		//	RemoveList(mId);
		genericPop(param);
		//////////////////////////////////////////
	}

}





function ErrorTomar(error) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};

	genericPop(parametros);
}




function RetomarServicio() {
	laSolicitud = JSON.parse(localStorage.laSolicitud);
	var parametros = {
		"idGrua": gruaParam.idGrua,
		"idSolicitud": laSolicitud.idSolicitud,
	};



	//AjaxCall("retomarServicio.php", parametros, SuccessTomar, ErrorTomar);
	activate_page("#paginaApp");
	avanzarGeneric('#en_ruta');
	GCM(false);

	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Retomando servicio, por favor espere.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cancelar', ''],
		"onClick": ["", "", "CancelarRetoma()", ""]

	};
	genericPop(param);
	
	SuccessTomar(JSON.parse(localStorage.datosCliente));

	
}




function CancelarRetoma() {
	closePops();
	avanzarGeneric('#home_grua');
}




function FillResumen() {
	//console.log(laSolicitud);
	var elementos = document.getElementsByName('datos-servicio');
	var textos = elementos[0].getElementsByTagName('p');
	var textos2 = elementos[1].getElementsByTagName('p');

	textos[0].innerHTML = laSolicitud.Monto;
	textos2[0].innerHTML = laSolicitud.Monto;
	textos[1].innerHTML = datosCliente.Nombre + " " + datosCliente.Apellido;
	textos2[1].innerHTML = datosCliente.Nombre + " " + datosCliente.Apellido;
	textos[2].innerHTML = datosCliente.Modelo;
	textos2[2].innerHTML = datosCliente.Modelo;
	textos[3].innerHTML = datosCliente.Placa;
	textos2[3].innerHTML = datosCliente.Placa;
	textos[4].innerHTML = laSolicitud.QueOcurre;
	textos2[4].innerHTML = laSolicitud.QueOcurre;
	textos[5].innerHTML = laSolicitud.InfoAdicional;
	textos2[5].innerHTML = laSolicitud.InfoAdicional;

	var botonesLlamar = document.getElementsByName('btn-llamar');
	botonesLlamar[0].innerHTML = '<i class="icon icon-llamar button-icon-left" data-position="left"></i>' + laSolicitud.CellContacto;
	botonesLlamar[1].innerHTML = '<i class="icon icon-llamar button-icon-left" data-position="left"></i>' + laSolicitud.CellContacto;


	//	console.log($('#btn-call-cliente'));
}


function PreAsistir() {
	var param = {
		"popup": "popupInico",
		"imagen": "Asistir",
		"mensaje": "¿Usted se encuentra en el sitio y asistiendo/remolcando al cliente?",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'inline', 'none'],
		"text": ['Si, correcto', '', 'No, aún no', ''],
		"onClick": ["Asistir()", "", "closePops()", ""]
	};

	genericPop(param);
}




function Asistir() {

	var parametros = {
		"idSolicitud": laSolicitud.idSolicitud,
	};

	AjaxCall("asistirVehiculo.php", parametros, SuccessAsistir, ErrorAsitir);

	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Actualizando información del servicio, Por favor espere mientras se completa el proceso.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};
	genericPop(param);
}


var flag = true;

function RetomarAsistir() {
	flag = false;
	GCM(false);
	laSolicitud = JSON.parse(localStorage.laSolicitud);
	datosCliente = JSON.parse(localStorage.datosCliente);
	FillResumen();
	console.log(gruaParam);
	data = {
		'Success': "OK",
	};
	//	activate_page('#paginApp')
	//	avanzarGeneric('#a_destino');

	SuccessAsistir(data);

}


function SuccessAsistir(data) {

	if (data.Success !== undefined) {
		avanzarGeneric('#a_destino');
		//localStorage.setItem('Etapa', 'a_destino');
		

		var param2 = {
			"popup": "popupInico",
			"imagen": "Star",
			"mensaje": "<font size='6'>Recuerde</font><br>Solicite al cliente confirmar que ha sido asistido.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Continuar'],
			"onClick": ["", "", "", "closePops()"]
		};
		genericPop(param2);
		
		MakeDestino();
		

	} else if (data.Fail) { //Cancelado por usuario

		var param = {
			"popup": "popupInico",
			"imagen": "Stop",
			"mensaje": "El cliente ha cancelado la orden de servicio, presione el botón de continuar para volver a las solicitudes",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Continuar'],
			"onClick": ["", "", "", "ResetApp()"]
		};
		genericPop(param);

	} else { //Error
		closePops();
		//alert(data.Error);

	}
}



function ErrorAsitir(error) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};
	genericPop(parametros);
}




function VerificarServicio() {

	var parametros = {
		"idSolicitud": laSolicitud.idSolicitud,
	};

	AjaxCall("checkServicio.php", parametros, CheckStatus, ErrorCheck);

}




function CheckStatus(data) {
	console.log(data);

	if (data.EstatusCliente === "Asistido" || data.EstatusCliente === "Completado") {
		Liberar();

	} else if (data.EstatusCliente === "Cancelado") {
		var param = {
			"popup": "popupInico",
			"imagen": "Stop",
			"mensaje": "El cliente ha cancelado la orden de servicio, presione el botón de continuar para volver a las solicitudes",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Continuar'],
			"onClick": ["", "", "", "ResetApp()"]
		};
		genericPop(param);
	} else {
		var parametros = {
			"popup": "popupInico",
			"imagen": "Alerta",
			"mensaje": "El servicio no ha recibido actualizaciones.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Continuar'],
			"onClick": ["", "", "", "closePops()"]
		};
		genericPop(parametros);
	}

}

function ErrorCheck(error) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};
	genericPop(parametros);
}





function FinalizarServicio() {

	var param = {
		"popup": "popupInico",
		"imagen": "Logon",
		"mensaje": "Presione continuar para finalizar el servicio, recuerde solo hacerlo en el caso de haber liberado su grúa.",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'inline', 'none'],
		"text": ['Continuar', '', 'Cancelar', ''],
		"onClick": ["Finalizador()", "", "closePops()", ""]
	};
	genericPop(param);
}



function Finalizador() {

	var parametros = {
		"idSolicitud": laSolicitud.idSolicitud,
		"idGrua": gruaParam.idGrua,
	};

	AjaxCall("finalizarServicio.php", parametros, SuccessFin, ErrorFin);

	/*
	jqxhr = $.ajax({
		url: "http://52.25.178.106/grueroapp/finalizarServicio.php",
		type: "POST",
		data: JSON.stringify(parametros),
		dataType: "JSON",
		timeout: 15000,
	});

	jqxhr.done(function (data) {
		SuccessFin(data);
	});

	jqxhr.fail(function (jqXHR, textStatus) {
		if (textStatus !== "abort") {
			ErrorFin(jqXHR);
		}
	});
*/
	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Actualizando información del servicio, Por favor espere mientras se completa el proceso.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};

	genericPop(param);
}



function SuccessFin(data) {
	console.log(data);

	if (data.Success !== undefined) {
		closePops();
		ResetApp();
	} else {
		ErrorFin(data);
	}
}



function ErrorFin(error) {
	var param = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": "Se ha detectado un error: " + data.Error + ". Intente nuevamente.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};
	genericPop(param);
}




function PreAbandonar() {
	resetOpt();
	var param = {
		"popup": "popupInico",
		"imagen": "Stop",
		"mensaje": "Está seguro que desea en abandonar el servicio, esta acción no puede ser reversada.",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'inline', 'none'],
		"text": ['Abandonar', '', 'Cancelar', ''],
		"onClick": ["avanzarGeneric('#abandono')", "", "closePops()", ""]
	};

	genericPop(param);
}



function opcion(boton) {

	var elemento = boton.getElementsByTagName('i');

	if ($(elemento).hasClass('icon-opcion')) {
		$(elemento).removeClass('icon-opcion').addClass('icon-seleccionado');
		$(elemento).css('color', 'rgb(255,255,255)');
		resetOpt();
		selOpt = boton;
		$('#btn-fin-abandonar').removeAttr('disabled');
	}
}



function Abandonar() {

	var parametros = {
		"idSolicitud": laSolicitud.idSolicitud,
		"Motivo": $(selOpt).val(),
	};

	AjaxCall("abandonarServicio.php", parametros, SuccessAbandonar, ErrorAbandonar);


	var param = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Enviando confirmación de abandono, Por favor espere mientras se completa el proceso.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};

	genericPop(param);

}



function SuccessAbandonar(data) {
	console.log(data);
	var params = {
		"popup": "popupInico",
		"imagen": "",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Continuar'],
		"onClick": ["", "", "", "closePops()"]
	};

	if (data.Error !== undefined) {

		params.imagen = "Error";
		params.mensaje = "Se ha detectado un error y no se puedo realizar la operación: " + data.Error + ". Intente nuevamente.";
		params.onClick = ["", "", "", "closePops()"];

	} else {

		params.imagen = "Alerta";
		params.mensaje = (data.Success !== undefined) ? data.Success : data.Fail;
		params.onClick = ["", "", "", "ResetApp()"];
	}

	genericPop(params);

}



function ErrorAbandonar(error) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]

	};
	genericPop(parametros);
}



function resetOpt() {
	if (selOpt !== null) {
		var elemento = selOpt.getElementsByTagName('i');
		$(elemento).removeClass('icon-seleccionado').addClass('icon-opcion');
		$(elemento).css('color', '');
	}
	$('#btn-fin-abandonar').attr('disabled', 'disabled');
	selOpt = null;
}



function GoBack() {
	//closePops();
	console.log("GB");
	avanzarGeneric('#solicitudes_grua');
	RemoveList(mId);
}



function ResetApp() {
	clearTimeout(callInterval);
	closePops();
	avanzarGeneric('#home_grua');

	var Name = document.getElementById("nombre-gruero"); //Venatana padre
	var mensaje = Name.getElementsByTagName('p');
	mensaje[0].innerHTML = gruaParam.Nombre;
	var Datos = document.getElementById("datos-grua");
	var contenido = Datos.getElementsByTagName('p');
	contenido[0].innerHTML = gruaParam.Placa;
	contenido[1].innerHTML = gruaParam.Modelo;
	contenido[2].innerHTML = gruaParam.Celular;


	HideBack(true);
	PreSelect("NO");
	laSolicitud = null;
	RemoveList(mId);
	StopGPS();
	$('#btn-disponible-next').attr('disabled', 'disabled');
	$('#btn-fin-servicio').attr('disabled', 'disabled');
	$('#btn-fin-servicio').removeClass('btn-success').addClass('btn-base');

}



////////////////////////////////////////////////////////////////////// EXTRAS
function llamarCallCenter() {
	window.location = "tel:05004783760";
}



function llamarCliente() {
	window.location = "tel:" + laSolicitud.CellContacto;
	console.log(laSolicitud.CellContacto);
}



function restore(boton) {
	//	console.log(boton);
	if (!$(boton).hasClass("select")) {
		$(boton).css('background-position', '');
	}
}



function HideBack(accion) {
	var backs = $('#back-btn');
	if (accion) {
		$(backs).css('display', 'none');
	} else {
		$(backs).css('display', 'block');
	}

}



function mostrarGrua(boton) {
	var CAMBIO = ($(boton).children().hasClass('icon-mostrar')) ? $(boton).children().removeClass('icon-mostrar').addClass('icon-ocultar') : $(boton).children().removeClass('icon-ocultar').addClass('icon-mostrar');
}


function avanzarGeneric(subpagina) {


	switch (subpagina) {
	case "#solicitudes_grua":
		backPage = '#home_grua';
		break;
	case "#sol_resumen":
		backPage = '#solicitudes_grua';
		break;
	case "#direcciones":
		backPage = '#sol_resumen';
		break;
	}


	if (subpagina === "#solicitudes_grua" || subpagina === "#sol_resumen" || subpagina === "#direcciones") {
		HideBack(false);
	} else {
		HideBack(true);

	}


	if (subpagina === "#datos_inicio" || subpagina === "#en_ruta" || subpagina === "#a_destino") {
		$('#cerrar-sesion').css('display', 'none');
	} else {
		$('#cerrar-sesion').css('display', 'block');
	}

	if (subpagina === "#a_destino") {
		$('#verificar-servicio').css('display', 'block');
	} else {
		$('#verificar-servicio').css('display', 'none');
	}

	if (subpagina === "#en_ruta") {
		$('#verificar-abandono').css('display', 'block');
	} else {
		$('#verificar-abandono').css('display', 'none');
	}



	if ((subpagina === '#legal') || (subpagina === '#sub-terminos')) {
		if (!$('#menu').hasClass('oculto-head'))
			$('#menu').addClass('oculto-head');
	} else {
		if ($('#menu').hasClass('oculto-head'))
			$('#menu').removeClass('oculto-head');
	}


	localStorage.setItem('Etapa', subpagina);
	closePops();
	resetOpt();
	habilitarCat(selCat);

	activate_subpage(subpagina);
}



function habilitarCat(boton) {
	$(selCat).removeClass("select");
	restore(selCat);
}






//////////////////////////////////////////////////////////////////////


/*
function selectCat(boton) {
	// console.log($(boton).attr('value'));

	if ($(selCat).hasClass("select"))
		habilitarCat(selCat);


	if (!$(boton).hasClass('select')) {
		$(boton).css('background-position', '-130px 0px');
		$(boton).addClass('select');
		myNextBtn.removeAttr('disabled');
		selCat = boton;
	}
}


function selectCat2(boton) {

	if ($(selCat).hasClass("Select"))
		habilitarCat(selCat);


	if (!$(boton).hasClass("Select")) {
		$(boton).attr('src', URL);
		$(boton).addClass('Select');
		selCat = boton;
		myNextBtn.removeAttr('disabled');
	}

}

function rollOver(boton) {

	var URL = $(boton).attr('url') + $(boton).attr('imagen') + 'OV.svg';
	if (!$(boton).hasClass("Select")) {
		$(boton).attr('src', URL);
	}
}
*/