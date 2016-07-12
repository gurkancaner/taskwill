Accounts.onCreateUser(function (options, user) {
  user.roles = [];
  var volunteerRole = Meteor.roles.findOne({ name: "Volunteer" });
  if (volunteerRole) {
    var roleId = volunteerRole._id;
    user.roles = [roleId];
  }
  user.level = 1;//visitors level is 0, every registered users' level is 1 initially
  if (Meteor.users.find().count() == 0){//if this is first user, make it manager
    user.roles.push(Meteor.roles.findOne({ name: "Manager" })._id);
    user.level = 10;
  }
  
  if (options.profile)
    user.profile = options.profile;
  return user;
});

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find(this.userId, {
      fields: {
        level: 1,
        rating:1,
        numberOfRating:1,
        totalRating:1
      }
    });
  }

});

Meteor.methods({
  "updateUser": function (id, name, level) {
    level = Number(level);
    Meteor.checkUserCan("manageUsers");
    if (level <= Meteor.user().level) {
      Meteor.users.update({
        _id: id,
        level: { $lte: Meteor.user().level }
      }, {
          $set: {
            "profile.name": name,
            level: level
          }
        });
    }
  }
});