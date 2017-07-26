// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

var url_ip_address = "https://743582f5.ngrok.io"; //use 5000 port ngrok to connet server app.js

// this is credentials checking
var app=angular.module('starter',['ionic']);
app.controller('myCtrl', function($scope, $http, $window){
  $scope.myFunc = function(){
	  alert("working");
    var user = $scope.username;
    var pass = $scope.password;
	alert(user +"and"+ pass)
     var admin_data = {
      method : 'POST',
      url : url_ip_address+'/loginAdmin',
      //headers : {'Content-Type' : 'application/json'},
      data : {
        username : user,
        password : pass
      }
    }
	
	alert("after url ngrok"+JSON.stringify(admin_data)); 
	 
     $http(admin_data).then(function(response) {
		 alert("in http");
	 alert(JSON.stringify(response.data.output));
        var response_data = response.data.output[0].location;
        if(response_data === "failure"){
          alert("plzz check your crdentials");
        }
        else {
          var data_trail = response_data;
		  alert("$http working in side");
          window.open('after_login.html?variable=' + data_trail  , '_self' , 'location = no');
        } 
    }); 
	
	/* var data={ 
	  
	   "username":user,
	   "password":pass
	}
	console.log("object from "+data.username+""+data.password)
	$http.post('https://localhost:5000/loginAdmin',data).then(function(response){
			$window.alert(JSON.stringify(response));
	     if(response.data.output.length!=0){
			 if(response.data.output=="success"){
				 $window.alert("welcome"+response.data.output[0].username);
				 alert("valid Credentials");
                } 
    }
	else{
		alert("wrong Credentials");
	}
		}); */

  };
});


//this is the retriving data from the db using the variable that we are sending through url
var apps=angular.module('myApp',[]);
apps.controller('afterloginCtrl', function($scope, $http){
  var trail_url_data = location.search.split('variable=')[1];
  var patient_data = {
    method : 'POST',
    url : url_ip_address+'/displayPatients',
    //headers : {'Content-Type' : 'application/json'},
    data : {
      patientLocation : trail_url_data
    }
  }
  $http(patient_data).then(function(response) {
    $scope.data_retrived_patient = response.data.output;
  });

  // this is another controller which is used to retrive the data by sending the user id through url
  $scope.details = function (data , data2 , data3 , data4 , data5) {
    var main_data = data;//id
    var main_data2 = data2;//name
    var main_data3 = data3;//location
    var main_data4 = data4;//mobile
    var main_data5 = data5;//emial
    window.open('effected_person_details.html?variabledetails=' + main_data + '/' +'variabledetails=' + main_data2 + '/' +'variabledetails=' + main_data3 +'variabledetails=' + main_data4 +'variabledetails=' + main_data5);
  }

    //this is the data for the deletion after completing the patient checking and also unncessary testing data
    $scope.deletedata = function (data4 , data5) {
      var deletedatavar = data4;
      var deletedatalocation = data5;
      var delete_data = {
        method : 'POST',
        url : url_ip_address+'/removePatient',
        headers : {'Content-type' : 'Application/json'},
        data : {
          id : deletedatavar
        }
      }
      $http(delete_data).then(function(response) {
        alert(response.data);
        window.open('after_login.html?variable=' + deletedatalocation  , '_self' , 'location = no');
      });
    }
});


//this is for making an appointment
var appdate = angular.module('time' , []);
appdate.controller('datetimeCtrl' , function($scope , $http) {
  $scope.datetime = function(){
    var gettingdate = $scope.date;
    var gettingtime = $scope.time;
    var slicestring = location.search.split('variabledetails=')[1];
    var gettingname = location.search.split('variabledetails=')[2];
    var gettinglocation = location.search.split('variabledetails=')[3];
    var gettingmobile = location.search.split('variabledetails=')[4];
    var gettingemail = location.search.split('variabledetails=')[5];

    // deleting last value
    var gettingid = slicestring.slice(0,-1);

    var update_data = {
      method : 'POST',
      url : url_ip_address+'/makeAppointment',
      headers : {'Content-type' : 'Application/json'},
      data : {
        appointmentDate : gettingdate,
        appointmentTime : gettingtime,
        id : gettingid,
        patientName : gettingname,
        patientLocation : gettinglocation,
        patientMobileNo : gettingmobile,
        patientEmail : gettingemail
      }
    }
    if(gettingdate === null || gettingtime == null) {
      alert("plz fill both the columns");
    }
    else {
      $http(update_data).then(function(response) {
        var responsed_data = response.data;
        if(responsed_data === "failure") {
          alert("appointment made failed");
        }
        else {
          alert("appointment made successfully");
          window.open('after_login.html?variable=' + gettinglocation  , '_self' , 'location = no');
        }
      });
    }
  };
  $scope.afterloginrefresh = function() {
    var gettinglocation = location.search.split('variabledetails=')[3];
    window.open('after_login.html?variable=' + gettinglocation  , '_self' , 'location = no');
  }
});
