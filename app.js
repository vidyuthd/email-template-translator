
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes')
	api = require('./routes/api');


var app = express();

// Configuration

app.configure(function(){
	app.set('views',__dirname + '/views');
	app.set('view engine','jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partial/:name', routes.partial);
app.post('/file-upload',routes.fileUpload);
app.get('/downloads/static/:file',routes.fileDownload);
app.get('/makeFiles',routes.makeTemplates);
app.get('/downloadZip',routes.downloadZip);
app.get('/deleteFile/:file',routes.deleteFile);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
