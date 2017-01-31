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


//var googleOK = false;

var mapas = {
	"mapaDir": null,
	"mapaRuta": null,
	"mapaDestino": null,
};

var gpsMarcadores = {
	"Origen": "",
	"Destino": "",
	"Grua": "",

};

var SVG = {
	"Origen": 'images/SVGs/Carro.svg',
	"Destino": 'images/SVGs/Destino.svg',
	"Grua": 'images/SVGs/Grua.svg'
};

var markDirecciones = [];
var markRuta = [];
var markDestinos = [];



function reloadGoogleMaps(callback) {

	var parametros = {
		"popup": "popupInico",
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
			"popup": "popupInico",
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

/*
function mapsCallback() {
	googleOK = true;
}
*/

function MakeDirections() {
	if (typeof google === 'object' && typeof google.maps === 'object') {
		gpsMarcadores.Origen = new google.maps.LatLng(laSolicitud.latOrigen, laSolicitud.lngOrigen);
		gpsMarcadores.Grua = new google.maps.LatLng(gruaParam.Lat, gruaParam.Lng);
		if (mapas.mapaDir === null) {
			mapas.mapaDir = makeMapa("mapdirecciones", gpsMarcadores.Origen);

		} else {
			google.maps.event.trigger(mapas.mapaDir, 'resize');
			UbicarEnMapa(mapas.mapaDir, gpsMarcadores.Origen);
		}
		closePops();
		SetDirecciones();
	} else {
		reloadGoogleMaps(MakeDirections);
	}
}



function MakeRuta() {
	if (typeof google === 'object' && typeof google.maps === 'object') {
		gpsMarcadores.Grua = new google.maps.LatLng(gruaParam.Lat, gruaParam.Lng);
		gpsMarcadores.Origen = new google.maps.LatLng(laSolicitud.latOrigen, laSolicitud.lngOrigen);

		if (mapas.mapaRuta === null) {
			mapas.mapaRuta = makeMapa("maparuta", gpsMarcadores.Origen);
		} else {
			google.maps.event.trigger(mapas.mapaRuta, 'resize');
			UbicarEnMapa(mapas.mapaRuta, gpsMarcadores.Origen);
		}
		closePops();
		SetRuta();
	} else {
		reloadGoogleMaps(MakeRuta);

	}
}



function MakeDestino() {
	if (typeof google === 'object' && typeof google.maps === 'object') {
		gpsMarcadores.Grua = new google.maps.LatLng(gruaParam.Lat, gruaParam.Lng);
		gpsMarcadores.Destino = new google.maps.LatLng(laSolicitud.latDestino, laSolicitud.lngDestino);

		if (mapas.mapaDestino === null) {
			mapas.mapaDestino = makeMapa("mapadestino", gpsMarcadores.Destino);
		} else {
			google.maps.event.trigger(mapas.mapaDestino, 'resize');
			UbicarEnMapa(mapas.mapaDestino, gpsMarcadores.Destino);
		}
		closePops();
		SetDestino();
	} else {
		reloadGoogleMaps(MakeDestino);
	}
}



function makeMapa(mID, mlatlng) {


	var mapOptions = {};
	mapOptions.zoom = 14;
	mapOptions.center = mlatlng;
	mapOptions.disableDefaultUI = true;
	mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;

	var map = new google.maps.Map(document.getElementById(mID), mapOptions);
	return map;
}



function SetDirecciones() {

	markDirecciones = BorrarMarcadores(markDirecciones);
	var marcador;
	marcador = new google.maps.Marker({
		position: gpsMarcadores.Origen,
		map: mapas.mapaDir,
		icon: SVG.Origen
	});
	markDirecciones.push(marcador);

	gpsMarcadores.Destino = new google.maps.LatLng(laSolicitud.latDestino, laSolicitud.lngDestino);
	marcador = new google.maps.Marker({
		position: gpsMarcadores.Destino,
		map: mapas.mapaDir,
		icon: SVG.Destino
	});
	markDirecciones.push(marcador);

	/*marcador = new google.maps.Marker({
		position: gpsMarcadores.Grua,
		map: mapas.mapaDir,
		icon: SVG.Grua
	});
	markDirecciones.push(marcador);*/

	for (var i = 0; i < markDirecciones.length; i++) {
		markDirecciones[i].setMap(mapas.mapaDir); //insertando marcadores
	}

}



function SetRuta() {
	markRuta = BorrarMarcadores(markRuta);
	var marcador;
	marcador = new google.maps.Marker({
		position: gpsMarcadores.Origen,
		map: mapas.mapaRuta,
		icon: SVG.Origen
	});
	markRuta.push(marcador);

	gpsMarcadores.Destino = new google.maps.LatLng(laSolicitud.latDestino, laSolicitud.lngDestino);
	marcador = new google.maps.Marker({
		position: gpsMarcadores.Destino,
		map: mapas.mapaRuta,
		icon: SVG.Destino
	});
	markRuta.push(marcador);

	/*marcador = new google.maps.Marker({
		position: gpsMarcadores.Grua,
		map: mapas.mapaRuta,
		icon: SVG.Grua
	});
	markRuta.push(marcador);*/

	for (var i = 0; i < markRuta.length; i++) {
		markRuta[i].setMap(mapas.mapaRuta); //insertando marcadores
	}

	if (callInterval !== null)
		clearInterval(callInterval);

	callInterval = setTimeout(function () {
		refreshGruaPos(mapas.mapaRuta);
	}, 1000);
}


function SetDestino() {
	markDestinos = BorrarMarcadores(markDestinos);
	var marcador;

	marcador = new google.maps.Marker({
		position: gpsMarcadores.Destino,
		map: mapas.mapaDestino,
		icon: SVG.Destino
	});
	markDestinos.push(marcador);

	/*marcador = new google.maps.Marker({
		position: gpsMarcadores.Grua,
		map: mapas.mapaDestino,
		icon: SVG.Grua
	});
	markDestinos.push(marcador);*/

	for (var i = 0; i < markDestinos.length; i++) {
		markDestinos[i].setMap(mapas.mapaDestino); //insertando marcadores
	}

	if (callInterval !== null)
		clearInterval(callInterval);

	callInterval = setTimeout(function () {
		refreshGruaPos(mapas.mapaDestino);
	}, 1000);
}


function Localizar(elemento) {
	var gpsLatLng = gpsMarcadores[$(elemento).val()];
	var mapa = mapas[$(elemento).attr('mapa')];
	UbicarEnMapa(mapa, gpsLatLng);
}



function UbicarEnMapa(mapa, mLatlng) {
	mapa.panTo(mLatlng);
}



function BorrarMarcadores(marcadores) {
	for (var i = 0; i < marcadores.length; i++) {
		marcadores[i].setMap(null); //limpiando marcadores
	}
	marcadores = []; //borrando de la lista 
	return marcadores;
}



function refreshGruaPos(mapa) {
	console.log("newCall");
	gpsMarcadores.Grua = new google.maps.LatLng(gruaParam.Lat, gruaParam.Lng);

	if (mapa === mapas.mapaRuta) {
		markRuta[2].setPosition(gpsMarcadores.Origen);
	} else {
		markDestinos[1].setPosition(gpsMarcadores.Origen);
	}

	UbicarEnMapa(mapa, gpsMarcadores.Origen);

	/*callInterval = setTimeout(function () {
		refreshGruaPos(mapa);
	}, 30000);*/

}