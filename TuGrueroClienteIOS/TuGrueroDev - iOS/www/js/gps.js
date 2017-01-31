function callGPS() {
	//console.log("CallGPS");
	navigator.geolocation.getCurrentPosition(exitoGPS, errorGPS, {
		maximumAge: 0, timeout: 25000, enableHighAccuracy: true
	});
}

var position;
var gpsLatlng;

function exitoGPS(mpos) {

	localStorage.latitud = mpos.coords.latitude;
	localStorage.longitud = mpos.coords.longitude;
	position = mpos;
	avanzarGeneric('#origen');
	MakeOrigen();
}

function errorGPS(error) {
	console.log(error);

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": "Ha ocurrido un error en el lectura de su ubicación, por favor revise que su dispositivo tenga habilitado el acceso a su ubicación por GPS y redes móviles",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'inline', 'none', 'none'],
		"text": ['', 'Aceptar', '', ''],
		"onClick": ["", "BackGPS()", "", ""],
	};

	genericPop(parametros);

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






