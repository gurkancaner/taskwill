/**
 * Subscribes to role when user is modified (potentially his role)
 */
Tracker.autorun(function () {
  if (Meteor.user() && Meteor.user()._id) {
    Meteor.subscribe('userRoles');
    Meteor.subscribe('roles');
    Meteor.subscribe('users');
  }
});



/**
 * Checks if the current user has the permission
 */
Template.registerHelper('userCan', function (perms) {
  return Role.userCan(perms);
});
