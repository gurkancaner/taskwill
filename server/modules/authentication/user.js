Accounts.onCreateUser(function (options, user) {
  var roleId = Meteor.roles.findOne({name:"volunteer"})._id;
  user.roles = [roleId];
  if (options.profile)
    user.profile = options.profile;
  return user;
});