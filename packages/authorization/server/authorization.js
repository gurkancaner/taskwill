/**
 * Publish the users
 */
Meteor.publish('users', function () {
  if (Role.userCan("manageUsers", this.userId)) {
    return Meteor.users.find();
  }
  return this.ready();
});
/**
 * Publish the roles
 */
Meteor.publish('roles', function () {
  if (Role.userCan("manageRoles", this.userId)) {
    return Meteor.roles.find();
  }
  return this.ready();
});

/**
 * Publish the roles of the current user
 */
Meteor.publish('userRoles', function () {
  if (!this.userId) {
    return this.ready();
  }
  var user = Meteor.users.findOne(this.userId, {
    fields: {
      roles: 1
    }
  });
  if (user && user.roles) {
    return [
      Meteor.roles.find({
        _id: {
          $in: user.roles
        }
      }),
      Meteor.users.find({
        _id: this.userId
      }, {
          fields: {
            roles: 1
          }
        })
    ];
  }
});
Meteor.startup(function () {
  if (Meteor.roles.find().count() == 0) {
    //create default roles
    Meteor.roles.insert({ name: "Volunteer", permissions: ["volunteerForTask"] });
    Meteor.roles.insert({ name: "Requester", permissions: ["volunteerForTask", "createTask"] });
    Meteor.roles.insert({ name: "Manager", permissions: ["volunteerForTask", "createTask", "manageRoles", "manageUsers", "manageTasks", "changeSettings"] });
  }
});
Meteor.methods({
  //creates or updates role
  "createRole": function (id, name, permissions) {
    Meteor.checkUserCan("manageRoles");
    if (typeof permissions === 'undefined')
      permissions = [];

    Meteor.roles.update({
      _id: id
    }, {
        name: name,
        permissions: permissions
      },
      { upsert: true });
  },
  "deleteRole": function (id) {
    Meteor.checkUserCan("manageRoles");

    Meteor.roles.remove(id);
    Meteor.users.update({ roles: id }, {
      $pull: {
        roles: id
      }
    });

  },
  "addPermissionsToRole": function (roleName, permissions) {
    Meteor.checkUserCan("manageRoles");
    if (typeof permissions === 'string') {
      permissions = [permissions];
    }
    Meteor.roles.update(
      {
        name: roleName
      }, {

        $addToSet: {
          permissions: permissions
        }

      });
  },/**
     * Sets the user's role
     * @param userId
     * @param roles array of role ids or just a role id
     */
  setUserRoles: function (userId, roles) {
    Meteor.checkUserCan("manageUsers");
    // Check if roles is a string or array
    if (typeof roles === 'string') {
      roles = [roles];

    } else if (!(roles instanceof Array)) {
      throw new Meteor.Error('invalid-permissions', "Roles must be an Array of numbers");
    }
    // Check if role exists
    if (roles && Meteor.roles.find({
      _id: {
        $in: roles
      }
    }).count() < roles.length) {
      throw new Meteor.Error('role-not-found', "The role does not exist");
    }
    return Meteor.users.update(userId, {
      $set: {
        roles: roles
      }
    });
  },
});

