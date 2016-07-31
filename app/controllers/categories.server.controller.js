'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Category = mongoose.model('Category'),
	_ = require('lodash');

/**
 * Create a category
 */
exports.create = function (req, res) {
    var category = new Category(req.body);
    category.createdBy = category.updatedBy = req.user._id;

    Category.findOne({ name: category.name }, function (err, cat) {
        if (cat) {
            return res.status(400).send(errorHandler.getError(category.name + ' already exist!'));
        }
        else {
            category.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(category);
                }
            });
        }
    });    
};

/**
 * Show the current category
 */
exports.read = function(req, res) {
    res.json(req.category);
};

/**
 * Update a category
 */
exports.update = function(req, res) {
	var category = req.category;
	category = _.extend(category, req.body);

	Category.findOne({ name: category.name }, function (err, cat) {
	    if (cat) {
	        return res.status(400).send(errorHandler.getError(category.name + ' already exist!'));
	    }
	    else {
	        category.save(function (err) {
	            if (err) {
	                return res.status(400).send({
	                    message: errorHandler.getErrorMessage(err)
	                });
	            } else {
	                res.json(category);
	            }
	        });
	    }
	});	
};

/**
 * Delete an category
 */
exports.delete = function(req, res) {
	var category = req.category;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Category.find().sort('-updatedAt').populate('createdBy', 'displayName').populate('updatedBy','displayName').exec(function(err, categories) {
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
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Category is invalid'
		});
	}

	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (!category) {
			return res.status(404).send({
				message: 'Category not found'
			});
		}
		req.category = category;
		next();
	});
};

/**
 * Category authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.category);
	//if (req.category.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
