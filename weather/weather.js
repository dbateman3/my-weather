const request = require('request');

let getWeather = function(lat, lng, callback) {
	request({
		url: `https://api.darksky.net/forecast/2df076a676988d220ee69dd45e020547/${lat},${lng}`,
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