'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ActivityType = mongoose.model('ActivityType'),
	_ = require('lodash');

/**
 * Create a activityType
 */
exports.create = function (req, res) {
    var activityType = new ActivityType(req.body);
    activityType.createdBy = activityType.updatedBy = req.user._id;
    console.log(activityType);
    ActivityType.findOne({ name: activityType.name }, function (err, cat) {
        if (cat) {
            return res.status(400).send(errorHandler.getError(activityType.name + ' already exist!'));
        }
        else {
            activityType.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(activityType);
                }
            });
        }
    });    
};

/**
 * Show the current activityType
 */
exports.read = function(req, res) {
    res.json(req.activityType);
};

/**
 * Update a activityType
 */
exports.update = function(req, res) {
	var activityType = req.activityType;
	activityType = _.extend(activityType, req.body);

	ActivityType.findOne({ name: activityType.name }, function (err, cat) {
	    if (cat) {
	        return res.status(400).send(errorHandler.getError(activityType.name + ' already exist!'));
	    }
	    else {
	        activityType.save(function (err) {
	            if (err) {
	                return res.status(400).send({
	                    message: errorHandler.getErrorMessage(err)
	                });
	            } else {
	                res.json(activityType);
	            }
	        });
	    }
	});	
};

/**
 * Delete an activityType
 */
exports.delete = function(req, res) {
	var activityType = req.activityType;

	activityType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(activityType);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	ActivityType.find().sort('-updatedAt').populate('createdBy', 'displayName').populate('updatedBy','displayName').exec(function(err, categories) {
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
 * ActivityType middleware
 */
exports.activityTypeByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'ActivityType is invalid'
		});
	}

	ActivityType.findById(id).populate('user', 'displayName').exec(function(err, activityType) {
		if (err) return next(err);
		if (!activityType) {
			return res.status(404).send({
				message: 'ActivityType not found'
			});
		}
		req.activityType = activityType;
		next();
	});
};

/**
 * ActivityType authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.activityType);
	//if (req.activityType.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
