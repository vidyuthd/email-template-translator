
var translate = {};
var fs = require('fs')
    ,request = require('request')
    ,utils = require("./utils.js");

    
(function(translate){

  var gapi = {
          'url': 'https://www.googleapis.com/language/translate/v2',
          'key': '<GOOGLE_API_KEY>',
  };

  function doTranslate(data,options,callback)
  { 
      makeRequest(data,options,callback);
  }

  function makeRequest(data,options,callback)
  {
      var uri = gapi.url + '?key='+ gapi.key;
      for(var i in data)
      {
        uri += '&q='+ encodeURI(utils.parseJSONStr(data[i])); 
      }

      if(typeof options === 'undefined')
      {
          options = {
              'source' : 'en',
              'dest'   : 'de'
            } 
      }
 
      uri += '&target=' + options.dest;

      if(options.dest !== 'en')
        uri += '&source='+options.source 

      var requestOptions = {'url': uri};
       request(requestOptions, function(err, resp, body){
        if(err){
          callback(err,null);
        }
        var response = JSON.parse(body);
        try {
          var dataArray  = new Array();
          if(response.data) 
          {
             dataArray = response["data"]["translations"];
          }

          var ele = 0;
          for(var i in data)
          {
              data[i] = dataArray[ele]['translatedText'];
              ele++
          }

          if(callback && response.data)
          {
            callback(null,data);  
          }
        }
        catch(e) {
          console.log('exception is e',e + ' ,error is ',response.error);
          callback(response.error,null);
        }
      });
  }

  translate.doTranslate = doTranslate;

})(translate);

module.exports = translate;