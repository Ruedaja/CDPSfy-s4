var fs = require('fs');
var track_model = require('./../models/track');
var http = require ('http')
var track_model = require('./../models/track')
var dbtracks_model = require ('./../models/dbtracks')

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	var tracks = track_model.tracks;
	res.render('tracks/index', {tracks: tracks});
};


exports.searchDB = function(db, callback) {
   var cursor =db.collection('dbtracks').find(  );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	var track = track_model.tracks[req.params.trackId];
	track.id = req.params.trackId;
	res.render('tracks/show', {track: track});
};

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	var track = req.files.track;
	console.log('Nuevo fichero de audio. Datos: ', track);
	var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];

	
	// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
	var url = 'http://localhost:3000';

// Aquí debe implementarse la escritura del fichero de audio (track.buffer) en tracks.cdpsfy.es
	
sync.series([function(callback){
		var formData = {
			track: {
		    value:  track.buffer,
		    options: {
		      filename: name + "." + extension ,
					id : id,
					extension: extension,
		      contentType: track.mimetype
		    }
		  }
		};
		console.log(formData);
		request.post({
			url: url,
			formData: formData
		}
		, function optionalCallback(err, httpResponse, body) {
	  if (err) {
	    return console.error('upload failed:', err);
			callback(null, "error");
		}
	  	console.log('Upload successful!  Server responded with:', body);
			console.log("body: " + body);
			var bodyjson = JSON.parse(body);
			callback(null,bodyjson["url"]);
		});

	}],
	function(err,results){
		console.log("results: " + results.response);
		if(results.status != "error"){
			console.log(url + "/" +  results[0]);
			track_model.tracks[id] = {
				name: name,
				url: url +"/"+ results[0]
			};
		}
		res.redirect('/tracks');
	})
	// Escribe los metadatos de la nueva canción en el registro.

};

	// Escribe los metadatos de la nueva canción en el registro.


// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;
	var canción = track_model[trackId] 
	var trackURL = track.url

	delete track_model.tracks[trackId];
	res.redirect('/tracks');
};
