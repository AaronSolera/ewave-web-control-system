//server.js
const express 	= require('express');
const mongoose 	= require('mongoose');
const bodyParser = require("body-parser");
const app 		= express();

//DataBase connection
mongoose.connect('mongodb://localhost:27017/WCS');

/*-----------------------------------------------------------------------------------------------------------------------------------------------
	Code for connecting to multiple replicas
-------------------------------------------------------------------------------------------------------------------------------------------------
const options = {
    autoReconnect: true,
    replicaSet: 'replica1'
};
mongoose.connect('mongodb://localhost:27018,localhost:27020,localhost:27019/TECPlane', options, function(err) {
    console.log('err', err);
});*/

//Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));		
app.use(express.logger('dev'));						
app.use(express.methodOverride());	

//DataBase Schemas
var administrator_schema = new mongoose.Schema({
    "Email": String,
	"Password": String
},  { versionKey: false });

var measure_schema = new mongoose.Schema({
	"Pressure 1": Number,
	"Pressure 2": Number, 
	"Turbine frequency": Number, 
	"Current": Number,
	"Voltage": Number,
	"Date": {type: Date, default: Date.now}
},  { versionKey: false });

// Sets the Date parameter equal to the current time
measure_schema.pre('save', function(next){
	now = new Date();
	now.setHours( now.getHours() - 6);
    this.Date = now;
    next();
});

//DataBase Models
var models = {
	"administrator": 	mongoose.model('administrators', administrator_schema),
	"measure":			mongoose.model('measures',       measure_schema)
};

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  API requests for GET, POST and DELETE operations
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Lee todos los datos de un modelo específico y selecciona las columnas bajo el parametro data
app.get('/api/read/:model/:data', function(req, res) {				
	models[req.params.model].find(function(err, data) {
		if(err) res.send(err);
		res.json(data);
	}).select(JSON.parse(req.query.data));
});

//Lee la primera aparición del modelo específico bajo una condición dada
app.get('/api/read/one/:model/:condition', function(req, res) {				
	models[req.params.model].findOne(JSON.parse(req.query.condition), function(err, data) {
		if(err) res.send(err);
		res.json(data);
	});
});

//Lee la última inserción del modelo especificcado
app.get('/api/read/last/:model/:data', function(req, res) {				
	models[req.params.model].find(function(err, data) {
		if(err) res.send(err);
		res.json(data.pop());
	});
});

//Lee todos los datos de un modelo específico bajo una condición dada
app.get('/api/read/all/:model/:condition', function(req, res) {				
	models[req.params.model].find(JSON.parse(req.query.condition), function(err, data) {
		if(err) res.send(err);
		res.json(data);
	});
});

//Crea un dato de un modelo específico y devuelve los datos de las columnas establecidas en el parámetro data
app.post('/api/create/:model/:data', function(req, res) {				
	models[req.params.model].create(req.body, function(err){
		if(err) {
			res.send(err);
		}
		/*
		models[req.params.model].find(function(err, data) {
			if(err){
				res.send(err);
			}
			res.json(data);
		}).select(JSON.parse(req.query.data));*/
	});
});

//Edita un dato específico de un modelo y devuelve los datos de las columnas establecidas en el parámetro data
app.put('/api/update/:model/:id/:data', function(req, res) {
	models[req.params.model].findByIdAndUpdate(req.params.id, req.body, function(err) {
		if(err) {
			res.send(err);
		}
		models[req.params.model].find(function(err, data) {
			if(err){
				res.send(err);
			}
			res.json(data);
		}).select(JSON.parse(req.query.data));
	});
});

//Borra un dato específico de un modelo y devuelve los datos de las columnas establecidas en el parámetro data
app.delete('/api/delete/:model/:id/:data', function(req, res) {		
	models[req.params.model].remove({
		_id: req.params.id
	}, function(err) {
		if(err){
			res.send(err);
		}
		models[req.params.model].find(function(err, data) {
			if(err){
				res.send(err);
			}
			res.json(data);
		}).select(JSON.parse(req.query.data));
	})
});

// Charge a simple HTML view where our Single App Page will go
// Angular is in charge of frontend
app.get('*', function(req, res) {						
	res.sendfile('./public/index.html');				
});

// Listening port 3000 and start the server
app.listen(3000, function() {
	console.log('App listening on port 3000');
});