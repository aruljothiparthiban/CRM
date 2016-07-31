'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name :{
		type:String,
		trim: true,
	    unique:true,
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

mongoose.model('Category', CategorySchema);
