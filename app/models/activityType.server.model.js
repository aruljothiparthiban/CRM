'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ActivityType Schema
 */
var ActivityTypeSchema = new Schema({
	name :{
		type:String,
		trim:true,
		required:'Name cannot be blank'
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

mongoose.model('ActivityType', ActivityTypeSchema);
