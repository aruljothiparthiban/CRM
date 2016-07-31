'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	People = mongoose.model('People'),
    Activity = mongoose.model('Activity'),
	_ = require('lodash'),
    async = require('async');

//var pagination = require('mongoose-pagination');

/**
 * Create a people
 */
exports.create = function (req, res) {
    var people = new People(req.body);
    people.createdBy = people.updatedBy = req.user._id;

    people.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(people);
        }
    });
};

/**
 * Show the current people
 */
exports.read = function (req, res) {
    res.json(req.people);
};

/**
 * Update a people
 */
exports.update = function (req, res) {
    var people = req.people;
    people = _.extend(people, req.body);

    people.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(people);
        }
    });
};

/**
 * Delete an people
 */
exports.delete = function (req, res) {
    People.find({ '_id': { $in: req.body } }).exec(function (err, peoples) {
        if (!err) {
            _.forEach(peoples, function (x) {
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
 * List of people
 */
exports.listByPage = function (req, res) {
    var pageindex = parseInt(req.query.pageIndex),
        pagesize = parseInt(req.query.pageSize),
        count = 0;

    async.waterfall([
        function (cb) {
            People.find().count({}, function (err, recordCount) {
                if (!err) {
                    count = recordCount;
                    cb();
                }
            });
        },
        function () {
            var query = (pageindex === 1) ? People.find().limit(pagesize) : People.find().skip(pagesize * (pageindex - 1)).limit(pagesize);
            query.sort('-updatedAt')
            .populate('createdBy', 'displayName')
            .populate('updatedBy', 'displayName')
            .populate('category', 'name')
            .populate('assignedTo', 'displayName')
            .exec(function (err, peoples) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var grid = {
                        pageIndex: pageindex,
                        pageSize: pagesize,
                        count: count,
                        items: peoples
                    };
                    res.json(grid);
                }
            });
        }
    ]);
};

exports.list = function (req, res) {    
    People.find().sort('-updatedAt')
    .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .populate('category', 'name')
    .populate('assignedTo', 'displayName')
    .exec(function (err, peoples) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(peoples);
        }
    });
};


/**
 * People middleware
 */
exports.peopleByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'People is invalid'
        });
    }

    People.findById(id).populate('user', 'displayName').exec(function (err, people) {
        if (err) return next(err);
        if (!people) {
            return res.status(404).send({
                message: 'People not found'
            });
        }
        req.people = people;
        next();    
    });
};

/**
 * People authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.people);
    //if (req.people.user.id !== req.user.id) {
    //	return res.status(403).send({
    //		message: 'User is not authorized'
    //	});
    //}
    next();
};
