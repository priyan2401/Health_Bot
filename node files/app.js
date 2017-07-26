//require express for creating api's
var express = require('express');
//create a reference variable for express()
var app = express();

var cors = require('cors')
app.use(cors());

//require mongoose for using MongoDB
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

//require schema file
app.use(express.static(__dirname + '/public'));
//create instance for patientSchema.js
var schemaObject = require('./public/js/patientSchema');
//create instance for adminSchema.js
var adminSchemaObject = require('./public/js/adminSchema');

//connect to our database "patientDB"
mongoose.connect('mongodb://localhost:27017/patientDB');


//require body-parser for using post api(for sending data through body of url)
var bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    'extended': true
}));



//require fs for enabling file operations
var fs=require('fs');

//import json file containing symptoms
var data=fs.readFileSync('symptoms.json');

//create an object to access json data
var json_symptoms=JSON.parse(data);


//import json file containing hospitals details
var hospitalData=fs.readFileSync('hospitals.json');

//create an object to access json data
var json_hospitals=JSON.parse(hospitalData);


//require nodemailer for sending mail to doctor
var nodemailer = require('nodemailer');

//========================================= /mailerApi ==========================================//

//Credentials stored in a transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'miraclehealthbot@gmail.com', // Your email id
        pass: 'Miracle@123' // Your password
    }
});


app.get('/mailerApi',function(req, res) {
	//debug
    //console.log(req.query.name+req.query.gender+req.query.age+req.query.height+req.query.weight+req.query.days_of_suffering+req.query.symptoms);

    //year of birth is taken in kore.ai. So, to covert it to age 
    //get current year
    var date = new Date();
	var year = date.getFullYear();
	//subtract year of birth from current year
    var age = year-req.query.age;

    //know mail-id of hospital based on patientLocation
	//finding hospital name using user location
	var stack=0;

	//assigning user location to user_location
	var user_location=req.query.patientLocation;
	//var user_symptoms=req.query.symptoms;

	for(var i=0; i<json_hospitals.length; i++){
		if(json_hospitals[i].Location == user_location){ //&& json_hospitals[i].Symptom == user_symptoms
			stack=json_hospitals[i].Email;
		} 
	}

	if(stack==0){
		stack='archit.ansu@gmail.com';
	}

    var mailOptions = {
    from: 'miraclehealthbot@gmail.com', // sender address
    to: stack, // list of receivers
    subject: 'Miracle Health Bot', // Subject line
    html: '<h2>Patient Details</h2><h3>Name : '+req.query.name+'</h3><h3>Gender : '+req.query.gender+'</h3><h3>Age : '+age+'</h3><h3>Height : '+req.query.height+'</h3><h3>Weight : '+req.query.weight+'</h3><h3>Phone Number : '+req.query.phone+'</h3><h3>Mail ID : '+req.query.mail+'</h3><h3>Location : '+req.query.patientLocation+'</h3><h3>Symptoms : '+req.query.symptoms.toLowerCase()+'</h3><h3>Days of suffering : '+req.query.days_of_suffering+'</h3><h2>Expected Disease : '+req.query.disease_name
	};


	transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.send('error');
    }else{
        console.log('Message sent: ' + info.response);
        res.send('sent');
    };
});
});


//========================================= /symptoms ==========================================//


//function to get the id's of symptoms given by the user
var checkForId = function(name) {
    var i = null;
    for (i = 0; json_symptoms.length > i; i += 1) {
        if (json_symptoms[i].Name == name) {
            return i;
        }
    }
     
    return false;
};


app.get('/symptoms', function (req, res) {

	//Declare Varaibles which may be used below
	// If we declare them out of the api scope ... those variables wont be destroyed and input values will be affected
	var ids = [];
	var id_count=0;

	//assigning symptoms from url to list_of_symptoms
	var list_of_symptoms=req.query.symptom_names;

	//making list_of_symptoms into array
	var individual_symptoms=list_of_symptoms.split(",");

	//matching given symptoms with existing symptoms data
	for(i=0; i<individual_symptoms.length; i++){
		//checkForId is a function used to compare given symptoms with symptoms json data
		//trim is used inorder to save the situation from unnecessary spaces
		symptom_id=checkForId((individual_symptoms[i].trim()).toLowerCase());
		if(symptom_id===false){
			//debug
			console.log(individual_symptoms[i]+" is not valid !!!")
		} else {
			ids[id_count]=json_symptoms[symptom_id].ID;
			id_count++;
		}
	}

	//return values to kore
	if(individual_symptoms.length===ids.length){
		//debug
		var combined_id=ids.join();
		console.log(combined_id);

		res.send(combined_id);

	} else{
		//debug
		console.log("Invalid Symptoms !!");
		res.send("Invalid Symptoms");
	}


});



//***************************************** adminSchema ******************************************//

//========================================= /loginAdmin ==========================================//

app.post('/loginAdmin', function (req, res) {
	
	app.use(cors());

	var query={

		username : req.body.username,
		password : req.body.password

	}
	console.log(query);

	adminSchemaObject.login(query, function(err,data) {
        if (data) {
           response ={
			   "output":data
			   }
			   console.log("admin data"+JSON.stringify(response));
           res.json(response);
        } else {
           error= {
			   "output":"failure"
		   }
           res.json(error);
        }
	});

});



//========================================= /addHospital ==========================================//

app.post('/addHospital', function (req, res) {

	var query={

		location : req.body.location,
		username : req.body.username,
		password : req.body.password

	}
	adminSchemaObject.addAdmin(query, function(err, data) {
        if (data) {
           response ="success"
           res.send(response);
        } else {
           error="failure"
           res.send(error);
        }
	});

});


//========================================= /removeHospital ==========================================//

app.post('/removeHospital', function (req, res) {

	var query={
		location : req.body.location
	}
	adminSchemaObject.removeAdmin(query, function(err, data) {
        if (data) {
           response ="success"
           res.send(response);
        } else {
           error="failure"
           res.send(error);
        }
	});

});


//######################################### patientSchema ########################################//

//========================================= /addPatient ==========================================//

app.post('/addPatient', function (req, res) {
	
	var patientData={
		patientName : req.body.patientName,
		patientAge : req.body.patientAge,
		patientGender : req.body.patientGender,
		patientHeight : req.body.patientHeight,
		patientWeight : req.body.patientWeight,
		patientMobileNo : req.body.patientMobileNo,
		patientEmail : req.body.patientEmail,
		patientLocation : req.body.patientLocation,
		patientSymptoms : req.body.patientSymptoms,
		daysOfSuffering : req.body.daysOfSuffering,
		expectedDisease : req.body.expectedDisease,
		hospitalInVicinity : req.body.hospitalInVicinity
	}
	schemaObject.addPatientGivenData(patientData, function(err, data) {
        if (data) {
           response ="success"
           res.send(response);
        } else {
           error="failure"
           res.send(err);
        }
	});

});


//========================================= /makeAppointment ==========================================//


app.post('/makeAppointment', function (req, res) {

	
	//finding hospital name using user location
	var stack=0;

	//assigning user location to user_location
	var user_location=req.body.patientLocation;
	//var user_symptoms=req.query.symptoms;

	for(var i=0; i<json_hospitals.length; i++){
		if(json_hospitals[i].Location == user_location){ //&& json_hospitals[i].Symptom == user_symptoms
			stack=json_hospitals[i].Name;
		} 
	}

	var query={
		_id : req.body.id
	}

	var update={

		appointmentDate : req.body.appointmentDate,
		appointmentTime : req.body.appointmentTime,
		appointmentDone : "DONE"

	}

	//get patientName for sending mail and message
	var patientName = req.body.patientName;
	var appointmentDate = req.body.appointmentDate;
	var appointmentTime = req.body.appointmentTime;
	var Num = "+91"+req.body.patientMobileNo;
	var patientEmail = req.body.patientEmail;

	//remove %20 from patientName and / at last of the name
	patientName = (patientName.replace(/%20/g," ")).slice(0,-1); 

	schemaObject.addAdminGivenData(query, update, function(err, data) {
        if (data) {

   //      	//sms service
			// // Twilio Credentials 
			// var accountSid = 'AC5bf9e640aae40addc4d2db172b23e2ec'; 
			// var authToken = 'cb43494b8f3780c4e4ec3df2fd79bf6f'; 

			// //require the Twilio module and create a REST client 
			// var client = require('twilio')(accountSid, authToken); 

   //      	//sms user about appointment date and time
   //      	client.messages.create({ 
			//     to: Num, 
			//     from: "+12542218754", 
			//     body: 'Hey '+patientName+'. Your Appointment has been made on '+appointmentDate+' at '+appointmentTime+" in "+stack,
			// }, function(err, message) { 
			//     console.log(message.sid); 
			// });

			//mail user about appointment date and time
			var mailOptions = {
			    from: 'miraclehealthbot@gmail.com', // sender address
			    to: patientEmail, // list of receivers
			    subject: 'Miracle Health Bot', // Subject line
			    html: '<h1>Hey '+patientName+'</h1><h3>Your Appointment has been made on </h3><h2>'+appointmentDate+' at '+appointmentTime+' in </h2><h1>'+stack
			};


			transporter.sendMail(mailOptions, function(error, info){});

           response ="success"
           res.send(response);

        } else {
        	console.log(err);
           response="failure"
           res.send(response);
        }
	});

});



//========================================= /removePatient ==========================================//

app.post('/removePatient', function (req, res) {

	var query={
		_id : req.body.id
	}
	schemaObject.removeRecord(query, function(err, data) {
        if (data) {
           response ="success"
           res.send(response);
        } else {
           error="failure"
           res.send(error);
        }
	});

});

//========================================= /displayPatients ==========================================//
app.post('/displayPatients', function (req, res) {

app.use(cors());
	var query={
		patientLocation : req.body.patientLocation
	   // patientSymptoms : req.body.symptoms
		
	}

	schemaObject.displayAll(query, function(err, data) {
        if (data) {
           response ={
			   "output":data
			   }
			   console.log("patients data"+JSON.stringify(response));
           res.json(response);
        } else {
           error= {
			   "output":"failure"
		   }
           res.json(error);
        }
	});

});



app.listen('5000');