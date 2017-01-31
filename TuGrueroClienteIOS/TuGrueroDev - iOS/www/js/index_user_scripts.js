/*jshint browser:true */
/*global $ */
(function () {
	"use strict";
	/*
	  hook up event handlers 
	*/
	function register_event_handlers() {



		//CATEGORIAS
		$(document).on("touchend", "#btn-cat", function (evt) {
			selectCat(this);
		});

		$(document).on("touchstart", "#btn-cat", function (evt) {
			rollOver(this);
		});

		$(document).on("touchcancel", "#btn-cat", function (evt) {
			restore(this);
		});



		/* button  #btn-entrar */
		$(document).on("touchend", "#btn-entrar", function (evt) {
			/*global activate_page */
			//activate_page("#paginaApp");
		});


		/* button  #btn-enviar */
		$(document).on("touchend", "#btn-enviar", function (evt) {

			verificacion();

		});

		$(document).on("touchend", "#enviarDatos", function (evt) {
			/*global activate_page */
			//enviarDatos();
		});

		$(document).on("touchend", "#abortar", function (evt) {
			/*global activate_page */
			Abortar();
		});

		$(document).on("touchend", "#back-btn", function (evt) {
			/*global activate_page */
			Back();
		});


		$(document).on("touchend", "#btn-select", function (evt) {
			/*global activate_page */
			seleccionar(this);
		});

		$(document).on("touchend", "#callCenter", function (evt) {
			/*global activate_page */
			llamarCallCenter();
		});

		$(document).on("touchend", "#btn-carga-next", function (evt) {
			/*global activate_page */
			siguienteCarga();
		});

		$(document).on("touchend", "#avanzarCarga", function (evt) {
			/*global activate_page */
			avanzarGeneric("#sub_cat");
		});

		$(document).on("touchend", "#btn-cat-next", function (evt) {
			/*global activate_page */
			siguienteCategorias();
		});

		$(document).on("touchend", "#btn-taxi-next", function (evt) {
			/*global activate_page */
			siguienteTaxi();
		});

		$(document).on("touchend", "#btn-opcion", function (evt) {
			/*global activate_page */
			opcion(this);
		});


		$(document).on("touchend", "#btn-check", function (evt) {
			/*global activate_page */
			aceptarTerminos(this);
			//opcion(this);
		});

		$(document).on("touchend", "#btn-cuneta-next", function (evt) {
			/*global activate_page */
			siguineteCuneta();
		});

		$(document).on("touchend", "#avanzarTaxi", function (evt) {
			/*global activate_page */
			avanzarGeneric("#encender");
		});

		$(document).on("touchend", "#btn-encender-next", function (evt) {
			/*global activate_page */
			siguienteEncender();
		});

		$(document).on("touchend", "#btn-quetiene-next", function (evt) {
			/*global activate_page */
			siguienteQuetiene();

		});

		$(document).on("touchend", "#btn-choque-next", function (evt) {
			/*global activate_page */
			siguienteChoque();

		});



		$(document).on("touchend", "#btn-otrafalla-next", function (evt) {
			/*global activate_page */
			siguienteOtrafalla();

		});

		$(document).on("touchend", "#btn-multiop", function (evt) {
			/*global activate_page */
			multiopcion(this);
		});

		$(document).on("touchend", "#btn-cauchos-next", function (evt) {
			/*global activate_page */
			siguineteCauchos();
		});

		$(document).on("touchend", "#btn-cambiollanta-next", function (evt) {
			/*global activate_page */
			siguienteCambiollanta();
		});


		$(document).on("touchend", "#btn-masdetalles-next", function (evt) {
			/*global activate_page */
			siguienteMasdetalles();
		});

		$(document).on("touchend", "#btn-detalles-next", function (evt) {
			/*global activate_page */
			siguienteDetalles();
		});

		$(document).on("touchend", "#btn-reubicar", function (evt) {
			/*global activate_page */
			UbicarEnMapa(mapas.Origen,gpsLatlng);
		});

		$(document).on("touchend", "#btn-reubicar-destino", function (evt) {
			/*global activate_page */
			UbicarEnMapa(mapas.Destino,destinoLatlng);
		});


		$(document).on("touchend", "#btn-enviar-next", function (evt) {
			/*global activate_page */
			enviarGPS();
		});

		$(document).on("touchend", "#btn-destino-next", function (evt) {
			/*global activate_page */
			siguienteDestino();
		});

		$(document).on("touchend", "#btn-ajustar-next", function (evt) {
			/*global activate_page */
			siguienteAjustar();
		});

		$(document).on("touchend", "#btn-add", function (evt) {
			/*global activate_page */
			showResumen();
		});


		$(document).on("touchend", "#cancelarSolicitud", function (evt) {
			/*global activate_page */
			cancelarSolicitud(); //solicitud.js
		});


		$(document).on("touchend", "#btn-solicitar", function (evt) {
			/*global activate_page */
			siguienteResumen(this); //app.js
		});


		$(document).on("touchend", "#btn-show-gura", function (evt) {
			/*global activate_page */
			mostrarGrua(this); //servicio.js
		});

		$(document).on("touchend", "#callGrua", function (evt) {
			/*global activate_page */
			llamarGrua(); //servicio.js
		});

		$(document).on("touchend", "#btn-call-gruero", function (evt) {
			/*global activate_page */
			llamarGrua(); //servicio.js
		});


		$(document).on("touchend", "#btn-localizar", function (evt) {
			/*global activate_page */
			localizar(this); //servicio.js
		});

		$(document).on("touchend", "#btn-cancelar-servicio", function (evt) {
			/*global activate_page */
			cancelarServicio(); //servicio.js
		});

		$(document).on("touchend", "#cancelacion", function (evt) {
			/*global activate_page */
			cancelacion(); //servicio.js
		});

		$(document).on("touchend", "#confirmarAsistencia", function (evt) {
			/*global activate_page */
			confirmarAsistencia();
		});

		$(document).on("touchend", "#rechazarAsistencia", function (evt) {
			/*global activate_page */
			rechazarAsistencia();
		});


		$(document).on("touchend", "#activarRatings", function (evt) {
			/*global activate_page */
			clearTimeout(callInterval);
			activate_page('#Encuesta');
			openHelpEncuesta(); //rating.js
		});


		$(document).on("touchend", "#btn-ratin", function (evt) {
			/*global activate_page */
			setRatin(this); //rating.js
		});

		$(document).on("touchend", "#btn-rating-next", function (evt) {
			/*global activate_page */
			enviarRatings(); //rating.js
		});

		$(document).on("touchend", "#btn-encuesta", function (evt) {
			/*global activate_page */
			encuesta(this); //rating.js
		});

		$(document).on("touchend", "#btn-finalizar", function (evt) {
			/*global activate_page */
			finalizar(); //rating.js
		});



		///PRUEBA BOTON 
		$(document).on("touchend", "#btn-prueba", function (evt) {
			/*global activate_page */
			probarboton(this);
			//	finalizar(this.v); //rating.js
		});

	}
	document.addEventListener("app.Ready", register_event_handlers, false);
})();