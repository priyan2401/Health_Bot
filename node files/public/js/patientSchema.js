//require mongoose for database actions
var mongoose = require('mongoose');

//defining patient schema
var patientDetails = mongoose.Schema({

	//fields to be filled by the patient
	patientName : {
		type : String,
		required : false
	},

	
	patientGender : {
		type : String,
		required : false
	},

	patientHeight : {
		type : String,
		required : false
	},

	patientWeight : {
		type : String,
		required : false
	},

	patientMobileNo : {
		type : Number,
		required : false
	},

	patientEmail : {
		type : String,
		required : false
	},

	patientLocation : {
		type : String,
		required : false
	},

	patientSymptoms : {
		type : String,
		required : false
	},

	daysOfSuffering : {
		type : String,
		required : false
	},

	//field retreived from diagnosis api
	expectedDisease : {
		type : String,
		required : false
	},

	//fields to be filled by admin(hospital management)
	appointmentDate : {
		type : String,
		required : false
	},

	appointmentTime : {
		type : String,
		required : false
	},

	//field used to maintain or delete patient data based on patient took the appointment or not 
	appointmentDone : {
		type : String,
		required : false
	}

});

//compiling schema into a model
var patient = module.exports = mongoose.model('patient', patientDetails);

//============================== functions starts from here !! =============================================//

//funtion to upload data given by user into database(upto 'hospitalInVicinity')
module.exports.addPatientGivenData = function(data, callback) { 
	patient.create(data, callback);
}

//function to upload data given by admin (appointment date and appointment time)
module.exports.addAdminGivenData = function(query, update, callback) {
	patient.findOneAndUpdate(query, update, {}, callback);
}

//function to delete user record after appointment is done
module.exports.removeRecord = function(query, callback) { 
	patient.remove(query, callback);
}

//function to display all patients in that hospital
module.exports.displayAll = function(query, callback) {
   	patient.find(query, callback);
}