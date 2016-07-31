'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	activities = require('../../app/controllers/activities.server.controller');

module.exports = function(app) {

    app.route('/activities')
		.get(activities.listByPage)
		.post(users.requiresLogin, activities.create);

    app.route('/activities/getall')
       .get(activities.list);

    app.route('/activities/getall/:peopleId')
       .get(activities.listByPeople);

    app.route('/activities/:activityId')
		.get(activities.read)
		.put(users.requiresLogin, activities.hasAuthorization, activities.update);

    app.route('/activities/remove')
		.post(users.requiresLogin, activities.hasAuthorization, activities.delete);

    app.param('activityId', activities.activityByID);
};
