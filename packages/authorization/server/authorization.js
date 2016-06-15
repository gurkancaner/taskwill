/**
   * Publish the role
   */
Meteor.publish('role', function (roleId) {
  check(roleId, String);
  return Meteor.roles.find({
    _id: roleId
  });
});

/**
 * Publish the roles
 */
Meteor.publish('roles', function () {
  return Meteor.roles.find();
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

Meteor.methods({
  "addRole": function (name, permissions) {
    if (typeof permissions === 'undefined')
      permissions = [];

    Meteor.roles.insert({
      name: name,
      permissions: permissions
    });
  },
  "addPermissionsToRole": function (roleName, permissions) {
    if (typeof permissions === 'string') {
      permissions = [permissions];
    }
    Meteor.roles.update(
      {
        name: roleName
      }, {

        $push: {
          permissions: permissions
        }

      });
  }
});

