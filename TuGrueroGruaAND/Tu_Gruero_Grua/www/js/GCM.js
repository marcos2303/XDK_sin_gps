/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

document.addEventListener("app.Ready", fillSolicitudes, false);

var solDatos = [];
var solBoton = [];
var solElementos;
var hCounter = 1;

function fillSolicitudes() {

	solElementos = document.getElementsByName('sol');

	for (var i = 0; i < 5; i++) {
		//	solElementos[i].
		var elemento = solElementos[i].getElementsByTagName('button');
		solBoton.push(elemento[0]);
		$(solElementos[i]).css('display', 'none');
	}

	/*
			var data = {
				"Modelo": "Prueba" + hCounter,
				"idSolicitud": "1313",
			};
		
	
			SetSolicitud(data);

			data = {
				"Modelo": "Corolla" + hCounter,
				"idSolicitud": "728",
			};
			SetSolicitud(data);

		
			data = {
				"Modelo": "Corolla" + hCounter,
				"idSolicitud": "503",
			};
			SetSolicitud(data);
			
				data = {
					"Modelo": "Corolla" + hCounter,
					"idSolicitud": "504",
				};
				SetSolicitud(data);


				data = {
					"Modelo": "Corolla" + hCounter,
					"idSolicitud": "505",
				};
				SetSolicitud(data);

				data = {
					"Modelo": "Corolla" + hCounter,
					"idSolicitud": "506",
				};
				SetSolicitud(data);
			*/

	//console.log(solElementos[0]);
	//console.log(solElementos);
	//Corolla - Neumáticos<br>11:35 AM - 23/01/2016 <i class="glyphicon glyphicon-search"></i>
}



function GCM(showAlert) {


	var push = PushNotification.init({
		"android": {
			"senderID": "992821066437"
		},
		"ios": {
			"alert": "true",
			"badge": "true",
			"sound": "true"
		},
		"windows": {}
	});

	push.on('registration', function (data) {
		// data.registrationId
		gruaParam.mToken = data.registrationId;
		//	closePops();


		if (showAlert) {
			SaveToken();
		} else {
			StartGPS(false);
		}


	});

	push.on('notification', function (data) {


		media.play();

		if (data.additionalData.Problema !== undefined) {
			SetSolicitud(data.additionalData);
			MostrarAlerta(data.additionalData);


		} else if (data.additionalData.Completado !== undefined) {
			Liberar();
		} else {
			AutoCancel();

		}
		// data.message,
		// data.title,
		// data.count,
		// data.sound,
		// data.image,
		// data.additionalData
	});

	push.on('error', function (e) {
		// e.message
		var parametros = {
			"popup": "popupInico",
			"imagen": "Error",
			"mensaje": "Ha ocurrido un error en el registro: " + e.message + ". Por favor intente nuevamente.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "closePops()"]

		};
		genericPop(parametros);

		PreSelect("NO");

	});

}




function SaveToken() {

	var parametros = {
		"idGrua": gruaParam.idGrua,
		"mToken": gruaParam.mToken
	};

	AjaxCall("registroGCM.php", parametros, SuccessToken, ErrorToken)

}



function SuccessToken(response) {


	if (response.Error !== undefined) {
		var parametros = {
			"popup": "popupInico",
			"imagen": "Error",
			"mensaje": "Ha ocurrido un error en el registro GCM: " + response.Error + ". Por favor intente nuevamente.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "closePops()"]

		};
		genericPop(parametros);

		PreSelect("NO");
	//	Disponible("NO");
	} else {
		//closePops();
		var parametros = {
			"idGrua": gruaParam.idGrua,
			"disponible": "SI",
            "Estado": $('#input-estado').val(), 
			"UUID": device.uuid
            
		};
		AjaxCall("activarGruaN.php", parametros, SuccessActivar, ErrorActivar, "SI");
		StartGPS(true);

	}
}



function ErrorToken(data) {
	closePops();
	//alert(data.error);
	PreSelect("NO");
//	Disponible("NO");
}



function MostrarAlerta(data) {

	var param = {
		"popup": "popupInico",
		"imagen": "Logon",
		"mensaje": "<font size='6'>¡Nueva solicitud de servicio!</font><br>Revisa los detalles de la solicitud ahora mismo.",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'inline', 'none'],
		"text": ['Ver solicitud', '', 'Cerrar', ''],
		"onClick": ["VerNuevaSolicitud()", "", "closePops()", ""]
	};
	genericPop(param);
}

function VerNuevaSolicitud() {
	closePops();
	var boton = $('#sol00');
	MostrarSolicitud(boton);
}




function SetSolicitud(data) {

	//snd.play();

	if (solDatos.length < 5) {
		$(solElementos[solDatos.length]).css('display', 'Block');
		solDatos.unshift(data); //agrega al principio

	} else {
		solDatos.pop(); //Remueve el ultimo
		solDatos.unshift(data); // Agrega al principio
	}

	vistos.pop();
	vistos.unshift(false);
	OrganizarList();

	for (var i = 0; i < solDatos.length; i++) {
		var mensaje = solDatos[i].Modelo + " - " + solDatos[i].Problema + '<br>' + solDatos[i].TimeOpen;
		solBoton[i].innerHTML = mensaje;
	}

	hCounter++;
}



function Liberar() {
	$('#btn-fin-servicio').removeAttr('disabled');
	$('#btn-fin-servicio').removeClass('btn-base').addClass('btn-success');

	var param = {
		"popup": "popupInico",
		"imagen": "Asistir",
		"mensaje": "El cliente ha liberado su grúa y se ha habilitado el botón para completar el servicio.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};
	genericPop(param);
}



function AutoCancel() {

	//snd.play();
	media.play();

	var param = {
		"popup": "popupInico",
		"imagen": "Alerta",
		"mensaje": "El cliente ha cancelado la orden de servicio, presione el botón de continuar para volver a las solicitudes",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Continuar'],
		"onClick": ["", "", "", "ResetApp()"]
	};
	genericPop(param);


}