const request = require('request');

let geocodeAddress = function(address, callback) {
	let encodedAddress = encodeURIComponent(address);
	console.log('encoded address');

	request({
		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
		json: true,
		forever: true,
	}, function(error, response, body) {
		if(error) {
			callback('Unable to connect to server');
		} else if(body.status === 'ZERO_RESULTS') {
			callback('Unable to find address');
		} else if(body.status === 'OK') {
			console.log('recieved geo results');
			callback(undefined, {
				address: body.results[0].formatted_address,
				latitude: body.results[0].geometry.location.lat,
				longitude: body.results[0].geometry.location.lng
			});
		}
	});
};

module.exports = {
	geocodeAddress
};

