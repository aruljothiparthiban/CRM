'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	activityTypes = require('../../app/controllers/activityTypes.server.controller');

module.exports = function(app) {
    app.route('/activitytypes')
		.get(activityTypes.list)
		.post(users.requiresLogin, activityTypes.create);

    app.route('/activitytypes/:activityTypeId')
		.get(activityTypes.read)
		.put(users.requiresLogin, activityTypes.hasAuthorization, activityTypes.update)
		.delete(users.requiresLogin, activityTypes.hasAuthorization, activityTypes.delete);

    app.param('activityTypeId', activityTypes.activityTypeByID);
};
