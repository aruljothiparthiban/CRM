'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	boards = require('../../app/controllers/boards.server.controller');

module.exports = function(app) {

    app.route('/boards')
		.get(boards.list)
		.post(users.requiresLogin, boards.create);

    app.route('/boards/:boardId')
		.get(boards.read)
		.put(users.requiresLogin, boards.hasAuthorization, boards.update)
		.delete(users.requiresLogin, boards.hasAuthorization, boards.delete);

    app.param('boardId', boards.boardByID);
};
