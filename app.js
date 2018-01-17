const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');


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

app.post('/', [
	check('address')
		.exists().withMessage('must be valid address')
		.isLength({min: 5}).withMessage('5 chars min')


	], function(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log('Error');
			res.render('index', {
			errors: validationResult(req).array(),
			});
		} else {
		console.log('no validation error');
		
		let address = req.body.address;
		
		geocode.geocodeAddress(address, function(geoError, geoResults) {
			if(geoError) {
				//geo error handling
				console.log(geoError);
				
			} else {
				console.log('no geo error')
				weather.getWeather(geoResults.latitude, geoResults.longitude, function(weatherError, weatherResults) {
					if(weatherError) {
						//weather error handling
						console.log(weatherError);
					} else {
						console.log('success');
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
});

app.listen(3000, function() {
	console.log('Server started on port 3000');
});