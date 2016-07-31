define([
    'app',
    '_'
], function (app,_) {
    'use strict';

    app.service('Menus', ['Authentication',
        function (Authentication) {
            var menus = [];
            menus.push({
                title: 'Peoples',
                routeName: 'home.peoples',
                roles: ['admin', 'commsteam','user'],
                iconCss: 'fa fa-users',
                allowedSubRoutes: [
                    {
                        route: 'home.peopleNew',
                        roles: ['admin', 'commsteam', 'user']
                    },
                    {
                        route: 'home.peopleEdit',
                        roles: ['admin', 'commsteam', 'user']
                    },
                    {
                        route: 'home.peopleDetail',
                        roles: ['admin', 'commsteam', 'user']
                    }
                ]
            });
            menus.push({
                title: 'Organizations',
                routeName: 'home.organizations',
                roles: ['admin', 'commsteam','user'],
                iconCss: 'fa fa-cubes',
                allowedSubRoutes: [
                    {
                        route: 'home.organizationNew',
                        roles: ['admin', 'commsteam', 'user']
                    },
                    {
                        route: 'home.organizationEdit',
                        roles: ['admin', 'commsteam', 'user']
                    },
                    {
                        route: 'home.organizationDetail',
                        roles: ['admin', 'commsteam', 'user']
                    }
            ]
            });
            menus.push({
                title: 'Activities',
                routeName: 'home.activities',
                roles: ['admin', 'commsteam', 'user'],
                iconCss: 'fa fa-tasks',
                allowedSubRoutes: [
                    {
                        route: 'home.activityNew',
                        roles:['admin', 'commsteam', 'user']
                    },
                    {
                        route: 'home.activityEdit',
                        roles: ['admin', 'commsteam', 'user']
                    },
                    {
                        route: 'home.activityDetail',
                        roles: ['admin', 'commsteam', 'user']
                    }
                ]
            });
            menus.push({
                title: 'Configuration',
                routeName: '#',
                roles: ['admin', 'commsteam'],
                iconCss: 'fa fa-cog',
                subMenus: [
                    {
                        title: 'Categories',
                        routeName: 'home.categories',
                        roles: ['admin', 'commsteam']
                    },
                    {
                        title: 'Subscriptions',
                        routeName: 'home.subscriptions',
                        roles: ['admin', 'commsteam']
                    },
                    {
                        title: 'Boards',
                        routeName: 'home.boards',
                        roles: ['admin', 'commsteam']
                    },
                    {
                        title: 'Activity Types',
                        routeName: 'home.activityTypes',
                        roles: ['admin', 'commsteam']
                    }
               ]
            });

            menus.push({
                title: 'User Account Settings',
                routeName: '#',
                roles: ['admin', 'commsteam'],
                iconCss: 'fa fa-wrench',
                subMenus: [
                    {
                        title: 'Users',
                        routeName: 'home.users',
                        roles: ['admin', 'commsteam'],
                        hasRoleBasedAccess:true
                    },
                    {
                        title: 'Invite User',
                        routeName: 'home.inviteUser',
                        roles: ['admin']
                    }
                ]
            });

            menus.push({
                title: 'Import Data',
                routeName: 'home.import',
                roles: ['admin','commsteam'],
                iconCss: 'fa fa-database'
            });

            menus.push({
                title: 'Export',
                routeName: '#',
                roles: ['admin'],
                iconCss:'fa fa-file-excel-o',
                subMenus: [
                    {
                        title: 'Peoples',
                        routeName: 'home.exportPeoples',
                        roles: ['admin']
                    },
                    {
                        title: 'Organisations',
                        routeName: 'home.exportOrganisations',
                        roles: ['admin']
                    },
                    {
                        title: 'Activities',
                        routeName: 'home.exportActivities',
                        roles: ['admin']
                    }
                ]
            });

            var query = function (role) {
                return _.filter(menus, function (m) {
                    var match = m.roles.indexOf(role) !== -1;
                    if (match && m.subMenus) {
                        m.subMenus = _.filter(m.subMenus, function (sm) {                            
                            return !sm.roles || sm.roles.indexOf(role) !== -1;
                        });
                    }
                    return match;
                });
            };

            return {
                query : query
            };
        }
    ]);
});