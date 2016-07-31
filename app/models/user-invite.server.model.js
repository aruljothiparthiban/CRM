'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * User Invite Schema
 */
var UserInviteSchema = new Schema({	
	email: {
		type: String,
		trim: true,		
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	token: {
	    type: String
	},
	isAccepted:{
	    type: Boolean,
        default:false
	},
	createdAt:{
	    type: Date,
	    default: Date.now
	},	
	createdBy: {
	    type: Schema.ObjectId,
	    ref: 'User'
	}
});

mongoose.model('UserInvite', UserInviteSchema);
