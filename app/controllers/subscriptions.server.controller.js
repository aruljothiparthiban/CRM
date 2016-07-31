'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subscription = mongoose.model('Subscription'),
	_ = require('lodash');

/**
 * Create a subscription
 */
exports.create = function (req, res) {
    var subscription = new Subscription(req.body);
    subscription.createdBy = subscription.updatedBy = req.user._id;

    Subscription.findOne({ name: subscription.name }, function (err, cat) {
        if (cat) {
            return res.status(400).send(errorHandler.getError(subscription.name + ' already exist!'));
        }
        else {
            subscription.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(subscription);
                }
            });
        }
    });    
};

/**
 * Show the current subscription
 */
exports.read = function(req, res) {
    res.json(req.subscription);
};

/**
 * Update a subscription
 */
exports.update = function(req, res) {
	var subscription = req.subscription;
	subscription = _.extend(subscription, req.body);

	Subscription.findOne({ name: subscription.name }, function (err, cat) {
	    if (cat) {
	        return res.status(400).send(errorHandler.getError(subscription.name + ' already exist!'));
	    }
	    else {
	        subscription.save(function (err) {
	            if (err) {
	                return res.status(400).send({
	                    message: errorHandler.getErrorMessage(err)
	                });
	            } else {
	                res.json(subscription);
	            }
	        });
	    }
	});	
};

/**
 * Delete an subscription
 */
exports.delete = function(req, res) {
	var subscription = req.subscription;

	subscription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(subscription);
		}
	});
};

/**
 * List of Subscription
 */
exports.list = function(req, res) {
	Subscription.find().sort('-updatedAt').populate('createdBy', 'displayName').populate('updatedBy','displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
		    res.json(categories);
		}
	});
};

/**
 * Subscription middleware
 */
exports.subscriptionByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Subscription is invalid'
		});
	}

	Subscription.findById(id).populate('user', 'displayName').exec(function(err, subscription) {
		if (err) return next(err);
		if (!subscription) {
			return res.status(404).send({
				message: 'Subscription not found'
			});
		}
		req.subscription = subscription;
		next();
	});
};

/**
 * Subscription authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.subscription);
	//if (req.subscription.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
