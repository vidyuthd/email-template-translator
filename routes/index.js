
/*
 * GET home page.
 */

var fs = require('fs')
,	translate = require('./translate')
,	Handlebars = require('handlebars')
,	properties = require ("properties-parser")
,	utils = require("./utils")
,	zip = require('express-zip')
,	path = require("path")
,	defaultPropFile = __dirname + '/downloads/static/default.properties'
,	userMap = {};

exports.index = function(req, res){
  res.render('index');
};

exports.partial = function (req, res) {
  var name = req.params.name;
  res.render('partials/partial' + name);
};

exports.fileDownload = function(req,res){
	var file = req.params.file
    , path = __dirname + '/downloads/static/' + file;
     res.download(path);
};

exports.makeTemplates = function(req,res){
	var userObj = userMap[req.ip];
	
	if(userObj)
	{
		var htmlFileArr = userObj.filter(function(file){ return file.match(/\w+\.html/ig) })
			,propertiesFileArr = userObj.filter(function(file){ return file.match(/\w+\.properties/ig) })
			,langsFileArr = userObj.filter(function(file){ return file.match(/\w+\.langs/ig) });

		var defaultData = properties.read(defaultPropFile)
			,mergeData = defaultData
			,supportedLangs = utils.supportedLangs;
		
		propertiesFileArr.forEach(function(file)
		{
			var fileJSONStr = properties.read(file);
			mergeData = utils.mergeJSONStr(fileJSONStr,mergeData);
		});

		langsFileArr.forEach(function(langFile){
			var extraLangsJSON = properties.read(langFile);
			for(var _i in extraLangsJSON)
			{
				supportedLangs.push(extraLangsJSON[_i]);
			}
		});
				
		// iterate over all the supported languages, for each language tx all the html files
		supportedLangs.forEach(function(lang){

			var options = {
				'source' : 'en',
				'dest'	 : lang
			};

			translate.doTranslate(mergeData ,options, function(err,data){

				htmlFileArr.forEach(function(file){
					var inputHtmlFileData = fs.readFileSync(file);
					var	template = Handlebars.compile(inputHtmlFileData.toString());

					var arr = file.split("/");
					var resource = arr[arr.length-1];
					arr[arr.length - 1] =  resource.replace('.','_'+lang + '.');
					var outputHtmlFile  = arr.join("/");
					outputHtmlFile = outputHtmlFile.replace(/\/uploads\//,'/downloads/');

					var result = template(data);
					fs.mkdir(outputHtmlFile.substr(0,outputHtmlFile.lastIndexOf("/")),function(e){
					    if(!e || (e && e.code === 'EEXIST')){
					        fs.writeFileSync(outputHtmlFile,result);
					        if((htmlFileArr.indexOf(file) === htmlFileArr.length - 1) && (supportedLangs.indexOf(lang) === supportedLangs.length - 1))
					        {
					        	setTimeout(function(){ res.send(200); }, 1000);
					        }
					    } else {
					        //first make the dir and then write the file
					        fs.mkdirSync(outputHtmlFile.substr(0,outputHtmlFile.lastIndexOf("/")));
					        fs.writeFileSync(outputHtmlFile,result);
					    }
					});	 
				});
			});
		});
	}
	else
	{
		res.send(500, { error: 'NO_FILES_UPLOADED_YET' });
	}

};

exports.downloadZip = function(req,res){

	var userObj = userMap[req.ip];
	
	if(userObj)
	{
		var userDownloadsDir = __dirname + "/downloads/" + req.ip
			,files = fs.readdirSync(userDownloadsDir)
			,filesArr = [];

		files.forEach(function(file){
				if(file.indexOf(".html") > 0)
				{
					filesArr.push({"path": userDownloadsDir + '/' + file, "name" : file});
				}
			})

		res.zip(filesArr,"templates.zip", function(){

			userMap[req.ip] = null;

			// clean up the directories for now 
			rmdir(__dirname + "/uploads/" + req.ip);
			rmdir(__dirname + "/downloads/" + req.ip);
		});
	}
	else
	{
		res.send(500);
	}
};

exports.fileUpload = function(req,res){
	// fileUpload logic
	var files = req.files;

	for(var i in files)
	{
		createFile(req,res,files[i]);
	}
	res.send(200);
};

function createFile(req,res,file)
{
	var files = req.files,
	path = file.path,
	name = file.name;

	  fs.readFile(path, function (err, data) {

	  	  var dir = __dirname + "/uploads/"+ req.ip + "/" ;

		  var newPath = dir + name;
		  
		  fs.mkdir(dir,function(e){
		      if(!e || (e && e.code === 'EEXIST')){
		          //overwrite
		        fs.writeFile(newPath, data, function (err) {
			  	  	var objs = userMap[req.ip];
			  	  	if(objs === null || typeof objs === "undefined" )
			  	  	{
			  	  		objs = [];
			  	  	}

			  	  	if(objs.indexOf(newPath) < 0)
			  	  	objs.push(newPath);

			  	  	userMap[req.ip]=objs;
		  	  	});
		      } else {
		            fs.mkdirSync(dir);
		            fs.writeFile(newPath, data, function (err) {
			  	  	var objs = userMap[req.ip];
			  	  	if(objs === null || typeof objs === "undefined" )
			  	  	{
			  	  		objs = [];
			  	  	}

			  	  	if(objs.indexOf(newPath) < 0)
			  	  	objs.push(newPath);

			  	  	userMap[req.ip]=objs;
		  	  	});
		      }
		  });
		});
  
}

var rmdir = function(dir) {
	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);
		
		if(filename == "." || filename == "..") {
			// pass these files
		} else if(stat.isDirectory()) {
			// rmdir recursively
			rmdir(filename);
		} else {
			// rm fiilename
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
};