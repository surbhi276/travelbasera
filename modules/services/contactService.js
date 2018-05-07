var _ 				= 	require('lodash');
var jwt				=	require('jsonwebtoken');
var Q 				=	require('q');
var _model     		= 	require('../models');
var contactModel    =  _model.contactModel;
var ec 				= 	require('../../constants').errors;
const lib 			=	require('../../lib');
const middlewares 	= 	lib.middlewares; 


function checkCountryName(){
	var self = this;
	var deferred = Q.defer();
	self.c_code = 1;
	countryModel.find({c_name:self.name}, function(err, data){
		if(err) 
			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch State"}));
		if(data.length)
			 return deferred.reject(ec.Error({status:ec.DATA_ALREADY_EXISTS, message:'Country Already Exist.'}));
      	
      	deferred.resolve();
	});
	return deferred.promise; 
};

function fetchLastCountry(){
 	var self = this;
 	var deferred = Q.defer();
 	countryModel.find(function(err, data){
 		if(err)
 			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch Role"}));
 		
 		if(data.length){
            var lastElm = data[data.length-1];
     		self.c_code = parseInt(lastElm.c_code)+1;
       } 
 		deferred.resolve();
 	});
 	return deferred.promise;
 };

 function saveNewCountry(){
 	var self = this;
 	var deferred = Q.defer();
 	var addcountry = new countryModel({c_name:self.name, c_code:self.c_code,'metadata.is_active':self.status});
		addcountry.save(function(err, data){
		if(err)
			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Insert Country"}));
			deferred.resolve();
		});
 	return deferred.promise;
 }


var contactServicex = {

	getAllCountryService:function(options, cb){
	
		if(!options)
            return cb(ec.Error({status:ec.DB_ERROR, message :"No data"}));

		countryModel.find({},function(err, data){
			if(err)
				return cb(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch countries"}));
				cb(null,data);
		});
	},

	addContactService:function(options, cb){
		
		if(!options)
            return cb(ec.Error({status:ec.DB_ERROR, message :"Invalid data to save contacts"}));
        var reqObj = new contactModel(options);
        reqObj.save(function(err, data){
        	if(err)
				return cb(ec.Error({status:ec.DB_ERROR, message:'Unable to Save Contact'}));
			cb(null, data);
        });
        
	},
	
	editCountryService:function(options, cb){
		if(!options)
            return cb(ec.Error({status:ec.DB_ERROR, message :"Invalid data to create Country"}));
        var updateAbleData =  {  c_name:options.c_name, metadata:{is_active:options.metadata.is_active}};
		countryModel.update({_id:options._id},{$set:updateAbleData}, function(err, data){
			if(err)
				return cb(ec.Error({status:ec.DB_ERROR, message:'Unable to Update Country'}));
			cb(null, data);
		});
	},

	deleteCountryService: function(options, cb){
		
		countryModel.remove({_id:options.id}, function(err, result){
			if(err) return cb(ec.Error({status:ec.DB_ERROR, message:'Unable to get results'}));
			cb(null, result);
		});
	},

	fetchCountryByIdService: function(options, cb){
		
		countryModel.findOne({_id:options.id}, function(err, result){
			if(err) return cb(ec.Error({status:ec.DB_ERROR, message:'Unable to get results'}));
			delete result.id;
			cb(null, result);
		});
	}
};
module.exports = contactServicex;