//require mongoose for database actions
var mongoose = require('mongoose');

//defining patient schema
var hospitalDetails = mongoose.Schema({

	username : {
		type : String,
		required : true
	},

	password : {
		type : String,
		required : true
	},

	location : {
		type : String,
		required : true
	}

});

//compiling schema into a model
var admin = module.exports = mongoose.model('admin', hospitalDetails);

//function to check login details
module.exports.login = function(query, callback) { 
	admin.find({username : query.username, password : query.password}, callback);
}

//function to add new hospital branch
module.exports.addAdmin = function(query, callback) { 
	admin.create(query,callback);
}

//function to remove a hospital branch
module.exports.removeAdmin = function(query, callback) { 
	admin.remove(query,callback);
}