var db = require('../../config/db');
//var mongoose = require('mongoose');

var inclusionSchema = new db.Schema({
	i_name:{
		type:String
	},
	i_code:{
		type:String
	},
	i_icon:{
		type:String
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

inclusionSchema.pre('save', function(next) { 
	var currentDate = new Date(); 
    this.metadata.modified_at = currentDate; 
    if (!this.metadata.created_at) this.metadata.created_at = currentDate; 
      
    next();
});

module.exports = db.mongoose.model('ADMIN_Inclusions', inclusionSchema);