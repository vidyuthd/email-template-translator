
var translate = {};
var fs = require('fs')
    ,request = require('request')
    ,properties = require ("properties-parser");
    
(function(translate){

  var gapi = {
          'url': 'https://www.googleapis.com/language/translate/v2',
          'key': '<GOOGLE_API_KEY>',
  };

  function doTranslate(jsonData,options,callback)
  { 
      makeRequest(jsonData,options,callback);
  }

  function makeRequest(jsonData,options,callback)
  {
      var uri = gapi.url + '?key='+ gapi.key;
      for(var i in jsonData)
      {
        uri += '&q='+ encodeURI(jsonData[i]); 
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
          throw new Exception('got err while requesting',err);
          callback(err,null);
        }
        try {
          var response = JSON.parse(body);
          var dataArray  = new Array();
          var translatedJSONData = {};
          if(response.data) 
          {
             dataArray = response["data"]["translations"];
          }

          var ele = 0;
          for(var i in jsonData)
          {
              jsonData[i] = dataArray[ele]['translatedText'];
              ele++
          }

          if(callback)
          {
            callback(null,jsonData);  
          }
        }
        catch(e) {
          throw new Exception('got errr while parsing',e);
        }
      });
  }

  translate.doTranslate = doTranslate;

})(translate);

module.exports = translate;
