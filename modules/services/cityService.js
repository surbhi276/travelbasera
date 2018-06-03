var _ 				= 	require('lodash');
var jwt				=	require('jsonwebtoken');
var Q 				=	require('q');
var _models    	   = 	require('../models');
var cityModel     =  _models.cityModel;
var ec 				= 	require('../../constants').errors;
const lib 			=	require('../../lib');
const middlewares 	= 	lib.middlewares; 

function checkCityName(){
	var self = this;
	var deferred = Q.defer();
	self.ci_code = 1;
	cityModel.find({ci_name:self.name}, function(err, data){
		if(err) 
			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch City"}));
		if(data.length)
			 return deferred.reject(ec.Error({status:ec.DATA_ALREADY_EXISTS, message:'City Already Exist.'}));
      	
      	deferred.resolve();
	});
	return deferred.promise; 
};
function fetchLastCity(){
 	var self = this;
 	var deferred = Q.defer();
 	cityModel.find(function(err, data){
 		if(err)
 			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch City"}));
 		
 		if(data.length){
            var lastElm = data[data.length-1];
     		self.ci_code = parseInt(lastElm.ci_code)+1;
       } 
 		deferred.resolve();
 	});
 	return deferred.promise;
 }
function saveCity(){
	var self = this;
	var deferred = Q.defer();
	console.log(self);
	 var rejObj = {ci_name:self.name,ci_code:self.ci_code, c_id:self.country, s_id:self.state,'metadata.is_active':self.status};
	var addCityData = new cityModel(rejObj);
		addCityData.save(function(err, data){
			if(err)
				return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Insert City"}));
			deferred.resolve();
		});
	return deferred.promise;
}

function checkCityExist(){
	var self = this;
	var deferred = Q.defer();
	cityModel.find({_id:self._id}, function(err, data){
		if(err) 
			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch City"}));
		if(data) 	deferred.resolve();
	});
	return deferred.promise; 
};

function updateCityData(){
	var self = this;
	var deferred = Q.defer();
	var updateData = {ci_name:self.ci_name, c_id:self.c_id, s_id:self.s_id, metadata:{is_active:self.metadata.is_active}};
	cityModel.update({_id:self._id},{$set:self}, function(err, data){
		if(err) 
			return deferred.reject(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch City"}));
		if(data) 	
			deferred.resolve();
	});
	return deferred.promise; 
};

var cityService = {

	getCityService:function(options, cb){
	
		if(!options)
            return cb(ec.Error({status:ec.DB_ERROR, message :"No data"}));

		cityModel.find({},function(err, data){
			if(err)
				return cb(ec.Error({status:ec.DB_ERROR, message :"Unable to Fetch cities"}));
				cb(null,data);
		});
	},

	addCityService:function(options, cb){
		
		if(!options)
            return cb(ec.Error({status:ec.DB_ERROR, message :"Invalid data to create City"}));

       checkCityName.call(options)
       		.then(fetchLastCity.bind(options))
            .then(saveCity.bind(options)) 
            .then(cb)
            .fail(failureCb)
            .catch(failureCb)

        function failureCb(err){
            var finalErr = new Error(err.message || 'Some Undefined Error Occurs.');
            finalErr.status = err.status || 400;
            return cb(finalErr);
        } 
	},
	
	updateCityService:function(options, cb){

		if(!options)
            return cb(ec.Error({status:ec.DB_ERROR, message :"Invalid data to create City"}));

       checkCityExist.call(options)
            .then(updateCityData.bind(options)) 
            .then(cb)
            .fail(failureCb)
            .catch(failureCb)

        function failureCb(err){
            var finalErr = new Error(err.message || 'Some Undefined Error Occurs.');
            finalErr.status = err.status || 400;
            return cb(finalErr);
        } 
	},

	deleteCityService: function(options, cb){
		
		cityModel.remove({_id:options.id}, function(err, result){
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
	},
	stateByIdService: function(options, cb){ 
		stateModel.find({c_id:options.id}, function(err, result){
			if(err) return cb(ec.Error({status:ec.DB_ERROR, message:'Unable to get results'}));
			cb(null, result);
		});
	}
};
module.exports = cityService;