'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Activity = mongoose.model('Activity'),
	_ = require('lodash'),
    async = require('async');

/**
 * Create a activity
 */
exports.create = function (req, res) {
    var activity = new Activity(req.body);
    activity.createdBy = activity.updatedBy = req.user._id;

    activity.save(function (err) {
        console.log(err);
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(activity);
        }
    });
};

/**
 * Show the current activity
 */
exports.read = function(req, res) {
    res.json(req.activity);
};

/**
 * Update a activity
 */
exports.update = function(req, res) {
	var activity = req.activity;
	activity = _.extend(activity, req.body);

	activity.save(function (err) {
	    if (err) {
	        return res.status(400).send({
	            message: errorHandler.getErrorMessage(err)
	        });
	    } else {
	        res.json(activity);
	    }
	});
};

/**
 * Delete an activity
 */
exports.delete = function (req, res) {
    Activity.find({ '_id': { $in: req.body } }).exec(function (err, activities) {
        if (!err) {
            _.forEach(activities, function (x) {
                x.remove();
            });
            res.json({
                success: true,
                message: 'Record deleted successfully!'
            });
        }
        else {
            res.json({
                success: false,
                message: err.message
            });
        }
    });
};


/**
 * List of activity
 */
exports.listByPage = function (req, res) {
    var pageindex = parseInt(req.query.pageIndex),
        pagesize = parseInt(req.query.pageSize),
        count = 0;

    async.waterfall([
        function (cb) {
            Activity.find().count({}, function (err, recordCount) {
                if (!err) {
                    count = recordCount;
                    cb();
                }
            });
        },
        function () {
            var query = (pageindex === 1) ? Activity.find().limit(pagesize) : Activity.find().skip(pagesize * (pageindex - 1)).limit(pagesize);
            query.sort('-updatedAt')
            .populate('createdBy', 'displayName')
            .populate('updatedBy', 'displayName')
            .populate('type', 'name')
            .exec(function (err, items) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var grid = {
                        pageIndex: pageindex,
                        pageSize: pagesize,
                        count: count,
                        items: items
                    };
                    res.json(grid);
                }
            });
        }
    ]);
};

/**
 * List of activity
 */
exports.list = function(req, res) {
    Activity.find().sort('-updatedAt')
        .populate('createdBy', 'displayName')
        .populate('updatedBy', 'displayName')
        .populate('type','name')
        .exec(function (err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
		    res.json(categories);
		}
	});
};

exports.listByPeople = function (req, res) {
    console.log(req.query);
    // 'peoples': req.query.peopleId
    Activity.find({}).sort('-updatedAt')
        .populate('createdBy', 'displayName')
        .populate('updatedBy', 'displayName')
        .populate('type', 'name')
        .populate('peoples')
        .exec(function (err, categories) {
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
 * Activity middleware
 */
exports.activityByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Activity is invalid'
		});
	}

    Activity.findById(id)
        .populate('user', 'displayName')
        //.populate('type','name')
        .exec(function (err, activity) {
		if (err) return next(err);
		if (!activity) {
			return res.status(404).send({
				message: 'Activity not found'
			});
		}
		req.activity = activity;
		next();
	});
};

/**
 * Activity authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.activity);
	//if (req.activity.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
