var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var Layout = mongoose.model('Layout', {
	name: String,
	layout: Array
});

app.use(bodyParser.json());

//allow cross site stuff
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/create', function(req, res)
{
	var layout = new Layout(req.body);
	layout.save(function(err) {
			if(err) throw err;

			console.log('record added');
		});
	res.status(200);
	res.send('success');
});

app.post('/update', function(req, res)
{
	Layout.findByIdAndUpdate(req.body.id, {name : req.body.name, layout : req.body.layout}, function(err,result)
	{
		if(err) throw err;

		console.log('record updated');
		res.status(200);
		res.send('success');
	});
});

app.get('/getall', getAll);

function getAll(req, res)
{
	Layout.find({}).exec(function(err,result)
	{
		if(err) 
		{
			res.send(err);
		} else {
			res.send(result);
		}
	})
}

app.post('/deleteall', function(req, res)
{
	deleteAll();
	res.status(200);
});

function deleteAll()
{
	Layout.find({}).remove(function(err,result)
	{
		if(err) console.log(err);
		console.log('all records removed');
	});
}	

mongoose.connect("mongodb://localhost:27017/test", function(err,db)
{
	if(!err) console.log("connected to database");
});

var server = app.listen(5000, function(){
	console.log('server listening on port ', server.address().port);
});