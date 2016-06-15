/**
   * Returns the roles of the current user
   * @return {any}
   */
  Meteor.userRoles = function() {

    if (Meteor.userId()) {
      var roles = Meteor.roles.find({
        userId: Meteor.userId()
      });
      return roles !== undefined ? roles : null;
    }
    return null;
  };

  /**
   * Returns the role Ids of the current user
   * @return {any}
   */
  Meteor.roleIds = function() {
    var roles = Meteor.userRoles();
    return roles ? roles.map(function(doc) {
      return doc._id
    }) : null;
  };

  /**
   * Subscribes to role when user is modified (potentially his role)
   */
  Tracker.autorun(function() {
    if (Meteor.user() && Meteor.user()._id) {
      Meteor.subscribe('userRoles');
    }
  });

  /**
   * Checks if the current user has the permission
   */
  Template.registerHelper('userCan', function(perms) {
    return Role.userCan(perms);
  });
  