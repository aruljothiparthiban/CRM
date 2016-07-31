'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	organizations = require('../../app/controllers/organizations.server.controller');

module.exports = function(app) {

    app.route('/organizations')
		.get(organizations.listByPage)
		.post(users.requiresLogin, organizations.create);


    app.route('/organizations/getall')
       .get(organizations.list);

    app.route('/organizations/:organizationId')
		.get(organizations.read)
		.put(users.requiresLogin, organizations.hasAuthorization, organizations.update);

    app.route('/organizations/remove')
		.post(users.requiresLogin, organizations.hasAuthorization, organizations.delete);

    app.param('organizationId', organizations.organizationByID);
};
