'use strict';

/* Controllers */

function AppCtrl($scope, $http,$window) {

 var errorMessages={
 	"NO_FILES_UPLOADED_YET": "Please upload input html file before pressing Done button. Check the Help Section for using this tool"
 };

  $scope.failedValidations = [];

  $scope.getFile = function(uri)
					  {
					  	$window.location = uri;
					  };

  $scope.download = function()
  					 {
  					 	$http({method: 'GET', url: '/makeFiles'}).
  					 	  success(function(data, status, headers, config) {
  					 	  	$window.location = '/downloadZip';
  					 	  }).
  					 	  error(function(data, status, headers, config) {	
  					 	  	//reset failedvalidations
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

