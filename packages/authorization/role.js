/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Gurkan Caner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * The Roles collection
 * @type {Mongo.Collection}
 */
Meteor.roles = new Mongo.Collection('roles');
Meteor.userCan = function (permission) {
    if (Meteor.userId()) {
        return Role.userCan(permission, Meteor.userId());
    }
    return false;
}
Meteor.checkUserCan = function (permission) {
    if (!Meteor.userCan(permission)) {
        throw new Meteor.Error("No permission!");
    }
}


Role = {
    AuthorizationPermissions: {
        manageRoles: "Manage roles; view, create, edit, delete roles",
        manageUsers: "Manage users; view, edit, delete users, change user roles",
        assignRole: "Assign roles to users",

    },
    /**
     * Throws an error if the role does not have the permissions
     * @param perms
     * @param roleId
     */
    checkRolePerms: function (perms, roleId) {
        if (!this.roleCan(perms, roleId)) {
            throw new Meteor.Error('forbidden');
        }
    },

    /**
     * Throws an error if the user does not have the permissions
     * @param perms
     * @param userId
     */
    checkUserPerms: function (perms, userId) {
        if (!this.userCan(perms, userId)) {
            throw new Meteor.Error('forbidden');
        }
    },

    /**
     * Returns the user's role
     * @param userId
     */
    getUserRoles: function (userId) {
        var user = Meteor.users.find(userId, {
            fields: {
                roleId: 1
            }
        });
        return user ? user.roles : null;
    },

    /**
     * Checks if the role has a permission
     * @param perms
     * @param roleId
     * @return {boolean}
     */
    roleCan: function (perms, roles) {
        if (typeof roles === 'string') {
            roles = [roles];
        }
        this.checkPermissionsExistance(perms);
        if (typeof perms === 'string') {
            return Meteor.roles.find({
                _id: { $in: roles },
                permissions: perms
            }).count() > 0;

        } else if (perms instanceof Array) {
            return Meteor.roles.find({
                _id: { $in: roles },
                permissions: {
                    $all: perms
                }
            }).count() > 0;
        }
        return false;
    },

    /**
     * Checks if the user has the permission
     * @param perms
     * @param userId
     * @return {boolean}
     */
    userCan: function (perms, userId) {
        // Check if actions is a string or array
        if (typeof perms === 'string') {
            perms = [perms];

        } else if (!(perms instanceof Array)) {
            throw new Meteor.Error('invalid-permissions', "Permissions must be an Array of strings");
        }

        // Nothing to verify
        if (perms.length === 0) {
            return true;
        }

        var roles = [];

        // Get role id
        if (Meteor.isClient) {
            if(Meteor.user() !== undefined)
                roles = Meteor.user().roles;

        } else if (Meteor.isServer) {
            if (typeof userId !== 'string' || userId.length < 1) {
                return false;
            }
            var user = Meteor.users.findOne(userId);
            roles = user && user.roles;
        }
        return roles === undefined ? false : this.roleCan(perms, roles);
    },
    checkPermissionsExistance: function (permissions) {
        for (permission of permissions) {
            if (!Role.AuthorizationPermissions.hasOwnProperty(permission))
                throw new Meteor.Error("Undefined permissions", "Permission should be added to AuthorizationPermissions list by developer!");
        }
    }
};

