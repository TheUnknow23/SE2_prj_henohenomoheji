
const express = require('express');
const app = express();
const PORT = process.env.PORT || 443;

app.get('/', function(req, res) {
	res.send('Hello, world!');
});

app.listen(PORT, function(){
	console.log('Server running on port ' + PORT);
});
