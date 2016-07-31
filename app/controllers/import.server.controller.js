'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	People = mongoose.model('People'),
    Category = mongoose.model('Category'),
    User = mongoose.model('User'),
    Organization = mongoose.model('Organization'),
    Subscription = mongoose.model('Subscription'),
    Board = mongoose.model('Board'),
	_ = require('lodash'),
    csv = require('csv-parser'),
    fs = require('fs'),
    async = require('async');

/**
 * Import CSV to peoples collection
 */
exports.importToPeople = function (req, res) {
    var file = req.files[0];
    var categories = {};
    var users = {};
    if (file) {
        fs.createReadStream(file.path).pipe(csv()).on('data', function (data) {
            async.waterfall([
                function (cb) {
                    Category.findOne({ 'name': data.Category }, function (err, category) {
                        if (!err && category) {
                            data.Category = category._id;
                            cb(null, data);
                        }
                    });
                },
                function (data, cb) {                   
                    var organisations = [];
                    Organization.findOne({ 'name': data.Organisations }, function (err, org) {
                        if (!err && org) {
                            organisations.push(org._id);
                            data.Organisations = organisations;
                            cb(null, data);
                        }
                    });
                },
                function (data, cb) {
                    var subscriptions = [];                    
                    if (data.Subscriptions) {
                        data.Subscriptions = data.Subscriptions.split(',');
                        Subscription.find({ 'name': { $in: data.Subscriptions }}, function (err, subs) {
                            if (!err && subs) {
                                _.forEach(subs, function (x) {
                                    subscriptions.push(x._id);
                                });
                                subscriptions = _.uniq(subscriptions);
                                data.Subscriptions = subscriptions;
                                cb(null, data);
                            }
                        });
                    }
                    else {
                        data.Subscriptions = subscriptions;
                        cb(null, data);
                    }
                },
                function (data, cb) {
                    var boards = [];
                    if (data.Boards) {
                        data.Boards = data.Boards.split(',');
                        Board.find({ 'name': { $in: data.Boards } }, function (err, brds) {
                            if (!err && brds) {
                                _.forEach(brds, function (x) {
                                    boards.push(x._id);
                                });
                                boards = _.uniq(boards);
                                data.Boards = boards;
                                cb(null, data);
                            }
                        });
                    }
                    else {
                        data.Boards = boards;
                        cb(null, data);
                    }
                },
                function (data, cb) {
                    if (!users[data.AssignedTo]) {
                        User.findOne({ 'email': data.AssignedTo }, function (err, user) {
                            if (!err && user) {
                                data.AssignedTo = user._id;
                                users[data.AssignedTo] = user;
                                cb(null, data);
                            }
                        });
                    }
                    else {
                        data.AssignedTo = users[data.AssignedTo]._id;
                        cb(null, data);
                    }
                },
                function (data, cb) {                    
                    var people = new People({
                        title: data.Title,
                        firstName: data.FirstName,
                        lastName: data.LastName,
                        position: data.Position,
                        category: data.Category,
                        assignedTo: data.AssignedTo,
                        organizations: data.Organisations,
                        subscriptions: data.Subscriptions,
                        boards : data.Boards,
                        primaryEmail: data.PrimaryEmail,
                        secondaryEmail: data.SecondaryEmail,
                        primaryPhone: data.PrimaryPhone,
                        secondaryPhone: data.SecondaryPhone,
                        address: {
                            line1: data.AddressLine1 || '',
                            line2: data.AddressLine2 || '',
                            suburb: data.Suburb || '',
                            postcode:data.Postcode||''
                        }
                    });
                    cb(null, people);
                },
                function (people, cb) {
                    console.log('people',people);
                    people.createdBy = people.updatedBy = req.user._id;
                    people.save(function (err) {
                        if (err) {
                            console.log('err',err);
                        }
                    });
                }
            ]);
        });
        res.json({
            success: true,
            message: 'File uploaded successfully!'
        });
    }
    else {
        res.status(500).json({
            success: false,
            message:'Error'
        });
    }    
};

/**
 * Import CSV to organisations collection
 */
exports.importToOrganisation = function (req, res) {
    var file = req.files[0];
    var categories = {};
    var users = {};
    if (file) {
        fs.createReadStream(file.path).pipe(csv()).on('data', function (data) {
            async.waterfall([
                function (cb) {
                    Category.findOne({ 'name': data.Category }, function (err, category) {
                        if (!err && category) {
                            data.Category = category._id;
                            cb(null, data);
                        }
                    });
                },
                function (data, cb) {
                    var peoples = [];
                    if (data.Peoples) {
                        data.Peoples = data.Peoples.split(',');
                        People.find({ 'primaryEmail': { $in: data.Peoples } }, function (err, peopleArray) {
                            if (!err && peopleArray) {
                                _.forEach(peopleArray, function (x) {
                                    peoples.push(x._id);
                                });
                                peoples = _.uniq(peoples);
                                data.Peoples = peoples;
                                cb(null, data);
                            }
                        });
                    }
                    else {
                        data.Peoples = peoples;
                        cb(null, data);
                    }
                },                
                function (data, cb) {
                    if (!users[data.AssignedTo]) {
                        User.findOne({ 'email': data.AssignedTo }, function (err, user) {
                            if (!err && user) {
                                data.AssignedTo = user._id;
                                users[data.AssignedTo] = user;
                                cb(null, data);
                            }
                        });
                    }
                    else {
                        data.AssignedTo = users[data.AssignedTo]._id;
                        cb(null, data);
                    }
                },
                function (data, cb) {
                    var organisation = new Organization({
                        name: data.Name,
                        category: data.Category,
                        assignedTo: data.AssignedTo,
                        peoples: data.Peoples,
                        address: {
                            line1: data.AddressLine1 || '',
                            line2: data.AddressLine2 || '',
                            suburb: data.Suburb || '',
                            postcode: data.Postcode || ''
                        },
                        notes:data.Notes
                    });
                    cb(null, organisation);
                },
                function (organisation, cb) {
                    organisation.createdBy = organisation.updatedBy = req.user._id;
                    organisation.save(function (err) {
                        if (err) {
                            console.log('err', err);
                        }
                    });
                }
            ]);
        });
        res.json({
            success: true,
            message: 'File uploaded successfully!'
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: 'Error'
        });
    }
};

/**
 * Import authorization middleware
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
