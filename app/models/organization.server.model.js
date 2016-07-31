'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organization Schema
 */
var OrganizationSchema = new Schema({
	name :{
		type:String,
		trim: true,
	    unique:true,
		required:'Name cannot be blank'
	},
	address: {
	    line1: {
            type:String
	    },
	    line2: {
            type:String
	    },
	    suburb: {
            type:String
	    },
	    postcode: {
            type:Number
	    }
	},
	peoples: [{
	    type: Schema.ObjectId,
	    ref: 'People'
	}],
	notes:{
        type:String
	},
	category:{
	    type:Schema.ObjectId,
	    ref: 'Category',
        required:'Category cannot be blank'
	},
	assignedTo:{
	    type: Schema.ObjectId,
	    ref: 'User',
	    required: 'Assigned to cannot be blank'
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

mongoose.model('Organization', OrganizationSchema);
