var db = require('../../config/db');
//var mongoose = require('mongoose');

var rateSchema = new db.Schema({
	package_id:{
		type:String
	},
	package_rate:{
		type:Number
	},
	package_days:{
		type:Number
	},
	package_nights:{
		type:Number
	},
	metadata:{
		is_active:{ 
			type:Boolean, 
			default: true 
		},
		created_at:{
			type :Date 
		},
		created_by:{
			name:{
				type:String
			},
			id:{
				type:String
			}
		},
		modified_at:{
			type:Date
		}
	}
});

rateSchema.pre('save', function(next) { 
	var currentDate = new Date(); 
    this.metadata.modified_at = currentDate; 
    if (!this.metadata.created_at) this.metadata.created_at = currentDate; 
      
    next();
});

module.exports = db.mongoose.model('ADMIN_Rates', rateSchema);