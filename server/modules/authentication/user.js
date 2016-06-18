Accounts.onCreateUser(function (options, user) {
  user.roles = [];
  var volunteerRole = Meteor.roles.findOne({name:"Volunteer"});
  if(volunteerRole){
    var roleId = volunteerRole._id;
    user.roles = [roleId];
  }  
  if (options.profile)
    user.profile = options.profile;
  return user;
});