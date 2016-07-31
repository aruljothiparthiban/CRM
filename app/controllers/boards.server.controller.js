'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Board = mongoose.model('Board'),
	_ = require('lodash');

/**
 * Create a board
 */
exports.create = function (req, res) {
    var board = new Board(req.body);
    board.createdBy = board.updatedBy = req.user._id;

    Board.findOne({ name: board.name }, function (err, cat) {
        if (cat) {
            return res.status(400).send(errorHandler.getError(board.name + ' already exist!'));
        }
        else {
            board.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(board);
                }
            });
        }
    });    
};

/**
 * Show the current board
 */
exports.read = function(req, res) {
    res.json(req.board);
};

/**
 * Update a board
 */
exports.update = function(req, res) {
	var board = req.board;
	board = _.extend(board, req.body);

	Board.findOne({ name: board.name }, function (err, cat) {
	    if (cat) {
	        return res.status(400).send(errorHandler.getError(board.name + ' already exist!'));
	    }
	    else {
	        board.save(function (err) {
	            if (err) {
	                return res.status(400).send({
	                    message: errorHandler.getErrorMessage(err)
	                });
	            } else {
	                res.json(board);
	            }
	        });
	    }
	});	
};

/**
 * Delete an board
 */
exports.delete = function(req, res) {
	var board = req.board;

	board.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(board);
		}
	});
};

/**
 * List of Board
 */
exports.list = function(req, res) {
	Board.find().sort('-updatedAt').populate('createdBy', 'displayName').populate('updatedBy','displayName').exec(function(err, categories) {
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
 * Board middleware
 */
exports.boardByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Board is invalid'
		});
	}

	Board.findById(id).populate('user', 'displayName').exec(function(err, board) {
		if (err) return next(err);
		if (!board) {
			return res.status(404).send({
				message: 'Board not found'
			});
		}
		req.board = board;
		next();
	});
};

/**
 * Board authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.board);
	//if (req.board.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
