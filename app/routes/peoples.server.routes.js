'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	peoples = require('../../app/controllers/peoples.server.controller');

module.exports = function(app) {

    app.route('/peoples')
		.get(peoples.listByPage)
		.post(users.requiresLogin, peoples.create);

    app.route('/peoples/getall')
       .get(peoples.list);

    app.route('/peoples/:peopleId')
		.get(peoples.read)
		.put(users.requiresLogin, peoples.hasAuthorization, peoples.update);

    app.route('/peoples/remove')
        .post(users.requiresLogin, peoples.hasAuthorization, peoples.delete);

    app.param('peopleId', peoples.peopleByID);
};
