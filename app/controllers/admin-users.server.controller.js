'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
    UserInvite = mongoose.model('UserInvite'),
    config = require('../../config/config'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	_ = require('lodash');

var crypto = require('crypto');

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
}

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Create a user
 */
exports.create = function (req, res) {
    var invite = new UserInvite(req.body);
    invite.createdBy = req.user._id;
    invite.token = randomValueHex(50);

    async.waterfall([
        function (cb) {
            User.findOne({ email: invite.email }, function (err, result) {
                if (result) {
                    return res.status(400).send(errorHandler.getError(invite.email + ' already exist!'));
                }
                else {
                    invite.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            cb(null,invite);    
                        }
                    });
                }
            });
        },
        function (invite, cb) {
            res.render('templates/user-invite-email', {
                name: req.user.displayName,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/#/register/'+invite.token
            }, function (err, emailHTML) {
                var mailOptions = {
                    to: invite.email,
                    from: config.mailer.from,
                    subject: 'Invitation for '+config.app.title,
                    html: emailHTML
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    if (!err) {
                        res.send({
                            message: 'An invitation has been sent to ' + invite.email + '.'
                        });
                    } else {
                        return res.status(400).send({
                            message: 'Failure sending email to '+invite.email
                        });
                    }
                });
            });
        }
    ], function(err,result) {
        console.log(err);
    });   
};

exports.validateToken = function (req, res) {    
    UserInvite.findOne({ token: req.params.token }).exec(function (err, invite) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(invite);
        }
    });
};

/**
 * Show the current user
 */
exports.read = function (req, res) {
    delete req.user.password;
    res.json(req.user);
};

/**
 * Update a user
 */
exports.update = function(req, res) {
	var user = req.user;
	user = _.extend(user, req.body);
	user.updated = new Date();
	user.updatedBy = req.user._id;

	user.save(function (err) {
	    if (err) {
	        return res.status(400).send({
	            message: errorHandler.getErrorMessage(err)
	        });
	    } else {
	        res.json(user);	        
	    }
	});
};

/**
 * Delete an user
 */
exports.delete = function(req, res) {
	var user = req.user;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(user);
		}
	});
};

/**
 * List of Users
 */
exports.listByPage = function (req, res) {
    var pageindex = parseInt(req.query.pageIndex),
        pagesize = parseInt(req.query.pageSize),
        count = 0;

    async.waterfall([
        function (cb) {
            User.find().count({}, function (err, recordCount) {
                if (!err) {
                    count = recordCount;
                    cb();
                }
            });
        },
        function () {
            var query = (pageindex === 1) ? User.find().limit(pagesize) : User.find().skip(pagesize * (pageindex - 1)).limit(pagesize);
            query.sort('-updatedAt')
            .populate('createdBy', 'displayName')
            .populate('updatedBy', 'displayName')
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



/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'User is invalid'
		});
	}

	User.findById(id).populate('user', 'displayName').exec(function (err, user) {
		if (err) return next(err);
		if (!user) {
			return res.status(404).send({
				message: 'User not found'
			});
		}
		req.user = user;
		next();
	});
};

/**
 * User authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //console.log(req.user);
    //console.log(req.user);
	//if (req.user.user.id !== req.user.id) {
	//	return res.status(403).send({
	//		message: 'User is not authorized'
	//	});
	//}
	next();
};
