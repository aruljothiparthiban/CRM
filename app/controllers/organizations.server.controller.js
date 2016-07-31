'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organization = mongoose.model('Organization'),
	_ = require('lodash'),
    async = require('async');

/**
 * Create a organization
 */
exports.create = function (req, res) {
    var organization = new Organization(req.body);
    organization.createdBy = organization.updatedBy = req.user._id;

    Organization.findOne({ name: organization.name }, function (err, cat) {
        if (cat) {
            return res.status(400).send(errorHandler.getError(organization.name + ' already exist!'));
        }
        else {
            organization.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(organization);
                }
            });
        }
    });    
};

/**
 * Show the current organization
 */
exports.read = function(req, res) {
    res.json(req.organization);
};

/**
 * Update a organization
 */
exports.update = function(req, res) {
	var organization = req.organization;
	organization = _.extend(organization, req.body);

	organization.save(function (err) {
	    if (err) {
	        return res.status(400).send({
	            message: errorHandler.getErrorMessage(err)
	        });
	    } else {
	        res.json(organization);
	    }
	});
};

/**
 * Delete an organization
 */
exports.delete = function (req, res) {
    Organization.find({ '_id': { $in: req.body } }).exec(function (err, organizations) {
        if (!err) {
            _.forEach(organizations, function (x) {
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
 * List of organization
 */
exports.listByPage = function (req, res) {
    var pageindex = parseInt(req.query.pageIndex),
        pagesize = parseInt(req.query.pageSize),
        count = 0;

    async.waterfall([
        function (cb) {
            Organization.find().count({}, function (err, recordCount) {
                if (!err) {
                    count = recordCount;
                    cb();
                }
            });
        },
        function () {
            var query = (pageindex === 1) ? Organization.find().limit(pagesize) : Organization.find().skip(pagesize * (pageindex - 1)).limit(pagesize);
            query.sort('-updatedAt')
             .populate('createdBy', 'displayName')
            .populate('updatedBy', 'displayName')
            .populate('category', 'name')
            .populate('assignedTo', 'displayName')
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

exports.list = function (req, res) {    
    Organization.find().sort('-updatedAt')
     .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .populate('category', 'name')
    .populate('assignedTo', 'displayName')
    .exec(function (err, items) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(items);
        }
    });
};

/**
 * Organization middleware
 */
exports.organizationByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Organization is invalid'
		});
	}

	Organization.findById(id).populate('user', 'displayName').exec(function(err, organization) {
		if (err) return next(err);
		if (!organization) {
			return res.status(404).send({
				message: 'Organization not found'
			});
		}
		req.organization = organization;
		next();
	});
};

/**
 * Organization authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.organization);
	//if (req.organization.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
