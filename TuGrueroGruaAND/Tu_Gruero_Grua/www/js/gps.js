function callGPS() {
	//console.log("CallGPS");
	navigator.geolocation.getCurrentPosition(exitoGPS, errorGPS, {
		maximumAge: 0, timeout: 25000, enableHighAccuracy: true
	});
}


var gpsLatlng;

function exitoGPS(position) {
//console.log(position.coords.latitude);
	gpsLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	makeMapa("mapaorigen", gpsLatlng);

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Ubicacion",
		"mensaje": "La posición mostrada es aproximada. Si desea una mas precisa ajústela en el mapa.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text":['','','','Aceptar'],
		//"idBotones": ["", "", "", ""],
		"onClick": ["", "", "", "closePops()"]
	};

	genericPop(parametros);

}

function errorGPS(error) {
	console.log(error.message);

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": "Ha ocurrido un error en el lectura de su ubicación, por favor revise que su dispositivo tenga habilitado el acceso a su ubicación por GPS y redes móviles",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'inline', 'none', 'none'],
		"text":['','Aceptar','',''],
		//"idBotones": ["", "back-btn", "", ""]
		"onClick": ["", "BackGPS()", "", ""],
	};

	genericPop(parametros);

}


function reubicar(mGps) {
	mapa.panTo(mGps);
	mapa.setZoom(16);
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






