const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var auth = require ('./routes/auth');
var exam_submission = require ('./routes/exam_submission');
var groups = require ('./routes/groups');
var exam_peer_reviews = require ('./routes/exam_peer_reviews');
var logout = require ('./routes/logout');

app.use('/', index);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/auth', auth);
app.use('/exam_submission', exam_submission);
app.use('/groups', groups);
app.use('/exam_peer_reviews', exam_peer_reviews);
app.use('/logout', logout);

app.listen(PORT, function(){
	console.log('Server running on port ' + PORT);
});
