/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

/*
(function () {
	'use strict'; //Para detectar eventos
	document.addEventListener('app.Ready', deferred, false);

	function deferred() {
		gpsLatlng = new google.maps.LatLng(10.4921509, -66.8772886);
		gpsGrua = new google.maps.LatLng(10.4921509, -66.8762886);
	}
})();
*/
var mapa;
var destinoLatlng;
var correctedGpsLatlng;
var correctedDestinoLatlng;
var gpsGrua;

var gooleOK = false;

var marcadores = [];
var refreshMapa;

var mapas = {
	"Origen": null,
	"Destino": null,
	"Trayecto": null,
};

var gpsMarcadores = {
	"Origen": "",
	"Grua": "",
};

var SVG = {
	"Origen": 'images/SVGs/Carro.svg',
	"Grua": 'images/SVGs/Grua.svg'
};


var markTrayecto = [];


function reloadGoogleMaps(callback) {

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Conectando",
		"mensaje": "Cargando librería de mapas, por favor espere.",
		"displaybarra": ['Block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};

	genericPop(parametros);

	var uri = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBFeSlIAjDg8U7zsWW82uJCNLi3IZxq9fI"

	//console.log(extra);
	jqxhr = $.ajax({
		url: uri,
		type: "GET",
		dataType: "Script",
		timeout: 20000,
	});

	jqxhr.done(function (data) {
		mapsRealoaded(callback);
	});

	jqxhr.fail(function (jqXHR, textStatus) {
		console.log(textStatus);
		jqxhr.abort();
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Alerta",
			"mensaje": '(' + textStatus + ') Ha ocurrido un problema en la descargada del mapa.',
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'inline'],
			"text": ['', '', 'Cerrar', 'Reintentar'],
			"onClick": ["", "", "closePops()", callback.name + '()']
		};

		genericPop(parametros);

	});

}

function mapsRealoaded(callback) {
	//	googleOK = true;
	callback();
}


function MakeOrigen() {

	if (typeof google === 'object' && typeof google.maps === 'object') {

		var parametros = {
			"popup": "pop-generic",
			"imagen": "Ubicacion",
			"mensaje": "La posición mostrada es aproximada. Si desea una mas precisa ajústela en el mapa.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Aceptar'],
			"onClick": ["", "", "", "closePops()"]
		};

		genericPop(parametros);
		gpsLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		if (mapas.Origen === null) {
			mapas.Origen = makeMapa("mapaorigen", gpsLatlng);
		} else {
			google.maps.event.trigger(mapas.Origen, 'resize');
			UbicarEnMapa(mapas.Origen, gpsLatlng);
		}
	} else {
		//var callback = MakeOrigen;
		reloadGoogleMaps(MakeOrigen);
	}
}



function MakeDestino(myLatlng) {

	if (mapas.Destino === null) {
		mapas.Destino = makeMapa("mapadestino", myLatlng);
	} else {
		google.maps.event.trigger(mapas.Destino, 'resize');
		UbicarEnMapa(mapas.Destino, myLatlng);
	}

}


function MakeTrayecto() {
	if (typeof google === 'object' && typeof google.maps === 'object') {

		console.log(solicitud);
		carrolatlng = new google.maps.LatLng(solicitud.latOrigen, solicitud.lngOrigen);
		grualatlng = new google.maps.LatLng(solicitud.latDestino, solicitud.lngDestino);

		gpsMarcadores.Origen = carrolatlng;
		gpsMarcadores.Grua = grualatlng;

		console.log(datos.Latitud, datos.Longitud);
		if (mapas.Trayecto === null) {
			mapas.Trayecto = makeMapa("mapatrayecto", gpsMarcadores.Origen);

			setTimeout(function () {
				UbicarEnMapa(mapas.Trayecto, gpsMarcadores.Origen);
			}, 300);


		} else {
			google.maps.event.trigger(mapas.Trayecto, 'resize');
			UbicarEnMapa(mapas.Trayecto, gpsMarcadores.Origen);
		}
		SetTrayecto();
	} else {
		reloadGoogleMaps(MakeTrayecto);
	}
}




function makeMapa(mID, mlatlng) {

	var mapOptions = {};
	mapOptions.zoom = 15;
	mapOptions.center = mlatlng;
	mapOptions.disableDefaultUI = true;
	mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;

	var map = new google.maps.Map(document.getElementById(mID), mapOptions);
	return map;
}


/*

function makeMapa(mID, mlatlng) {
	console.log(mlatlng.lat());
	var mapOptions = {};
	mapOptions.zoom = 16;
	mapOptions.center = mlatlng;
	mapOptions.disableDefaultUI = true;
	mapa = new google.maps.Map(document.getElementById(mID), mapOptions);
	google.maps.event.trigger(mapa, 'resize');

	
	//Protección contra doble Grua.
	if (marcadores.length !==0){
		BorrarMarcadores();
	}
}

*/


function UbicarEnMapa(mapa, mLatlng) {
	mapa.panTo(mLatlng);
}

/*
function refreshGruaPos() {
	
	marcadores[1].setPosition(grualatlng);
	ubicar(grualatlng);
}
*/

function refreshGruaPos() {
	mapa = mapas.Trayecto;
	console.log("newCall");
	gpsMarcadores.Grua = grualatlng;
	//markTrayecto[1].setPosition(gpsMarcadores.Grua);

	UbicarEnMapa(mapa, gpsMarcadores.Origen);

	/*
	callInterval = setTimeout(function () {
		refreshGruaPos(mapa);
	}, 30000);
*/
}



/*
function setCarros() {
	mlatlng = (mlatlng === "") ? new google.maps.LatLng(10.4921509, -66.8762886) : mlatlng;
	grualatlng = (grualatlng === "") ? new google.maps.LatLng(10.5961509, -66.9732886) : grualatlng;

	makeMapa("mapatrayecto", mlatlng);
	addMarkers();
}

function addMarkers() {
	
	if (marcadores.length !==0){
		BorrarMarcadores();
	}
	
	var carro = 'images/SVGs/Carro.svg';
	var grua = 'images/SVGs/Grua.svg';
	var marcador = new google.maps.Marker({
		position: mlatlng,
		map: mapa,
		icon: carro
	});
	marcadores.push(marcador);

	marcador = new google.maps.Marker({
		position: grualatlng,
		map: mapa,
		icon: grua
	});
	marcadores.push(marcador);

	for (var i = 0; i < marcadores.length; i++) {
		marcadores[i].setMap(mapa); //insertando marcadores
	}

}
*/

function SetTrayecto() {
	markTrayecto = BorrarMarcadores(markTrayecto);
	var marcador;

	marcador = new google.maps.Marker({
		position: gpsMarcadores.Origen,
		map: mapas.Trayecto,
		icon: SVG.Origen
	});
	markTrayecto.push(marcador);

	/*marcador = new google.maps.Marker({
		position: gpsMarcadores.Grua,
		map: mapas.Trayecto,
		icon: SVG.Grua
	});
	markTrayecto.push(marcador);*/

	for (var i = 0; i < markTrayecto.length; i++) {
		markTrayecto[i].setMap(mapas.Trayecto); //insertando marcadores
	}

	/*
	if (callInterval !== null)
		clearInterval(callInterval);
		*/

}




function BorrarMarcadores(marcadores) {
	for (var i = 0; i < marcadores.length; i++) {
		marcadores[i].setMap(null); //limpiando marcadores
	}
	marcadores = []; //borrando de la lista 
	return marcadores;
}




function reverseGeo(mLatlng) {
	var geocoder = new google.maps.Geocoder();
	mLatlng = new google.maps.LatLng(mapas.Origen.getCenter().lat(), mapas.Origen.getCenter().lng());
	var latlng = {
		lat: mapas.Origen.getCenter().lat(),
		lng: mapas.Origen.getCenter().lng()
	};
	//	$(".uib_w_13").modal("show"); //JQuery call
	geocoder.geocode({
		'location': latlng
	}, success);
}

function reverseGeoDestino(mLatlng) {
	var geocoder = new google.maps.Geocoder();
	mLatlng = new google.maps.LatLng(mapas.Destino.getCenter().lat(), mapas.Destino.getCenter().lng());
	var latlng = {
		lat: mapas.Destino.getCenter().lat(),
		lng: mapas.Destino.getCenter().lng()
	};
	//$(".uib_w_13").modal("show"); //JQuery call
	geocoder.geocode({
		'location': latlng
	}, successDestino);
}

//var success = function (resultado,status){ //Delegado
function success(resultado, status) {
	if (status === google.maps.GeocoderStatus.OK) {
		console.log(resultado);
		//var mDir;
		var mEstate;
		for (var i = 0; i < resultado.length; i++) {

			//if (resultado[i].types[0] === "route" || resultado[i].types[0] === "street_address"|| resultado[i].types[0] === "premise")
			//mDir = resultado[i].formatted_address;

			if (resultado[i].types[0] === "administrative_area_level_1")
				mEstate = resultado[i].address_components[0].long_name;
		}
		if (mEstate === "Capital District")
			mEstate = "Distrito Capital";

		if (mEstate === 'undefined')
			mEstate = 'indeterminado';

		solicitud.EstadoOrigen = mEstate;
		console.log(mEstate);
		//reemplazar(mDir, mEstate);
	} else {
		//reemplazar(document.getElementById("popup"));
		console.log("ERROR");
	}
}

var defaultDiacriticsRemovalMap = [
	{
		'base': 'a',
		'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
	},

	{
		'base': 'e',
		'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
	},

	{
		'base': 'i',
		'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
	},
	{
		'base': 'o',
		'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
	},
	{
		'base': 'u',
		'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
	}
];

var changes;

function removeDiacritics(str) {
	if (!changes) {
		changes = defaultDiacriticsRemovalMap;
	}
	for (var i = 0; i < changes.length; i++) {
		str = str.replace(changes[i].letters, changes[i].base);
	}
	return str;
}


function successDestino(resultado, status) {
	if (status === google.maps.GeocoderStatus.OK) {
		var mDir;
		var mEstate;
		console.log(resultado);
		for (var i = 0; i < resultado.length; i++) {
			if (resultado[i].types[0] === "route" || resultado[i].types[0] === "street_address") {
				mDir = resultado[i].formatted_address;
				for (var j = 0; j < resultado[i].address_components.length; j++) {
					console.log(resultado[i].address_components[j]);
					for (var k = 0; k < resultado[i].address_components[j].types.length; k++) {

						if (resultado[i].address_components[j].types[k] === "administrative_area_level_1")
							mEstate = resultado[i].address_components[j].long_name;
					}
				}
			}


			if (mEstate === "Capital District")
				mEstate = "Distrito Capital";

		}


		var elEstado = mEstate.toLowerCase();
		elEstado = removeDiacritics(elEstado);
		var miEstado = JSON.parse(localStorage.misDatos).DireccionEDO.toLowerCase();
		miEstado = removeDiacritics(miEstado);

		console.log(mDir + ":" + mEstate);

		if (elEstado === miEstado || elEstado === undefined) {
			console.log("normal");
			ajusteDone();
			
		} else if (miEstado === "miranda" && elEstado === "distrito capital") {
			console.log("postajuste");
			ajusteDone();

		} else {

			ajusteError(mEstate);

		}

	} else {
		// reemplazar(document.getElementById("popup"));
		ajusteDone();
	}

}


function setAddress() {
	var estadoVal = $(document.getElementById("Estado")).val();
	var localidadVal = $(document.getElementById("Localidad")).val();
	var sectorVal = $(document.getElementById("Sector")).val();

	var OK = (estadoVal === "-") ? alert("Seleccione un estado") :
		(localidadVal === "") ? alert("Coloque la locoalidad a la cual se dirige") :
		(sectorVal === "") ? alert("Coloque el sector al cual se dirige") : "OK";

	if (OK === "OK") {
		console.log("Geocoder");
		geocoderAddres("Venezuela," + estadoVal + "," + localidadVal + "," + sectorVal);
	}
}

function geocoderAddres(mAddress) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address': mAddress
	}, geocodeSucces);
}

function geocodeSucces(results, status) {

	var parametros = {};
	if (status === google.maps.GeocoderStatus.OK) {
		console.log(results);
		destinoLatlng = results[0].geometry.location;
		console.log(destinoLatlng);

		makeMapa("mapadestino", results[0].geometry.location);
		MakeDestino(results[0].geometry.location);

		parametros = {
			"popup": "pop-generic",
			"imagen": "Casa",
			"mensaje": "La posición mostrada es aproximada. Por favor ajuste la posición directamente sobre el mapa.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', 'Continuar'],
			//"idBotones": ["", "", "", ""],
			"onClick": ["", "", "", "closePops()"]
		};

		genericPop(parametros);

	} else {

		parametros = {
			"popup": "pop-generic",
			"imagen": "Alto",
			"mensaje": "Ha introducido una destino no renonocible, por favor revise su destino o pruebe con uno alternativo.",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'inline', 'none', 'none'],
			"text": ['', 'Aceptar', '', ''],
			//"idBotones": ["", "back-btn", "", ""],
			"onClick": ["", "avanzarGeneric('#destino')", "", ""]
		};

		genericPop(parametros);

		//  alert("algo malo pasó:" + results);
	}
}


function ubicar(mLatlng) {
	mapa.panTo(mLatlng);
	mapa.setZoom(16);
}


function reemplazar(mDir, mEstate) {
	document.getElementById("barra").style.display = "none";
	var madre = document.getElementById("texto-estado");
	var hijo = madre.getElementsByTagName("p");
	hijo[0].innerHTML = mDir;
}

function resetModal() {
	document.getElementById("barra").style.display = "block";
	var madre = document.getElementById("texto-estado");
	var hijo = madre.getElementsByTagName("p");
	hijo[0].innerHTML = "Obteniendo";
}