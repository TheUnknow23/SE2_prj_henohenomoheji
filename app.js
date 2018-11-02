const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');

app.use('/', index);
app.use('/users', users);
app.use('/tasks', tasks);

app.listen(PORT, function(){
	console.log('Server running on port ' + PORT);
});
