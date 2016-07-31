'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
	type:{
		type:Schema.ObjectId,
		ref:'ActivityType'
	},
	date:{
		type:Date
	},
	subject :{
		type:String,
		trim:true,
		required:'Subject cannot be blank'
	},
	peoples: [{
	    type: Schema.ObjectId,
	    ref: 'People'
	}],
	organizations: [{
	    type: Schema.ObjectId,
	    ref: 'Organization'
	}],
	users: [{
	    type: Schema.ObjectId,
	    ref: 'User'
	}],
	notes:{
		type:String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt:{
		type:Date,
		default:Date.now
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updatedBy:{
		type:Schema.ObjectId,
		ref:'User'
	}
});

mongoose.model('Activity', ActivitySchema);
