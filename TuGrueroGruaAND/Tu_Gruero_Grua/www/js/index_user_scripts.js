/*jshint browser:true */
/*global $ */
(function () {
	"use strict";
	/*
	  hook up event handlers 
	*/
	function register_event_handlers() {


		//CATEGORIAS
		$(document).on("click", "#btn-cat", function (evt) {
			selectCat(this);
		});

		$(document).on("mouseover", "#btn-cat", function (evt) {
			rollOver(this);
		});

		$(document).on("mouseout", "#btn-cat", function (evt) {
			restore(this);
		});


		$(document).on("touchstart", "#btn-clave", function (evt) {
			$('#clave').attr('type', 'text');
		});

		$(document).on("touchend", "#btn-clave", function (evt) {
			$('#clave').attr('type', 'password');
		});


		/* button  #btn-entrar */
		$(document).on("click", "#btn-entrar", function (evt) {
			/*global activate_page */
			//activate_page("#paginaApp");
		});


		$(document).on("click", "#btn-termino", function (evt) {
			checkTerminos();
		});


		$(document).on("touchend", "#btn-check", function (evt) {
			aceptarTerminos(this);
		});

		$(document).on("click", "#btn-legal-next", function (evt) {
			$('#paginaApp').off('scroll');
			//$('#menu').removeClass('oculto-head');
			avanzarGeneric("#sub-terminos");
		});


		$(document).on("click", "#menu-closer", function (evt) {

			uib_sb.toggle_sidebar($('#menu-bar'));
			if (!$(this).hasClass('hidden')) {
				$(this).addClass('hidden');
			}

		});

		$(document).on("click", "#show-mapa", function (evt) {
			avanzarGeneric('#direcciones');
			MakeDirections();
		});

		$(document).on("click", "#btn-localizar", function (evt) {
			/*global activate_page */
			Localizar(this);
		});

		$(document).on("click", "#btn-tomar", function (evt) {
			/*global activate_page */
			PreTomar();
		});

		$(document).on("click", "#btn-asistir", function (evt) {
			/*global activate_page */
			PreAsistir();
		});

		$(document).on("click", "#btn-fin-servicio", function (evt) {
			/*global activate_page */
			FinalizarServicio();
		});

		$(document).on("click", "#btn-abandonar", function (evt) {
			/*global activate_page */
			PreAbandonar();
		});

		$(document).on("click", "#btn-opcion", function (evt) {
			/*global activate_page */
			opcion(this);
		});

		$(document).on("click", "#btn-fin-abandonar", function (evt) {
			/*global activate_page */
			Abandonar();
		});



		$(document).on("click", "#btn-enviar", function (evt) {
			verificacion();

		});


		$(document).on("click", "#abortar", function (evt) {
			/*global activate_page */
			Abortar();
		});

		$(document).on("click", "#back-btn", function (evt) {
			/*global activate_page */
			avanzarGeneric(backPage);

		});

		$(document).on("click", "#regresar-btn", function (evt) {
			/*global activate_page */
			avanzarGeneric('#sol_resumen');
		});

		$(document).on("click", "#back-sol-btn", function (evt) {
			/*global activate_page */
			//navegacion.pop();
			avanzarGeneric('#solicitudes_grua');
		});



		$(document).on("click", "#btn-select", function (evt) {
			/*global activate_page */
			seleccionar(this);
		});

		$(document).on("click", "#call-center", function (evt) {
			llamarCallCenter();
			uib_sb.toggle_sidebar($('#menu-bar'));
			if (!$('#menu-closer').hasClass('hidden')) {
				$('#menu-closer').addClass('hidden');
			}

		});

		$(document).on("click", "#cerrar-sesion", function (evt) {
			uib_sb.toggle_sidebar($('#menu-bar'));
			if (!$('#menu-closer').hasClass('hidden')) {
				$('#menu-closer').addClass('hidden');
			}
			CerrarSesion();
		});

		$(document).on("click", "#verificar-servicio", function (evt) {
			uib_sb.toggle_sidebar($('#menu-bar'));
			if (!$('#menu-closer').hasClass('hidden')) {
				$('#menu-closer').addClass('hidden');
			}
			VerificarServicio();
		});


		$(document).on("click", "#verificar-abandono", function (evt) {
			uib_sb.toggle_sidebar($('#menu-bar'));
			if (!$('#menu-closer').hasClass('hidden')) {
				$('#menu-closer').addClass('hidden');
			}
			VerificarServicio();
		});





		$(document).on("click", "#menu", function (evt) {
			uib_sb.toggle_sidebar($('#menu-bar'));

			if ($('#menu-closer').hasClass('hidden')) {
				$('#menu-closer').removeClass('hidden');
			}


		});

		$(document).on("click", "#tope", function (evt) {
			uib_sb.toggle_sidebar($('#menu-bar'));
			if (!$('#menu-closer').hasClass('hidden')) {
				$('#menu-closer').addClass('hidden');
			}

		});


		$(document).on("click", "#btn-disponible-next", function (evt) {
			/*global activate_page */
			//HideBack(false);
			avanzarGeneric('#solicitudes_grua');
		});



	}
	document.addEventListener("app.Ready", register_event_handlers, false);
})();


document.addEventListener("app.Ready", Scroller, false);
document.addEventListener("app.Ready", SetPaths, false);



function SetPaths() {
	var w = window.device && window.device.platform;
	var x = navigator.userAgent;
	var y = getWebPath();
	var z = getWebRoot();
	//console.log("getWebPath() => ", y);

	var medio = "audio/beep.wav";
	//        if( z.match(/\/emulator.*\/ripple\/userapp/i) ) {           // if in the Emulate tab
	if (window.tinyHippos) { // if in the Emulate tab
		medio = z + "/" + medio;
	} else if (x.match(/(ios)|(iphone)|(ipod)|(ipad)/ig)) { // if on a real iOS device
		medio = "/" + medio;
	} else { // everything else...
		medio = z + "/" + medio;
	}
	media = new Media(medio, mediaSuccess, mediaError, mediaStatus);

}


function getWebPath() {
	var path = window.location.pathname;
	path = path.substring(0, path.lastIndexOf('/'));
	return 'file://' + path;
}

function getWebRoot() {
	var path = window.location.href;
	path = path.substring(0, path.lastIndexOf('/'));
	return path;
}


// private functions for our media object

function mediaSuccess() {
	media.stop();
	media.release();
}

function mediaError(err) {
	media.stop();
	media.release();
}

function mediaStatus(status) {
	var msg = "undefined";
	switch (status) {
	case 0:
		msg = "MEDIA_NONE";
		break;
	case 1:
		msg = "MEDIA_STARTING";
		break;
	case 2:
		msg = "MEDIA_RUNNING";
		break;
	case 3:
		msg = "MEDIA_PAUSED";
		break;
	case 4:
		msg = "MEDIA_STOPPED";
		break;
	default:
		msg = "MEDIA_undefined";
	}
}




function Scroller() {
	$('#paginaApp').scroll(function () {
		if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 50) {
			$('#scroller').fadeOut("fast");
		} else if ($('#scroller').css('opacity') !== 1.0) {
			$('#scroller').fadeIn("fast");
		}
	});
}