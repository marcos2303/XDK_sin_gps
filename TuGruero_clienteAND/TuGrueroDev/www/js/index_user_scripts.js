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



		/* button  #btn-entrar */
		$(document).on("click", "#btn-entrar", function (evt) {
			/*global activate_page */
			//activate_page("#paginaApp");
		});


		/* button  #btn-enviar */
		$(document).on("click", "#btn-enviar", function (evt) {

			verificacion();

		});

		$(document).on("click", "#enviarDatos", function (evt) {
			/*global activate_page */
			//enviarDatos();
		});

		$(document).on("click", "#abortar", function (evt) {
			/*global activate_page */
			Abortar();
		});

		$(document).on("click", "#back-btn", function (evt) {
			/*global activate_page */
			Back();
		});


		$(document).on("click", "#btn-select", function (evt) {
			/*global activate_page */
			seleccionar(this);
		});

		$(document).on("click", "#callCenter", function (evt) {
			/*global activate_page */
			llamarCallCenter();
		});

		$(document).on("click", "#btn-carga-next", function (evt) {
			/*global activate_page */
			siguienteCarga();
		});

		$(document).on("click", "#avanzarCarga", function (evt) {
			/*global activate_page */
			avanzarGeneric("#sub_cat");
		});

		$(document).on("click", "#btn-cat-next", function (evt) {
			/*global activate_page */
			siguienteCategorias();
		});

		$(document).on("click", "#btn-taxi-next", function (evt) {
			/*global activate_page */
			siguienteTaxi();
		});

		$(document).on("click", "#btn-opcion", function (evt) {
			/*global activate_page */
			opcion(this);
		});


		$(document).on("click", "#btn-check", function (evt) {
			/*global activate_page */
			aceptarTerminos(this);
			//opcion(this);
		});

		$(document).on("click", "#btn-cuneta-next", function (evt) {
			/*global activate_page */
			siguineteCuneta();
		});

		$(document).on("click", "#avanzarTaxi", function (evt) {
			/*global activate_page */
			avanzarGeneric("#encender");
		});

		$(document).on("click", "#btn-encender-next", function (evt) {
			/*global activate_page */
			siguienteEncender();
		});

		$(document).on("click", "#btn-quetiene-next", function (evt) {
			/*global activate_page */
			siguienteQuetiene();

		});

		$(document).on("click", "#btn-choque-next", function (evt) {
			/*global activate_page */
			siguienteChoque();

		});



		$(document).on("click", "#btn-otrafalla-next", function (evt) {
			/*global activate_page */
			siguienteOtrafalla();

		});

		$(document).on("click", "#btn-multiop", function (evt) {
			/*global activate_page */
			multiopcion(this);
		});

		$(document).on("click", "#btn-cauchos-next", function (evt) {
			/*global activate_page */
			siguineteCauchos();
		});

		$(document).on("click", "#btn-cambiollanta-next", function (evt) {
			/*global activate_page */
			siguienteCambiollanta();
		});


		$(document).on("click", "#btn-masdetalles-next", function (evt) {
			/*global activate_page */
			siguienteMasdetalles();
		});

		$(document).on("click", "#btn-detalles-next", function (evt) {
			/*global activate_page */
			siguienteDetalles();
		});

		$(document).on("click", "#btn-reubicar", function (evt) {
			/*global activate_page */
			UbicarEnMapa(mapas.Origen,gpsLatlng);
		});

		$(document).on("click", "#btn-reubicar-destino", function (evt) {
			/*global activate_page */
			UbicarEnMapa(mapas.Destino,destinoLatlng);
		});


		$(document).on("click", "#btn-enviar-next", function (evt) {
			/*global activate_page */
			enviarGPS();
		});

		$(document).on("click", "#btn-destino-next", function (evt) {
			/*global activate_page */
			siguienteDestino();
		});

		$(document).on("click", "#btn-ajustar-next", function (evt) {
			/*global activate_page */
			siguienteAjustar();
		});

		$(document).on("click", "#btn-add", function (evt) {
			/*global activate_page */
			showResumen();
		});


		$(document).on("click", "#cancelarSolicitud", function (evt) {
			/*global activate_page */
			cancelarSolicitud(); //solicitud.js
		});


		$(document).on("click", "#btn-solicitar", function (evt) {
			/*global activate_page */
			siguienteResumen(this); //app.js
		});


		$(document).on("click", "#btn-show-gura", function (evt) {
			/*global activate_page */
			mostrarGrua(this); //servicio.js
		});

		$(document).on("click", "#callGrua", function (evt) {
			/*global activate_page */
			llamarGrua(); //servicio.js
		});

		$(document).on("click", "#btn-call-gruero", function (evt) {
			/*global activate_page */
			llamarGrua(); //servicio.js
		});


		$(document).on("click", "#btn-localizar", function (evt) {
			/*global activate_page */
			localizar(this); //servicio.js
		});

		$(document).on("click", "#btn-cancelar-servicio", function (evt) {
			/*global activate_page */
			cancelarServicio(); //servicio.js
		});

		$(document).on("click", "#cancelacion", function (evt) {
			/*global activate_page */
			cancelacion(); //servicio.js
		});

		$(document).on("click", "#confirmarAsistencia", function (evt) {
			/*global activate_page */
			confirmarAsistencia();
		});

		$(document).on("click", "#rechazarAsistencia", function (evt) {
			/*global activate_page */
			rechazarAsistencia();
		});


		$(document).on("click", "#activarRatings", function (evt) {
			/*global activate_page */
			clearTimeout(callInterval);
			activate_page('#Encuesta');
			openHelpEncuesta(); //rating.js
		});


		$(document).on("click", "#btn-ratin", function (evt) {
			/*global activate_page */
			setRatin(this); //rating.js
		});

		$(document).on("click", "#btn-rating-next", function (evt) {
			/*global activate_page */
			enviarRatings(); //rating.js
		});

		$(document).on("click", "#btn-encuesta", function (evt) {
			/*global activate_page */
			encuesta(this); //rating.js
		});

		$(document).on("click", "#btn-finalizar", function (evt) {
			/*global activate_page */
			finalizar(); //rating.js
		});



		///PRUEBA BOTON 
		$(document).on("click", "#btn-prueba", function (evt) {
			/*global activate_page */
			probarboton(this);
			//	finalizar(this.v); //rating.js
		});

	}
	document.addEventListener("app.Ready", register_event_handlers, false);
})();