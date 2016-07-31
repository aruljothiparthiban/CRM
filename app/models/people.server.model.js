'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * People Schema
 */
var PeopleSchema = new Schema({
    title: {
        type:String
    },
    firstName:{
        type: String,
        required:'First name cannot be blank'
    },
    lastName:{
        type: String,
        required:'First name cannot be blank'
    },
    position:{
        type: String
    },
    organizations: [{
        type: Schema.ObjectId,
        ref: 'Organization'
    }],
    subscriptions: [{
        type: Schema.ObjectId,
        ref: 'Subscription'
    }],
    boards: [{
        type: Schema.ObjectId,
        ref: 'Board'
    }],
    primaryEmail:{
        type:String
    },
    secondaryEmail:{
        type:String
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
	primaryPhone:{
        type:Number
	},
	secondaryPhone:{
        type:Number
	},
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

mongoose.model('People', PeopleSchema);
