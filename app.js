const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');


const geocode = require('./geocode/geocode.js');
const weather = require('./weather/weather.js');

let app = express();


// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//stylesheets
app.use('/public', express.static(__dirname + '/public'));

// Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		let namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length) {
			formParam += `[%{namespace.shift()}]`;
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Globals
app.use(function(req, res, next) {
	res.locals.errors = null;
	res.locals.address = null;
	next();
});

// Routing
app.get('/', function(req, res) {
	res.render('index');
});

app.post('/getweather', function(req, res) {
	req.checkBody('address', 'address is required').notEmpty();
	let errors = req.validationErrors();

	if(errors){
		console.log('Error');
		res.render('index', {
			errors: errors,
		});
	} else {
		console.log('success');
		let address = req.body.address;
		geocode.geocodeAddress(address, function(geoError, geoResults) {
			if(geoError) {
				//error handling
				console.log(geoError);
			} else {
				weather.getWeather(geoResults.latitude, geoResults.longitude, function(weatherError, weatherResults) {
					if(weatherError) {
						console.log(weatherError);
					} else {
						res.render('index', {
							address: geoResults.address,
							temperature: weatherResults.temperature,
							conditions: weatherResults.conditions,
							windSpeed: weatherResults.windSpeed,
							thisWeek: weatherResults.thisWeek
						});
					}
				})
				
			}
		});
	}
})

app.listen(3000, function() {
	console.log('Server started on port 3000');
});