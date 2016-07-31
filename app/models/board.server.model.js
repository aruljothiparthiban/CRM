'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Board Schema
 */
var BoardSchema = new Schema({
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

mongoose.model('Board', BoardSchema);
