'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    adminUsers = require('../../app/controllers/admin-users.server.controller');

module.exports = function(app) {

    app.route('/admin/users')
		.get(adminUsers.listByPage)
		.post(users.requiresLogin, adminUsers.create);

    app.route('/auth/validate/invite/:token').get(adminUsers.validateToken);
        

    app.route('/admin/users/:userId')
		.get(adminUsers.read)
		.put(users.requiresLogin, adminUsers.hasAuthorization, adminUsers.update)
		.delete(users.requiresLogin, adminUsers.hasAuthorization, adminUsers.delete);

    app.param('userId', adminUsers.userByID);
};
