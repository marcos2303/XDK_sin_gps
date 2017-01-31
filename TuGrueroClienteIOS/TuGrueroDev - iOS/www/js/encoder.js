var parSolicitud = {
	"QueOcurre": "",
	"Enciende": "",
	"QueTiene": "",
	"CambioLlanta": "",
	"MasDetalles": "",
	"DetallesImportante": ""
};



function encodeSolicitud() {
//	var parCode = [];
	//parCode.push(queOcurre(parSolicitud.QueOcurre));
	//parCode.push(enciendeVehiculo(parSolicitud.Enciende));
	//parCode.push(queTiene(parSolicitud.QueTiene));
	//parCauchos(parCode);
	//parCode.push(cambioLlanta(parSolicitud.CambioLlanta));
	//parCode.push(masDetalles(parSolicitud.MasDetalles));
	//parCode.push(detallesImportantes(parSolicitud.DetallesImportante));

//	solicitud.Parametros = parCode.join("");
	encodeCauchos();
//	console.log(solicitud);
}

function encodeCauchos() {
	var neumaticos =[];
	for (var c = 0; c < cauchos.length; c++) {
		neumaticos.push((cauchos[c] !== "0") ? 1 : 0);
	}
	solicitud.Neumaticos = neumaticos.join("");
}


function queOcurre(valor) {

	switch (valor) {
	case "Falla de encendido":
		return 1;

	case "Volante/Palanca trabada":
		return 2;

	case "Encunetado":
		return 3;

	case "Neumático espichado":
		return 4;

	case "Otra falla":
		return 5;

	case "Choqué":
		return 6;

	default:
		return 0;
	}
}

function enciendeVehiculo(valor) {

	return (valor === "si") ? 1 : 2;
}

function queTiene(valor) {
	switch (valor) {
	case "neumaticos":
		return 1;

	case "llaves":
		return 2;

	case "guardafango":
		return 3;

	case "volante":
		return 4;

	case "palanca":
		return 5;

	case "otra":
		return 6;

	default:
		return 0;

	}
}


function parCauchos(parCode) {
	for (var c = 0; c < cauchos.length; c++) {
		parCode.push((cauchos[c] !== "0") ? 1 : 0);
	}
}

function cambioLlanta(valor) {
	return (valor === "si") ? 1 : 2;
}


function masDetalles(valor) {
	switch (valor) {
	case "repuesto":
		return 1;

	case "gato":
		return 2;

	case "llave":
		return 3;

	default:
		return 0;
	}


}

function detallesImportantes(valor) {
	switch (valor) {
	case "plana":
		return 1;

	case "inclinada":
		return 2;

	case "atascado":
		return 3;

	case "sotano":
		return 4;

	default:
		return 0;

	}

}