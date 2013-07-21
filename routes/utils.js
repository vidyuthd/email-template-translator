

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
      var refs = data.match(/\s\$\{+\w+\}/ig);

      data = data.replace(/\s\$\{+\w+\}/ig, "<span class='notranslate'> </span>");

      for(_i =0 ;_i <refs.length ; _i++)
      {
        data = data.replace(/'notranslate'>/,'"notranslate"> '+refs[_i]);
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

 })(utils);

 module.exports = utils;
 