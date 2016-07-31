'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	imports = require('../../app/controllers/import.server.controller');

module.exports = function(app) {

    app.route('/import/people')
        .post(users.requiresLogin, imports.hasAuthorization, imports.importToPeople);

    app.route('/import/organisation')
        .post(users.requiresLogin, imports.hasAuthorization, imports.importToOrganisation);
};
