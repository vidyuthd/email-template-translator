'use strict';

/* Controllers */

function AppCtrl($scope, $http,$window) {

 var errorMessages={
  "NO_FILES_UPLOADED_YET": "Please upload input html file before pressing Translate button. Check the Help Section for using this tool",
  "NO_HTML_FILE_UPLOADED_YET": "Please ensure that atleast one html file is uploaded before clicking Translate button",
  "dailyLimitExceeded": "Error From Google: Daily Limit Exceeded",
  "keyInvalid": "Error From Google: Invalid Key, Bad Request",
  "GOOGLE_PROBLEM": "Check your files once for special chars or there seems to be some problem while translating"
 };

 var successMessages = {
  "SUCCESS_TX_COMPLETE" : "Your uploaded files are translated successfully and zipped in Templates.zip file. Your files are no longer stored on server."
 };

  $scope.failedValidations = [];

  $scope.getFile = function(uri)
					  {
					  	$window.location = uri;
					  };

  $scope.download = function()
  					 {
              jQuery('.container-narrow').mask("Translating...");
              // logic for storing selected languages
              var selectedItems = jQuery('.btn-group .active')
              var selectedLangs = [];
              for(var _i=0;_i<selectedItems.length;_i++)
              {
                selectedLangs.push(jQuery(selectedItems[_i]).attr('value'));
              }
  					 	 $http({method: 'GET', url: '/makeFiles?langs='+selectedLangs.join(",")}).
  					 	  success(function(data, status, headers, config) {
  					 	  	$window.location = '/downloadZip';
                  jQuery('.container-narrow').unmask();
                  $scope.successMsgs = [];
                  $scope.failedValidations = [];
                  $scope.successMsgs.push(successMessages["SUCCESS_TX_COMPLETE"]);
                   myDropzone.removeAllFiles();
  					 	  }).
  					 	  error(function(data, status, headers, config) {	
  					 	  	//reset failedvalidations
                  jQuery('.container-narrow').unmask();
  					 	  	$scope.failedValidations = [];
  					 	  	$scope.failedValidations.push(errorMessages[data.error]);
  					 	  });
  					 };
}


function MyCtrl1() {
	var help = angular.element(document.querySelector('#help'));
	var home = angular.element(document.querySelector('#home'));
	help.parent().removeClass("active");
	home.parent().addClass("active");
}

MyCtrl1.$inject = [];


function MyCtrl2() {
	var help = angular.element(document.querySelector('#help'));
	var home = angular.element(document.querySelector('#home'));
	help.parent().addClass("active");
	home.parent().removeClass("active");
}
MyCtrl2.$inject = [];

