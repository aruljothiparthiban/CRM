'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	subscriptions = require('../../app/controllers/subscriptions.server.controller');

module.exports = function(app) {

    app.route('/subscriptions')
		.get(subscriptions.list)
		.post(users.requiresLogin, subscriptions.create);

    app.route('/subscriptions/:subscriptionId')
		.get(subscriptions.read)
		.put(users.requiresLogin, subscriptions.hasAuthorization, subscriptions.update)
		.delete(users.requiresLogin, subscriptions.hasAuthorization, subscriptions.delete);

    app.param('subscriptionId', subscriptions.subscriptionByID);
};
