

  var utils = {};

 (function(){

  var isValidHtmlFile = function(file, acceptedFiles) {
    var   validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.indexOf(validType, file.name.length - validType.length) !== -1) {
          return true;
        }
      } 
    }
    return false;
  };

  // replace with class="notranslate"
  function parseJSONStr(data)
  {
      // for items with only ${}
      var refs = data.match(/\s*\$\{+\w+\}[^"&\/]/ig);

      if(refs !== null && typeof refs !== "undefined")
      {
        for(_i =0 ;_i <refs.length ; _i++)
        {
          var wd = refs[_i];
          data = data.replace(/\s*\$\{+\w+\}[^"&\/]/i, "<span class='notranslate'> </span>" + wd.substr(wd.length-1));
        }

        for(_i =0 ;_i <refs.length ; _i++)
        {
          var wd = refs[_i];
          data = data.replace(/'notranslate'>/,'"notranslate"> '+wd.substr(0,wd.length-1));
        }
      } 

      return data;
  }

  function mergeJSONStr(sourceStr,destStr)
  {
    // dest is default , source is user sent
    var returnJSONStr = {};
    for(var _i in destStr)
    {
      returnJSONStr[_i] = destStr[_i];
    }

    for(var i in sourceStr)
    {
      returnJSONStr[i] = sourceStr[i];
    }

    return returnJSONStr;
  }

  function unique(src) {
    var arr = [];
    for(var i = 0; i < src.length; i++) {
        if(!contains(arr,src[i])) {
            arr.push(src[i]);
        }
    }
    return arr; 

    function contains(src,v)
    {
      for(var i = 0; i < src.length; i++) {
          if(src[i] === v) return true;
      }
      return false;
    }
}

  var languages = new Array();

  languages.push('en');
  languages.push('de');
  languages.push('ja');
  languages.push('fr');
  languages.push('it');
  languages.push('es');
  languages.push('pt');
 
  utils.isValidHtmlFile = isValidHtmlFile;
  utils.supportedLangs = languages;
  utils.parseJSONStr= parseJSONStr;
  utils.mergeJSONStr = mergeJSONStr;
  utils.unique = unique;

 })(utils);

 module.exports = utils;
 