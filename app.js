const express = require('express');
let bodyParser = require('body-parser');

let app = express();


// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Routing
app.get('/', function(req, res) {
	res.render('index');
});

app.listen(3000, function() {
	console.log('Server started on port 3000');
});