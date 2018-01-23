const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const compression = require('compression');


const geocode = require('./geocode/geocode.js');
const weather = require('./weather/weather.js');

// Configure port for heroku
const port = process.env.PORT || 3000;

// init express app
let app = express();

// Conpress response
app.use(compression());


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
		.isLength({min: 5}).withMessage('Must be a valid address')


	], function(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render('index', {
			errors: validationResult(req).array(),
			});
		} else {
		
		let address = req.body.address;
		
		geocode.geocodeAddress(address, function(geoError, geoResults) {
			

			if(geoError) {
				res.render('index', {
					errors: [{
						msg: geoError
					}],
				});
				
			} else {
				weather.getWeather(geoResults.latitude, geoResults.longitude, function(weatherError, weatherResults) {
					if(weatherError) {
						res.render('index', {
							errors: [{
								msg: weatherError
							}],
						});
					} else {
						res.render('index', {
							address: geoResults.address,
							temperature: weatherResults.temperature,
							conditions: weatherResults.conditions,
							windSpeed: weatherResults.windSpeed,
							thisWeek: weatherResults.thisWeek
						});
					}
				});
				
			}
		});
	}
});

// Error 404 handling
app.use(function(req, res, next) {
	res.status(404).send('Something broke!');
});


// Start up server
app.listen(port, function() {
	console.log(`Server is up on ${port}`);
});