const express = require('express');

let app = express();

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.listen(3000, function() {
	console.log('App booted and listening on port 3000');
});