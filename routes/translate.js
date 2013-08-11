
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
          throw new Exception('got err while requesting',err);
          callback(err,null);
        }
        try {
          var response = JSON.parse(body);
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

          if(callback)
          {
            callback(null,data);  
          }
        }
        catch(e) {
          console.log('exception is e',e);
        }
      });
  }

  translate.doTranslate = doTranslate;

})(translate);

module.exports = translate;