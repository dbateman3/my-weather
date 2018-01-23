const request = require('request');

const weatherKey = require('./weather-key.js');



let getWeather = function(lat, lng, callback) {
	let key = weatherKey.getKey();

	request({
		url: `https://api.darksky.net/forecast/${key}/${lat},${lng}`,
		json: true,

	}, function(error, response, body) {
		if(!error && response.statusCode === 200) {
			callback(undefined, {
				temperature: body.currently.temperature,
				conditions: body.currently.summary,
				windSpeed: body.currently.windSpeed,
				thisWeek: body.daily.summary,
			});
		} else {
			callback('Unable to get weather');
		}
	});
};

module.exports = {
	getWeather
};